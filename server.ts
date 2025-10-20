import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import { Resend } from "resend";
import fs from "fs";
import googleReviewsApi from "./googleReviewsApi";
import dotenv from "dotenv";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import jwt from "jsonwebtoken";
import { Pool } from "pg";

// Load environment variables
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath, debug: true });
console.log('Loading .env from:', envPath);
console.log('DATABASE_URL:', process.env.DATABASE_URL || 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET || 'Not set');
console.log('Environment variables loaded:', Object.keys(process.env).length);

// Validate critical environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Error: ${varName} is not defined in .env file`);
    process.exit(1);
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

// Postgres Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test DB connection
pool.connect((err) => {
  if (err) {
    console.error('DB Connection Error:', err.message, err.stack);
    process.exit(1);
  } else {
    console.log('Connected to Postgres!');
  }
});

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer for contact form
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Multer for admin uploads
const uploadMemory = multer({ storage: multer.memoryStorage() });

// Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// JWT Auth Middleware
const authenticate = (req: Request, res: Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    jwt.verify(token, process.env.JWT_SECRET!); // Non-null assertion since validated
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin Routes
app.post("/api/admin/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email, password, 'Expected:', process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Public: Fetch data
app.get("/api/:table", async (req: Request, res: Response) => {
  const { table } = req.params;
  const validTables = ['contact', 'about', 'services', 'portfolio'];
  if (!validTables.includes(table)) {
    return res.status(400).json({ error: 'Invalid table' });
  }
  try {
    const result = await pool.query('SELECT * FROM $1 LIMIT 1', [table]);
    res.json(result.rows[0] || {});
  } catch (err: any) {
    console.error(`Error fetching from ${table}:`, err.message, err.stack);
    res.status(500).json({ error: 'DB error' });
  }
});

// Admin: Update data
app.put("/api/admin/:table", authenticate, async (req: Request, res: Response) => {
  const { table } = req.params;
  const { id, ...data } = req.body;
  const validTables = ['contact', 'about', 'services', 'portfolio'];
  if (!validTables.includes(table)) return res.status(400).json({ error: 'Invalid table' });
  try {
    const keys = Object.keys(data);
    const set = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = keys.map(k => data[k]);
    await pool.query(`UPDATE ${table} SET ${set} WHERE id = $${keys.length + 1}`, [...values, id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// Admin: Upload image to Cloudinary
app.post("/api/admin/upload-image", authenticate, uploadMemory.single("image"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileBuffer = req.file!.buffer;
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "hn-renovation/portfolio", quality: "auto", fetch_format: "auto" },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload failed"));
          } else {
            resolve(result);
          }
        }
      );
      stream.end(fileBuffer);
    });
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Admin: Delete image from Cloudinary
app.delete("/api/admin/delete-image", authenticate, async (req: Request, res: Response) => {
  const { publicId } = req.body;
  try {
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// Existing Routes
app.use("/api", googleReviewsApi);
app.post("/upload", upload.array("photos"), async (req: Request, res: Response) => {
  const recipientEmail = process.env.EMAIL_USER || "hn.renovation.fr@gmail.com";
  let filePaths: string[] = [];

  try {
    const fields = req.body;
    const files = req.files as Express.Multer.File[] | undefined;

    const attachments = files?.map(f => {
      filePaths.push(f.path);
      return {
        filename: f.originalname,
        content: fs.readFileSync(f.path).toString("base64"),
        contentType: f.mimetype,
        encoding: "base64"
      };
    });

    const sendResult = await resend.emails.send({
      from: `${fields.name} <${fields.email}>`,
      to: [recipientEmail],
      subject: `Nouvelle demande de devis: ${fields.project}`,
      html: `<p><strong>Nom:</strong> ${fields.name}<br/><strong>Email:</strong> ${fields.email}<br/><strong>Téléphone:</strong> ${fields.phone}<br/><strong>Projet:</strong> ${fields.project}<br/><strong>Message:</strong> ${fields.message}</p>`,
      attachments
    });

    console.log("Resend API Email Accepted. Tracing ID:", sendResult.data?.id);
    console.log("Full Resend Response:", JSON.stringify(sendResult));

    filePaths.forEach(filePath => {
      try {
        fs.unlinkSync(filePath);
        console.log(`Successfully deleted file: ${filePath}`);
      } catch (cleanupErr) {
        console.error(`Failed to delete file ${filePath}:`, cleanupErr);
      }
    });

    if (sendResult.error) throw new Error(sendResult.error.message);
    res.json({ message: "Formulaire envoyé avec succès !" });
  } catch (err) {
    console.error("Resend API Error during sendMail:", err);
    filePaths.forEach(filePath => {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupErr) {
        console.error(`Failed to delete file on error ${filePath}:`, cleanupErr);
      }
    });
    res.status(500).json({ error: "Erreur lors de l'envoi de l'email." });
  }
});

// Serve frontend
const frontendPath = path.join(process.cwd(), "dist");
app.use(express.static(frontendPath));
app.get(/^(?!\/(api|upload)).*$/, (_: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));