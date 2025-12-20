import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import { Resend } from "resend";
import fs from "fs";
import googleReviewsApi from "./googleReviewsApi";
import { CITIES } from "./src/data/seo";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

const required = [
  "JWT_SECRET", "ADMIN_EMAIL", "ADMIN_PASSWORD", "CORS_ORIGIN",
  "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_ACCOUNT_ID", "R2_BUCKET_NAME", "R2_PUBLIC_DOMAIN"
];

required.forEach(v => {
  if (!process.env[v]) {
    console.error(`Missing env var ${v}`);
    process.exit(1);
  }
});

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN!;
const BASE_PREFIX = "PEINTURE INTERIEUR/photos";

const folderMap: Record<string, string> = {
  enduit: `${BASE_PREFIX}/ENDUIT`,
  "peinture-interieure": `${BASE_PREFIX}/PEINTURE INTERIEUR`,
  "escalier-details": `${BASE_PREFIX}/ESCALIER`,
  "avant-apres": `${BASE_PREFIX}/AVANT-APRES`,
};

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigin = process.env.CORS_ORIGIN;
const allowedOrigins = [
  ...(allowedOrigin ? [allowedOrigin] : []),
  'http://127.0.0.1:8080',
];

app.use(cors({
  origin: (origin, callback) => {
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
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === TEMP UPLOADS ===
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

// === CONTACT UPLOADS ===
const contactUploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(contactUploadDir)) fs.mkdirSync(contactUploadDir, { recursive: true });

const contactStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, contactUploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const contactUpload = multer({ storage: contactStorage, limits: { fileSize: 5 * 1024 * 1024 } });

// === AUTH ===
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

// === LOGIN ===
app.post("/api/admin/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET!, { expiresIn: "24h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// === UPLOAD IMAGE ===
app.post("/api/admin/upload", authenticate, adminUpload.single("image"), async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No file" });

  const catId = (req.body.category as string).toLowerCase();
  const forcedFilename = req.body.filename as string | undefined;
  const targetFolder = folderMap[catId];
  const tempFilePath = req.file.path;

  if (!targetFolder) {
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    return res.status(400).json({ error: "Invalid category" });
  }

  const finalFilename = forcedFilename || req.file.filename;
  const R2Key = `${targetFolder}/${finalFilename}`;
  const fileBody = fs.readFileSync(tempFilePath);

  try {
    const uploadCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: R2Key,
      Body: fileBody,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
    });
    await s3Client.send(uploadCommand);

    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

    const publicUrl = `${R2_PUBLIC_DOMAIN}/${R2Key}`;
    res.json({
      url: publicUrl,
      publicId: R2Key,
      filename: finalFilename,
    });
  } catch (err) {
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    console.error("R2 Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// === RENAME IMAGE (pour CONFIRMER LA PAIRE) ===
app.post("/api/admin/rename", authenticate, async (req: Request, res: Response) => {
  const { publicId, newFilename, category } = req.body;
  const folder = folderMap[category];
  if (!folder) return res.status(400).json({ error: "Invalid category" });

  const newKey = `${folder}/${newFilename}`;

  try {
    // 1. Copier avec nouveau nom
    await s3Client.send(new CopyObjectCommand({
      Bucket: R2_BUCKET_NAME,
      CopySource: `${R2_BUCKET_NAME}/${publicId}`,
      Key: newKey,
      ACL: 'public-read',
    }));

    // 2. Supprimer l'ancien
    await s3Client.send(new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: publicId,
    }));

    const publicUrl = `${R2_PUBLIC_DOMAIN}/${newKey}`;
    res.json({
      url: publicUrl,
      publicId: newKey,
      filename: newFilename,
    });
  } catch (err) {
    console.error("Rename failed:", err);
    res.status(500).json({ error: "Rename failed" });
  }
});

// === DELETE IMAGE ===
app.delete("/api/admin/delete/:publicId", authenticate, async (req: Request, res: Response) => {
  try {
    const R2Key = decodeURIComponent(req.params.publicId);
    const deleteCommand = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: R2Key,
    });
    await s3Client.send(deleteCommand);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("R2 Delete failed:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// === LIST IMAGES ===
const listR2Images = async (folder: string) => {
  const R2Prefix = `${folder}/`;
  const listCommand = new ListObjectsV2Command({
    Bucket: R2_BUCKET_NAME,
    Prefix: R2Prefix,
    MaxKeys: 500,
  });
  const result = await s3Client.send(listCommand);
  return (result.Contents || [])
    .filter(item => item.Key && !item.Key.endsWith('/'))
    .map((item: any) => {
      const R2Key = item.Key;
      const publicUrl = `${R2_PUBLIC_DOMAIN}/${R2Key}`;
      return {
        url: publicUrl,
        publicId: R2Key,
        filename: path.basename(R2Key),
      };
    });
};

app.get("/api/public/images/:category", async (req: Request, res: Response) => {
  try {
    const cat = req.params.category.toLowerCase();
    const folder = folderMap[cat];
    if (!folder) return res.status(400).json({ error: "Invalid category" });
    const files = await listR2Images(folder);
    res.json({ files });
  } catch (err) {
    console.error("R2 Public List failed:", err);
    res.status(500).json({ error: "List failed" });
  }
});

app.get("/api/admin/images/:category", authenticate, async (req: Request, res: Response) => {
  try {
    const cat = req.params.category.toLowerCase();
    const folder = folderMap[cat];
    if (!folder) return res.status(400).json({ error: "Invalid category" });
    const files = await listR2Images(folder);
    res.json({ files });
  } catch (err) {
    console.error("R2 Admin List failed:", err);
    res.status(500).json({ error: "List failed" });
  }
});

// === GOOGLE REVIEWS ===
app.use("/api", googleReviewsApi);

// === CONTACT FORM ===
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

// === SERVE FRONTEND ===
const frontend = path.join(process.cwd(), "dist");
app.use(express.static(frontend));

// Basic allowlist for SPA routes so we can return 404 for unknown URLs (avoid soft-404)
const staticSpaRoutes = new Set([
  "/",
  "/realisations",
]);

const serviceSlugs = new Set([
  "enduit",
  "peinture-interieure",
  "peinture-exterieure",
  "platrerie",
  "artisan-peintre",
]);

const rootServiceRedirects = new Set([
  "enduit",
  "peinture-interieure",
  "peinture-exterieure",
  "platrerie",
  "artisan-peintre",
]);

const defaultCitySlug = "cambrai-59400";
const citySlugs = new Set(CITIES.map((city) => city.slug));

const isSpaRoute = (pathname: string) => {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  if (staticSpaRoutes.has(cleanPath)) return true;
  if (cleanPath.startsWith("/admin")) return true;
  // /:serviceSlug/:citySlug
  const parts = cleanPath.split("/").filter(Boolean);
  if (parts.length === 2 && serviceSlugs.has(parts[0]) && citySlugs.has(parts[1])) return true;
  // /:citySlug
  if (parts.length === 1 && citySlugs.has(parts[0])) return true;
  return false;
};

// Legacy URL redirect: /ville/:citySlug/:serviceSlug -> /:serviceSlug/:citySlug
app.use((req: Request, res: Response, next: express.NextFunction) => {
  const cleanPath = req.path.replace(/\/+$/, "");
  if (cleanPath === "/artisan-peintre-cambrai") {
    return res.redirect(301, "/artisan-peintre/cambrai-59400");
  }
  const match = cleanPath.match(/^\/ville\/([^/]+)\/([^/]+)$/i);
  if (match) {
    const citySlug = match[1];
    const legacyService = match[2];
    if (serviceSlugs.has(legacyService)) {
      return res.redirect(301, `/${legacyService}/${citySlug}`);
    }
  }
  const cityMatch = cleanPath.match(/^\/ville\/([^/]+)$/i);
  if (cityMatch) {
    const citySlug = cityMatch[1];
    if (citySlugs.has(citySlug)) {
      return res.redirect(301, `/${citySlug}`);
    }
  }
  const rootMatch = cleanPath.match(/^\/([^/]+)$/);
  if (rootMatch) {
    const legacyService = rootMatch[1];
    if (rootServiceRedirects.has(legacyService)) {
      return res.redirect(301, `/${legacyService}/${defaultCitySlug}`);
    }
  }
  return next();
});

app.use((req: Request, res: Response) => {
  const indexPath = path.join(frontend, "index.html");
  if (isSpaRoute(req.path)) {
    return res.sendFile(indexPath);
  }
  // Unknown route → 404 status but render SPA 404 screen
  return res.status(404).sendFile(indexPath);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
