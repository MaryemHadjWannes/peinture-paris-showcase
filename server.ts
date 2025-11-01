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

// ESM fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, ".env") });

console.log('Loading .env from:', path.resolve(__dirname, ".env"));

/* ---------- VALIDATE ENV ---------- */
const required = ["JWT_SECRET", "ADMIN_EMAIL", "ADMIN_PASSWORD", "CORS_ORIGIN"]; // Added CORS_ORIGIN
required.forEach(v => {
  if (!process.env[v]) {
    console.error(`Missing env var ${v}`);
    process.exit(1);
  }
});

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
app.post("/api/admin/upload", authenticate, adminUpload.single("image"), (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file" });

    const catId = (req.body.category as string).toLowerCase();
    const targetFolder = folderMap[catId];
    if (!targetFolder) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Invalid category" });
    }

    const finalPath = path.join(process.cwd(), "public", "photos", targetFolder, req.file.filename);
    fs.mkdirSync(path.dirname(finalPath), { recursive: true });
    fs.renameSync(req.file.path, finalPath);

    const url = `/photos/${targetFolder}/${req.file.filename}`;
    res.json({ url, filename: req.file.filename });
  } catch (err) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* ---------- DELETE IMAGE ---------- */
app.delete("/api/admin/delete/:category/:filename", authenticate, (req: Request, res: Response) => {
  try {
    const { category, filename } = req.params;
    const folder = folderMap[category.toLowerCase()];
    if (!folder) return res.status(400).json({ error: "Invalid category" });

    const filePath = path.join(process.cwd(), "public", "photos", folder, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: "Deleted" });
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

/* ---------- LIST IMAGES ---------- */
app.get("/api/admin/images/:category", authenticate, (req: Request, res: Response) => {
  try {
    const cat = req.params.category.toLowerCase();
    const folder = folderMap[cat];
    if (!folder) return res.status(400).json({ error: "Invalid category" });

    const dir = path.join(process.cwd(), "public", "photos", folder);
    if (!fs.existsSync(dir)) return res.json({ files: [] });

    const files = fs
      .readdirSync(dir)
      .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
      .map(f => ({
        url: `/photos/${folder}/${f}`,
        filename: f,
        publicId: path.basename(f, path.extname(f)),
      }));

    res.json({ files });
  } catch (err) {
    console.error(err);
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