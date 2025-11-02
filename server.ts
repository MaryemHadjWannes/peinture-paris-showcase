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
// FIXED: Import all as 'cloudinary' to resolve the 'Property v2 does not exist' error
import * as cloudinary from 'cloudinary'; 

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
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];
required.forEach(v => {
  if (!process.env[v]) {
    console.error(`Missing env var ${v}`);
    process.exit(1);
  }
});

// Configure Cloudinary (Now correctly using cloudinary.v2)
cloudinary.v2.config({
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
// IMPORTANT: Ensure these names EXACTLY match the folder names on Cloudinary
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

/* ---------- UPLOAD IMAGE (Cloudinary) ---------- */
app.post("/api/admin/upload", authenticate, adminUpload.single("image"), async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No file" });

  const catId = (req.body.category as string).toLowerCase();
  const targetFolder = folderMap[catId];
  const tempFilePath = req.file.path;
  
  if (!targetFolder) {
    fs.unlinkSync(tempFilePath); 
    return res.status(400).json({ error: "Invalid category" });
  }

  try {
    // 1. UPLOAD TO CLOUDINARY (Using cloudinary.v2)
    const uploadResult = await cloudinary.v2.uploader.upload(tempFilePath, {
      // Full folder path (e.g., peinture-paris-showcase/ENDUIT)
      folder: `peinture-paris-showcase/${targetFolder}`, 
      use_filename: true, 
      unique_filename: false,
      overwrite: false,
    });
    
    // 2. DELETE TEMPORARY LOCAL FILE
    fs.unlinkSync(tempFilePath); 

    // 3. RETURN CLOUDINARY DATA
    res.json({ 
      url: uploadResult.secure_url, 
      publicId: uploadResult.public_id,
      filename: req.file.filename,
    });

  } catch (err) {
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath); 
    console.error("Cloudinary Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* ---------- DELETE IMAGE (Cloudinary) ---------- */
/* ---------- DELETE IMAGE (Cloudinary) - FIXED ---------- */
app.delete("/api/admin/delete/:publicId", authenticate, async (req: Request, res: Response) => {
  try {
    // 1. DECODE THE URL-ENCODED publicId
    const publicId = decodeURIComponent(req.params.publicId); 

    // 2. DELETE FROM CLOUDINARY (Using cloudinary.v2)
    const deleteResult = await cloudinary.v2.uploader.destroy(publicId);
    
    if (deleteResult.result === 'not found') {
      return res.status(404).json({ error: "File not found on Cloudinary" });
    }

    // 3. SUCCESS
    res.json({ message: "Deleted", result: deleteResult });

  } catch (err) {
    console.error("Cloudinary Delete failed:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

/* ----------------------------------------------------------------- */
/* NEW: PUBLIC LIST IMAGES (NO AUTHENTICATION)                       */
/* ----------------------------------------------------------------- */
// This is called by Portfolio.tsx directly on page load
app.get("/api/public/images/:category", async (req: Request, res: Response) => {
  try {
    const cat = req.params.category.toLowerCase();
    const folder = folderMap[cat];
    if (!folder) return res.status(400).json({ error: "Invalid category" });

    // 1. CONSTRUCT THE FULL CLOUDINARY FOLDER PATH
    const cloudinaryFolder = `peinture-paris-showcase/${folder}`;

    // 2. FETCH RESOURCES (IMAGES) FROM CLOUDINARY
    const result = await cloudinary.v2.search
      .expression(`folder:${cloudinaryFolder}/*`) 
      .sort_by('public_id', 'asc')
      .max_results(500)
      .execute();

    // 3. MAP THE RESULTS 
    const files = result.resources
      .map((resource: any) => ({
        url: resource.secure_url, 
        publicId: resource.public_id, 
        filename: path.basename(resource.public_id), 
      }));

    // If the Admin page has stored an order, we will use it
    // NOTE: For a true fix, order should be stored in a DB, but for now, we use the server's list.
    // If you need reordering on the public site, you MUST use a database.

    res.json({ files });
} catch (err) {
    console.error("Cloudinary Public List failed:", err);
    
    // Gracefully handle rate limit (which is now reset, but good practice)
    const cloudinaryError = err as any; 
    if (cloudinaryError.http_code === 404 || cloudinaryError.http_code === 420) {
      return res.json({ files: [] }); 
    }
    
    res.status(500).json({ error: "List failed", details: (err as Error).message });
  }
});

/* ---------- LIST IMAGES (FIXED FOR CLOUDINARY SEARCH API) ---------- */
app.get("/api/admin/images/:category", authenticate, async (req: Request, res: Response) => {
  try {
    const cat = req.params.category.toLowerCase();
    const folder = folderMap[cat];
    if (!folder) return res.status(400).json({ error: "Invalid category" });

    // 1. CONSTRUCT THE FULL CLOUDINARY FOLDER PATH (peinture-paris-showcase/CATEGORY)
    const cloudinaryFolder = `peinture-paris-showcase/${folder}`;

    // 2. FETCH RESOURCES (IMAGES) FROM CLOUDINARY USING THE ROBUST SEARCH API (Using cloudinary.v2)
    const result = await cloudinary.v2.search
      // Filter by the exact folder path, using '/*' to include all images in that folder
      .expression(`folder:${cloudinaryFolder}/*`) 
      .sort_by('public_id', 'asc') // Sort the results
      .max_results(500) // Max images to retrieve
      .execute(); // Execute the search query

    // 3. MAP THE RESULTS TO THE EXPECTED FRONTEND FORMAT
    const files = result.resources
      .map((resource: any) => ({
        url: resource.secure_url, 
        publicId: resource.public_id, 
        filename: path.basename(resource.public_id), 
      }));

    res.json({ files });
} catch (err) {
    console.error("Cloudinary List failed:", err);

    const cloudinaryError = err as any; 
    
    // Check for Rate Limit (HTTP 420) or Not Found (HTTP 404) directly on the http_code,
    // which is the safest way to handle this specific error structure.
    if (
        cloudinaryError.http_code === 404 || 
        cloudinaryError.http_code === 420
    ) {
      // Return an empty array. This stops the server from crashing.
      return res.json({ files: [] }); 
    }
    
    // For all other errors, send a 500
    res.status(500).json({ error: "List failed", details: (err as Error).message });
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