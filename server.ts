import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import crypto from "crypto";
import fs from "fs";
import googleReviewsApi from "./googleReviewsApi";
import { CITIES } from "./src/data/seo";
import { SERVICE_SLUGS, NOT_FOUND_META, getHeadTags, getRouteMeta, type RouteMeta } from "./src/data/routeMeta";
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

// Secrets come from the environment (hosting dashboard in production, local
// .env in development). Never commit them: see .env.example.
const required = [
  "JWT_SECRET", "ADMIN_EMAIL", "CORS_ORIGIN",
  "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_ACCOUNT_ID", "R2_BUCKET_NAME", "R2_PUBLIC_DOMAIN"
];

required.forEach(v => {
  if (!process.env[v]) {
    console.error(`Missing env var ${v}`);
    process.exit(1);
  }
});

if (!process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD_HASH) {
  console.error("Missing env var ADMIN_PASSWORD (or ADMIN_PASSWORD_HASH)");
  process.exit(1);
}

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

const getFolder = (category: unknown): string | undefined =>
  typeof category === "string" && Object.hasOwn(folderMap, category.toLowerCase())
    ? folderMap[category.toLowerCase()]
    : undefined;

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);
app.disable("x-powered-by");

const allowedOrigin = process.env.CORS_ORIGIN;
const allowedOrigins = [
  ...(allowedOrigin ? [allowedOrigin] : []),
  'https://hn-renovation.fr',
  'https://www.hn-renovation.fr',
  'http://127.0.0.1:8080',
  'http://localhost:8080',
  'http://172.23.176.77:8080',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

// Same-origin requests are always allowed: browsers send an Origin header for
// the site's own module scripts (<script type="module" crossorigin>) and POSTs,
// so the site must not depend on CORS_ORIGIN matching the domain exactly.
app.use(cors<Request>((req, callback) => {
  const origin = req.header("Origin");
  const sameOrigin = origin === `${req.protocol}://${req.get("host")}`;
  if (!origin || sameOrigin || allowedOrigins.includes(origin)) {
    callback(null, {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
  } else {
    console.error(`CORS Blocked: Origin ${origin} not in allowed list.`);
    callback(new Error('Not allowed by CORS'));
  }
}));

app.use((req, res, next) => {
  if (req.secure || req.headers["x-forwarded-proto"] === "https") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

const cspHeader = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  `img-src 'self' data: blob: https://www.google.com https://www.gstatic.com https://maps.gstatic.com ${R2_PUBLIC_DOMAIN}`,
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com https://formspree.io",
  "frame-src 'self' https://www.google.com https://www.google.com/maps",
  "upgrade-insecure-requests",
].join("; ");

app.use((req, res, next) => {
  if (req.secure || req.headers["x-forwarded-proto"] === "https") {
    res.setHeader("Content-Security-Policy", cspHeader);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === ADMIN UPLOADS ===
// Kept in memory (max 5 MB) and checked by content before being sent to R2.
const ALLOWED_IMAGE_EXT = /\.(jpe?g|png|webp)$/i;
const SAFE_FILENAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,120}\.(jpe?g|png|webp)$/i;

const adminUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_, file, cb) => {
    if (!ALLOWED_IMAGE_EXT.test(file.originalname)) {
      return cb(new Error("Only images"));
    }
    cb(null, true);
  },
});

// Real file type from the first bytes (the extension and mimetype are client-provided).
const detectImageType = (buf: Buffer): { mime: string; ext: string } | null => {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg" };
  }
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { mime: "image/png", ext: "png" };
  }
  if (buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    return { mime: "image/webp", ext: "webp" };
  }
  return null;
};

const isKeyInFolder = (key: unknown, folder: string): key is string =>
  typeof key === "string" && key.startsWith(`${folder}/`) && !key.includes("..");

// === AUTH ===
const authenticate = (req: Request, res: Response, next: express.NextFunction) => {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!, { algorithms: ["HS256"] });
    if (typeof payload !== "object" || payload.role !== "admin") throw new Error("Invalid role");
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Constant-time comparison (hashing first gives both sides the same length).
const safeEqual = (value: unknown, expected: string) => {
  if (typeof value !== "string") return false;
  const a = crypto.createHash("sha256").update(value).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
};

// ADMIN_PASSWORD_HASH (recommended) has the form "scrypt:<saltHex>:<hashHex>",
// see README. ADMIN_PASSWORD (plain text) is still accepted for compatibility.
const verifyAdminPassword = (password: unknown) => {
  if (typeof password !== "string") return false;
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (stored) {
    const [algo, saltHex, hashHex] = stored.split(":");
    if (algo !== "scrypt" || !saltHex || !hashHex) return false;
    const expected = Buffer.from(hashHex, "hex");
    const actual = crypto.scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
    return expected.length > 0 && crypto.timingSafeEqual(actual, expected);
  }
  return safeEqual(password, process.env.ADMIN_PASSWORD!);
};

// Brute-force protection: 5 failed attempts per IP per 15 minutes.
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_FAILURES = 5;
const loginFailures = new Map<string, { count: number; first: number }>();

const isLoginBlocked = (ip: string) => {
  const now = Date.now();
  for (const [key, entry] of loginFailures) {
    if (now - entry.first > LOGIN_WINDOW_MS) loginFailures.delete(key);
  }
  const entry = loginFailures.get(ip);
  return !!entry && entry.count >= LOGIN_MAX_FAILURES;
};

const recordLoginFailure = (ip: string) => {
  const entry = loginFailures.get(ip);
  if (entry) entry.count += 1;
  else loginFailures.set(ip, { count: 1, first: Date.now() });
};

// === LOGIN ===
app.post("/api/admin/login", (req: Request, res: Response) => {
  const ip = req.ip || "unknown";
  if (isLoginBlocked(ip)) {
    return res.status(429).json({ error: "Too many attempts, try again later" });
  }
  const { email, password } = req.body ?? {};
  const emailOk = safeEqual(email, process.env.ADMIN_EMAIL!);
  const passwordOk = verifyAdminPassword(password);
  if (emailOk && passwordOk) {
    loginFailures.delete(ip);
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET!, { expiresIn: "24h" });
    res.json({ token });
  } else {
    recordLoginFailure(ip);
    console.warn(`Failed admin login from ${ip}`);
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// === UPLOAD IMAGE ===
app.post("/api/admin/upload", authenticate, adminUpload.single("image"), async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No file" });

  const forcedFilename: unknown = req.body.filename;
  const targetFolder = getFolder(req.body.category);

  if (!targetFolder) {
    return res.status(400).json({ error: "Invalid category" });
  }

  const detected = detectImageType(req.file.buffer);
  if (!detected) {
    return res.status(400).json({ error: "Only images" });
  }

  if (forcedFilename !== undefined && (typeof forcedFilename !== "string" || !SAFE_FILENAME.test(forcedFilename))) {
    return res.status(400).json({ error: "Invalid filename" });
  }

  const finalFilename = forcedFilename || `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${detected.ext}`;
  const R2Key = `${targetFolder}/${finalFilename}`;

  try {
    const uploadCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: R2Key,
      Body: req.file.buffer,
      ContentType: detected.mime,
      ACL: 'public-read',
    });
    await s3Client.send(uploadCommand);

    const publicUrl = `${R2_PUBLIC_DOMAIN}/${R2Key}`;
    res.json({
      url: publicUrl,
      publicId: R2Key,
      filename: finalFilename,
    });
  } catch (err) {
    console.error("R2 Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// === RENAME IMAGE (pour CONFIRMER LA PAIRE) ===
app.post("/api/admin/rename", authenticate, async (req: Request, res: Response) => {
  const { publicId, newFilename, category } = req.body ?? {};
  const folder = getFolder(category);
  if (!folder) return res.status(400).json({ error: "Invalid category" });
  if (typeof newFilename !== "string" || !SAFE_FILENAME.test(newFilename)) {
    return res.status(400).json({ error: "Invalid filename" });
  }
  if (!isKeyInFolder(publicId, folder)) {
    return res.status(400).json({ error: "Invalid image" });
  }

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
    if (!isKeyInFolder(R2Key, BASE_PREFIX)) {
      return res.status(400).json({ error: "Invalid image" });
    }
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
    .map((item) => {
      const R2Key = item.Key as string;
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
    const folder = getFolder(req.params.category);
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
    const folder = getFolder(req.params.category);
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
// Quote requests are sent from the browser to Formspree (src/components/Contact.tsx).
// The former unused POST /upload endpoint (Resend) was removed: it accepted
// anonymous file uploads into public/ and relayed unescaped HTML emails.

// === SERVE FRONTEND ===
const frontend = path.join(process.cwd(), "dist");

// Basic allowlist for SPA routes so we can return 404 for unknown URLs (avoid soft-404)
const staticSpaRoutes = new Set([
  "/",
  "/realisations",
  "/avis",
]);

const serviceSlugs = new Set<string>(SERVICE_SLUGS);

const rootServiceRedirects = new Set<string>(SERVICE_SLUGS);

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
  if (cleanPath === "/index.html") {
    return res.redirect(301, "/");
  }
  if (cleanPath === "/index.php") {
    return res.status(410).send("Gone");
  }
  if (cleanPath === "/artisan-peintre-cambrai") {
    return res.redirect(301, "/artisan-peintre/cambrai-59400");
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

// index: false so "/" goes through the SPA handler below and gets its metadata.
app.use(express.static(frontend, { redirect: false, index: false }));

// The built index.html with the route's title/description/canonical/Open Graph
// tags injected, so they are present before JavaScript runs. The tags carry
// data-rh="true" so react-helmet-async replaces them on the client.
const indexPath = path.join(frontend, "index.html");
let indexTemplate: string | null = null;

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const renderIndex = (meta: RouteMeta): string | null => {
  if (indexTemplate === null) {
    if (!fs.existsSync(indexPath)) return null;
    indexTemplate = fs.readFileSync(indexPath, "utf8");
  }
  const tags = getHeadTags(meta)
    .map(({ tag, attrs }) => {
      const attributes = Object.entries(attrs)
        .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
        .join(" ");
      return `<${tag} ${attributes} data-rh="true">`;
    })
    .join("\n    ");
  return indexTemplate
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(meta.title)}</title>`)
    .replace("</head>", () => `    ${tags}\n  </head>`);
};

app.use((req: Request, res: Response) => {
  const found = isSpaRoute(req.path);
  const html = renderIndex((found && getRouteMeta(req.path)) || NOT_FOUND_META);
  // Unknown route → 404 status but render SPA 404 screen
  res.status(found ? 200 : 404);
  if (html === null) return res.sendFile(indexPath);
  return res.type("html").send(html);
});

// === ERRORS ===
// JSON errors without stack traces (uploads, CORS, unexpected failures).
app.use((err: Error, req: Request, res: Response, _next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.code === "LIMIT_FILE_SIZE" ? "File too large" : "Upload error" });
  }
  if (err?.message === "Only images") {
    return res.status(400).json({ error: "Only images" });
  }
  if (err?.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "Forbidden" });
  }
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Server error" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
