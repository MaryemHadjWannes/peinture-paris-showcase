// server.ts
import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import { Resend } from "resend";
import fs from "fs";
import googleReviewsApi from "./googleReviewsApi";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v2 as cloudinary } from 'cloudinary'; // Import Cloudinary

// ESM fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, ".env") });

console.log('Loading .env from:', path.resolve(__dirname, ".env"));

/* ---------- VALIDATE ENV & CLOUDINARY CONFIG ---------- */
const required = [
  "JWT_SECRET", 
  "ADMIN_EMAIL", 
  "ADMIN_PASSWORD", 
  "CORS_ORIGIN",
  "CLOUDINARY_CLOUD_NAME", // Added to required list
  "CLOUDINARY_API_KEY",    // Added to required list
  "CLOUDINARY_API_SECRET", // Added to required list
];
required.forEach(v => {
  if (!process.env[v]) {
    console.error(`Missing env var ${v}`);
    process.exit(1);
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
// ----------------------------------------------------

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------------------------------- */
/* CORRECTED CORS CONFIGURATION    */
/* ---------------------------------- */
const allowedOrigin = process.env.CORS_ORIGIN;
const allowedOrigins = [
  // Allow the origin defined in .env (e.g., local:8080 or deployed URL)
  ...(allowedOrigin ? [allowedOrigin] : []),
  // Optional: Allow the secure version of localhost
  'http://127.0.0.1:8080', 
];

app.use(
  cors({
    origin: (origin, callback) => {
      // 1. Allow requests with no origin (e.g., same-origin requests or tools like Postman)
      // 2. Allow if the origin is explicitly in the allowed list.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS Blocked: Origin ${origin} not in allowed list.`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- TEMP UPLOAD DIR ---------- */
const tempDir = path.join(process.cwd(), "temp_uploads");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const tempStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, tempDir),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const adminUpload = multer({
  storage: tempStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (!file.originalname.match(/\.(jpe?g|png|webp)$/i)) {
      return cb(new Error("Only images"));
    }
    cb(null, true);
  },
});

/* ---------- CONTACT FORM UPLOAD ---------- */
const contactUploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(contactUploadDir)) fs.mkdirSync(contactUploadDir, { recursive: true });
const contactStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, contactUploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const contactUpload = multer({ storage: contactStorage, limits: { fileSize: 5 * 1024 * 1024 } });

/* ---------- JWT MIDDLEWARE ---------- */
const authenticate = (req: Request, res: Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

/* ---------- CATEGORY → FOLDER MAP ---------- */
const folderMap: Record<string, string> = {
  enduit: "ENDUIT",
  "peinture-interieure": "PEINTURE INTERIEUR",
  "escalier-details": "ESCALIER",
  "avant-apres": "AVANT-APRES",
};

/* ---------- ADMIN LOGIN ---------- */
app.post("/api/admin/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET!, { expiresIn: "24h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

/* ---------- UPLOAD IMAGE ---------- */
/* ---------- UPLOAD IMAGE (Cloudinary) ---------- */
app.post("/api/admin/upload", authenticate, adminUpload.single("image"), async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No file" });

  const catId = (req.body.category as string).toLowerCase();
  const targetFolder = folderMap[catId];
  const tempFilePath = req.file.path; // Path to the temporary local file
  
  if (!targetFolder) {
    fs.unlinkSync(tempFilePath); // Delete temp file
    return res.status(400).json({ error: "Invalid category" });
  }

  try {
    // 1. UPLOAD TO CLOUDINARY
    const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
      folder: `peinture-paris-showcase/${targetFolder}`, // Cloudinary folder structure
      use_filename: true, // Use the original filename
      unique_filename: false,
      overwrite: false, // Ensure we don't accidentally overwrite
    });
    
    // 2. DELETE TEMPORARY LOCAL FILE
    fs.unlinkSync(tempFilePath); 

    // 3. RETURN CLOUDINARY DATA
    // We use the full Cloudinary URL and the public_id for future deletes
    res.json({ 
      url: uploadResult.secure_url, 
      publicId: uploadResult.public_id,
      filename: req.file.filename, // Keep original filename for admin UI
    });

  } catch (err) {
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath); // Clean up temp file on failure
    console.error("Cloudinary Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* ---------- DELETE IMAGE ---------- */
/* ---------- DELETE IMAGE (Cloudinary) ---------- */
app.delete("/api/admin/delete/:publicId", authenticate, async (req: Request, res: Response) => {
  try {
    // We now use publicId, not category/filename
    const { publicId } = req.params;

    // 1. DELETE FROM CLOUDINARY
    const deleteResult = await cloudinary.uploader.destroy(publicId);
    
    if (deleteResult.result === 'not found') {
      return res.status(404).json({ error: "File not found on Cloudinary" });
    }

    // 2. SUCCESS
    res.json({ message: "Deleted", result: deleteResult });

  } catch (err) {
    console.error("Cloudinary Delete failed:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

/* ---------- LIST IMAGES ---------- */
/* ---------- LIST IMAGES (UPDATED FOR CLOUDINARY) ---------- */
app.get("/api/admin/images/:category", authenticate, async (req: Request, res: Response) => {
  try {
    const cat = req.params.category.toLowerCase();
    const folder = folderMap[cat];
    if (!folder) return res.status(400).json({ error: "Invalid category" });

    // 1. CONSTRUCT THE CLOUDINARY FOLDER PATH
    const cloudinaryFolder = `peinture-paris-showcase/${folder}`;

    // 2. FETCH RESOURCES (IMAGES) FROM CLOUDINARY
    // NOTE: This call requires a valid API Key and Secret
    const result = await cloudinary.api.resources({
      type: 'upload', // Only fetch uploaded resources
      prefix: cloudinaryFolder, // Filter by the folder path
      max_results: 500, // Increase if you expect more than 500 images per category
      fields: ['secure_url', 'public_id', 'filename'], // Only request needed fields
      context: true, // If you ever add context metadata
    });

    // 3. MAP THE RESULTS TO THE EXPECTED FRONTEND FORMAT
    const files = result.resources
      .map((resource: any) => ({
        // secure_url provides the full HTTPS CDN link
        url: resource.secure_url, 
        // public_id is required for deletion and uniqueness
        publicId: resource.public_id, 
        // Use the base filename from Cloudinary data if available, otherwise fallback
        filename: resource.filename || path.basename(resource.public_id), 
      }));

    res.json({ files });
  } catch (err) {
    console.error("Cloudinary List failed:", err);
    // Cloudinary's API call can fail if the folder doesn't exist, treat it as an empty array
    if (err instanceof Error && 'http_code' in err && err.http_code === 404) {
      return res.json({ files: [] }); 
    }
    res.status(500).json({ error: "List failed" });
  }
});

/* ---------- GOOGLE REVIEWS (unchanged) ---------- */
app.use("/api", googleReviewsApi);

/* ---------- CONTACT FORM ---------- */
const resend = new Resend(process.env.RESEND_API_KEY);
app.post("/upload", contactUpload.array("photos"), async (req: Request, res: Response) => {
  const recipient = process.env.EMAIL_USER || "hn.renovation.fr@gmail.com";
  const files = req.files as Express.Multer.File[] | undefined;
  const fields = req.body;
  const paths: string[] = [];

  try {
    const attachments = files?.map(f => {
      paths.push(f.path);
      return {
        filename: f.originalname,
        content: fs.readFileSync(f.path).toString("base64"),
        contentType: f.mimetype,
        encoding: "base64",
      };
    });

    await resend.emails.send({
      from: `${fields.name} <${fields.email}>`,
      to: [recipient],
      subject: `Devis: ${fields.project}`,
      html: `<p><strong>Nom:</strong> ${fields.name}<br/><strong>Email:</strong> ${fields.email}<br/><strong>Tél:</strong> ${fields.phone}<br/><strong>Projet:</strong> ${fields.project}<br/><strong>Message:</strong> ${fields.message}</p>`,
      attachments,
    });

    paths.forEach(p => fs.unlinkSync(p));
    res.json({ message: "Envoyé !" });
  } catch (err) {
    paths.forEach(p => fs.unlinkSync(p));
    console.error(err);
    res.status(500).json({ error: "Erreur envoi" });
  }
});

/* ---------- SERVE FRONTEND (PRODUCTION) ---------- */
const frontend = path.join(process.cwd(), "dist");
app.use(express.static(frontend));
app.get(/.*/, (_: Request, res: Response) => res.sendFile(path.join(frontend, "index.html")));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));