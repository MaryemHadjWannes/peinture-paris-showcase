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
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://localhost:8080',
];

app.use("/api", cors({
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

// Basic allowlist for SPA routes so we can return 404 for unknown URLs (avoid soft-404)
const staticSpaRoutes = new Set([
  "/",
  "/realisations",
  "/avis",
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

type SeoPayload = {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  robots?: string;
  bodyHtml: string;
};

const SEO_BASE_URL = "https://hn-renovation.fr";
const SEO_OG_IMAGE = "https://hn-renovation.fr/uploads/1759262842539-hero-painting.jpg";
let seoTemplateCache: string | null = null;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const stripSeoTags = (html: string) =>
  html
    .replace(/<meta\s+name=["']description["'][^>]*>\s*/i, "")
    .replace(/<meta\s+name=["']robots["'][^>]*>\s*/i, "")
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/i, "")
    .replace(/<meta\s+property=["']og:title["'][^>]*>\s*/i, "")
    .replace(/<meta\s+property=["']og:description["'][^>]*>\s*/i, "")
    .replace(/<meta\s+property=["']og:url["'][^>]*>\s*/i, "")
    .replace(/<meta\s+property=["']og:type["'][^>]*>\s*/i, "")
    .replace(/<meta\s+property=["']og:image["'][^>]*>\s*/i, "")
    .replace(/<meta\s+name=["']twitter:card["'][^>]*>\s*/i, "")
    .replace(/<meta\s+name=["']twitter:title["'][^>]*>\s*/i, "")
    .replace(/<meta\s+name=["']twitter:description["'][^>]*>\s*/i, "")
    .replace(/<meta\s+name=["']twitter:image["'][^>]*>\s*/i, "");

const buildSeoBody = (heading: string, paragraphs: string[], listTitle: string, listItems: string[], ctaHtml: string) => {
  const paragraphHtml = paragraphs.map((text) => `<p>${text}</p>`).join("");
  const listHtml = listItems.length
    ? `<h2>${listTitle}</h2><ul>${listItems.map((item) => `<li>${item}</li>`).join("")}</ul>`
    : "";
  const cta = ctaHtml ? `<p>${ctaHtml}</p>` : "";
  return `<main class="seo-fallback"><h1>${heading}</h1>${paragraphHtml}${listHtml}${cta}</main>`;
};

const getSeoTemplate = () => {
  if (seoTemplateCache) return seoTemplateCache;
  try {
    const indexPath = path.join(frontend, "index.html");
    seoTemplateCache = fs.readFileSync(indexPath, "utf-8");
    return seoTemplateCache;
  } catch {
    return null;
  }
};

const renderSeoHtml = (template: string, payload: SeoPayload) => {
  const title = escapeHtml(payload.title);
  const description = escapeHtml(payload.description);
  const canonical = escapeHtml(payload.canonical);
  const ogImage = escapeHtml(payload.ogImage || SEO_OG_IMAGE);
  const robots = escapeHtml(payload.robots || "index, follow");

  const metaBlock = [
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
  ].join("\n    ");

  const cleaned = stripSeoTags(template);
  const withTitle = cleaned.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
  const withMeta = withTitle.replace("</head>", `    ${metaBlock}\n  </head>`);
  const withRoot = withMeta.replace('<div id="root">', `<div id="root">${payload.bodyHtml}`);
  const rootIndex = withRoot.indexOf('<div id="root">');
  if (rootIndex === -1) return withRoot;
  const beforeRoot = withRoot.slice(0, rootIndex);
  const afterRoot = withRoot.slice(rootIndex);
  const withoutNoscript = afterRoot.replace(/<noscript>[\s\S]*?<\/noscript>/i, "");
  return beforeRoot + withoutNoscript;
};

const nearbySentence = (city: { nearby?: string[] }) =>
  city.nearby && city.nearby.length ? ` Nous intervenons aussi à ${city.nearby.join(", ")}.` : "";

const getServiceTemplate = (serviceSlug: string, city: { name: string; postalCode: string; department: string; slug: string; nearby?: string[] }) => {
  const canonical = `${SEO_BASE_URL}/${serviceSlug}/${city.slug}`;
  const cityLabel = `${city.name} (${city.postalCode})`;

  switch (serviceSlug) {
    case "peinture-interieure": {
      const heading = `Peinture intérieure à ${cityLabel}`;
      const paragraphs = [
        `Vous recherchez une peinture intérieure à ${city.name} ? HN Rénovation intervient sur murs, plafonds, boiseries et escaliers, avec des finitions adaptées à chaque pièce (mat, velours ou satin).`,
        "Notre méthode inclut la protection des sols et du mobilier, la préparation des supports (rebouchage, ponçage, enduit) et l'application de sous-couches pour un rendu uniforme et durable.",
        `Basés près de ${city.name}, nous intervenons rapidement dans le ${city.department}.${nearbySentence(city)} Devis gratuit et délais annoncés.`,
      ];
      const listItems = [
        "Protection et masquage avant travaux.",
        "Préparation des supports et correction des défauts.",
        "Sous-couche adaptée selon le support.",
        "Deux couches de finition pour un rendu homogène.",
        "Nettoyage complet en fin de chantier.",
      ];
      return {
        title: `Peinture intérieure à ${cityLabel} | HN Rénovation`,
        description: `Peinture intérieure à ${city.name} : murs, plafonds, préparation, finitions. Devis gratuit.`,
        canonical,
        bodyHtml: buildSeoBody(
          heading,
          paragraphs,
          "Ce que comprend la prestation",
          listItems,
          `Voir nos <a href="/realisations">réalisations</a> et les <a href="/avis">avis clients</a> avant de demander votre devis.`
        ),
      };
    }
    case "peinture-exterieure": {
      const heading = `Peinture extérieure à ${cityLabel}`;
      const paragraphs = [
        `Pour la peinture extérieure à ${city.name}, nous rénovons façades, pignons et boiseries avec des produits résistants aux intempéries et aux UV.`,
        "Le chantier débute par un nettoyage et un traitement si nécessaire, puis la réparation des fissures et l'application d'une sous-couche adaptée avant la mise en peinture.",
        `Nous assurons un rendu durable et une protection efficace de votre façade.${nearbySentence(city)} Devis gratuit et conseils d'entretien.`,
      ];
      const listItems = [
        "Nettoyage et préparation des supports.",
        "Réparation des fissures et reprises.",
        "Sous-couche adaptée aux matériaux.",
        "Peinture façade et protections durables.",
        "Conseils pour l'entretien et la tenue des teintes.",
      ];
      return {
        title: `Peinture extérieure à ${cityLabel} | HN Rénovation`,
        description: `Peinture extérieure à ${city.name} : façades, murs extérieurs, peintures résistantes aux intempéries. Devis gratuit.`,
        canonical,
        bodyHtml: buildSeoBody(
          heading,
          paragraphs,
          "Notre intervention extérieure",
          listItems,
          `Parcourez nos <a href="/realisations">réalisations</a> ou contactez-nous via <a href="/#contact">la page contact</a>.`
        ),
      };
    }
    case "enduit": {
      const heading = `Enduit professionnel à ${cityLabel}`;
      const paragraphs = [
        `L'enduit est la base d'une finition parfaite. À ${city.name}, nous réalisons ratissage, rebouchage et lissage pour obtenir des murs prêts à peindre.`,
        "Nous évaluons l'état des supports, corrigeons les fissures et appliquons des enduits adaptés (rebouchage, lissage, finition), suivis d'un ponçage soigné.",
        `Ces étapes améliorent la tenue de la peinture et évitent les défauts visibles.${nearbySentence(city)} Devis gratuit.`,
      ];
      const listItems = [
        "Diagnostic des supports et préparation.",
        "Rebouchage des trous et fissures.",
        "Bandes et reprises si besoin.",
        "Ratissage complet et lissage fin.",
        "Ponçage et dépoussiérage.",
      ];
      return {
        title: `Enduit professionnel à ${cityLabel} | HN Rénovation`,
        description: `Enduit professionnel à ${city.name} : ratissage, bandes, préparation des supports avant peinture et finitions lisses. Devis gratuit.`,
        canonical,
        bodyHtml: buildSeoBody(
          heading,
          paragraphs,
          "Ce que comprend l'enduit",
          listItems,
          `Besoin d'un support parfait ? Découvrez nos <a href="/realisations">chantiers</a> ou demandez un devis.`
        ),
      };
    }
    case "platrerie": {
      const heading = `Plâtrerie et finitions à ${cityLabel}`;
      const paragraphs = [
        `Nous réalisons vos travaux de plâtrerie à ${city.name} : joints, bandes, reprises et finitions pour des surfaces prêtes à peindre.`,
        "Qu'il s'agisse de cloisons, plafonds ou rénovations, nous assurons des angles nets, des raccords invisibles et un rendu lisse.",
        `Nos finitions facilitent ensuite la mise en peinture et garantissent un aspect uniforme.${nearbySentence(city)} Devis gratuit.`,
      ];
      const listItems = [
        "Pose de bandes et joints placo.",
        "Reprises et corrections des surfaces.",
        "Angles et cornières soignés.",
        "Enduit de finition prêt à peindre.",
        "Ponçage et contrôle final.",
      ];
      return {
        title: `Plâtrerie et finitions à ${cityLabel} | HN Rénovation`,
        description: `Plâtrerie et finitions à ${city.name} : cloisons, plafonds, enduits et préparation avant peinture. Devis gratuit.`,
        canonical,
        bodyHtml: buildSeoBody(
          heading,
          paragraphs,
          "Nos prestations de plâtrerie",
          listItems,
          `Voir nos <a href="/realisations">réalisations</a> ou contacter l'équipe pour un devis.`
        ),
      };
    }
    case "artisan-peintre": {
      const heading = `Artisan peintre à ${cityLabel}`;
      const paragraphs = [
        `Artisan peintre à ${city.name}, HN Rénovation accompagne vos projets de rénovation avec un travail propre, des finitions soignées et des conseils adaptés.`,
        "Nous intervenons en peinture intérieure et extérieure, enduits, plâtrerie et finitions décoratives, avec une préparation rigoureuse des supports.",
        `Vous bénéficiez d'un devis clair, d'un planning annoncé et d'une assurance décennale.${nearbySentence(city)}`
      ];
      const listItems = [
        "Peinture intérieure et finitions.",
        "Peinture extérieure et façades.",
        "Enduits et ratissage.",
        "Plâtrerie et reprises.",
        "Conseils couleurs et matériaux.",
      ];
      return {
        title: `Artisan peintre à ${cityLabel} | HN Rénovation`,
        description: `Artisan peintre à ${city.name} : peinture intérieure et extérieure, enduits, plâtrerie et finitions. Devis gratuit.`,
        canonical,
        bodyHtml: buildSeoBody(
          heading,
          paragraphs,
          "Nos domaines d'intervention",
          listItems,
          `Découvrez nos <a href="/realisations">réalisations</a> ou lisez les <a href="/avis">avis clients</a>.`
        ),
      };
    }
    default:
      return null;
  }
};

const getSeoPayload = (pathname: string): SeoPayload | null => {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  if (cleanPath === "/") {
    return {
      title: "HN Rénovation | Peintre à Cambrai (59) - Peinture intérieure",
      description:
        "HN Rénovation, artisan peintre à Cambrai (59) dans le Nord : peinture intérieure et extérieure, enduits, plâtrerie, façades. Devis gratuit.",
      canonical: `${SEO_BASE_URL}/`,
      bodyHtml: buildSeoBody(
        "HN Rénovation, artisan peintre à Cambrai (59)",
        [
          "HN Rénovation est une entreprise de peinture basée à Cambrai (59), spécialisée dans la peinture intérieure et extérieure pour maisons, appartements et locaux professionnels. Nous privilégions une préparation soignée des supports, des finitions propres et un chantier respecté du début à la fin.",
          "Chaque projet débute par une visite et un devis gratuit. Nous vous aidons à choisir les couleurs, les finitions (mat, velours, satin) et les produits les plus adaptés pour un rendu durable et facile d'entretien.",
          "Nous intervenons à Cambrai et dans le Nord, notamment autour de Douai, Valenciennes, Arras et Caudry, avec des délais annoncés et une assurance décennale.",
        ],
        "Nos services de peinture",
        [
          "Peinture intérieure : murs, plafonds, boiseries, escaliers.",
          "Peinture extérieure : façades, pignons, protections durables.",
          "Enduit et ratissage : supports lisses et prêts à peindre.",
          "Plâtrerie et finitions : joints, bandes, reprises.",
          "Conseils déco et harmonisation des couleurs.",
        ],
        'Parcourez nos <a href="/realisations">réalisations</a>, lisez les <a href="/avis">avis clients</a> ou demandez un devis via la page <a href="/#contact">contact</a>.'
      ),
    };
  }

  if (cleanPath === "/realisations") {
    return {
      title: "Réalisations peinture à Cambrai (59) | HN Rénovation",
      description:
        "Découvrez les réalisations HN Rénovation : peinture intérieure et extérieure, enduits et ravalement de façade à Cambrai (59) et dans le Nord.",
      canonical: `${SEO_BASE_URL}/realisations`,
      bodyHtml: buildSeoBody(
        "Réalisations peinture à Cambrai (59)",
        [
          "Cette page présente une sélection de chantiers réalisés par HN Rénovation à Cambrai et dans le Nord. Vous y trouverez des exemples de peintures intérieures, de façades et d'enduits avec des finitions soignées.",
          "Chaque réalisation illustre notre méthode : préparation des supports, protection des zones, application en plusieurs couches et contrôle final des détails.",
          "Les photos mettent en avant des avant/après et des détails de finitions pour vous aider à vous projeter.",
        ],
        "Exemples de projets visibles",
        [
          "Rénovation de murs et plafonds.",
          "Peinture extérieure de façades.",
          "Enduits de lissage et reprises.",
          "Mise en peinture de boiseries et escaliers.",
          "Chantiers complets avec finitions durables.",
        ],
        'Besoin d’un devis ? Consultez aussi nos <a href="/avis">avis clients</a> ou contactez-nous via <a href="/#contact">le formulaire</a>.'
      ),
    };
  }

  if (cleanPath === "/avis") {
    return {
      title: "Avis clients peintre à Cambrai (59) | HN Rénovation",
      description:
        "Avis clients HN Rénovation à Cambrai (59) : retours sur la qualité des travaux de peinture intérieure et extérieure, la propreté du chantier et le sérieux de l’équipe.",
      canonical: `${SEO_BASE_URL}/avis`,
      bodyHtml: buildSeoBody(
        "Avis clients HN Rénovation à Cambrai (59)",
        [
          "Les avis clients reflètent la qualité de nos interventions : ponctualité, propreté du chantier, finitions et conseils. Nous intervenons à Cambrai et dans les villes voisines pour des projets de peinture intérieure et extérieure.",
          "Nous privilégions une communication claire : devis détaillé, planning annoncé et suivi du chantier. Les retours mettent souvent en avant notre sérieux et notre capacité à respecter les délais.",
          "Si vous avez déjà travaillé avec nous, votre avis aide d'autres clients à faire leur choix.",
        ],
        "Ce qui revient le plus dans les avis",
        [
          "Préparation minutieuse des supports.",
          "Chantier propre et protégé.",
          "Finitions régulières et durables.",
          "Conseils couleurs adaptés à chaque pièce.",
          "Devis clair et respect du budget.",
        ],
        'Découvrez nos <a href="/realisations">réalisations</a> ou demandez un devis via <a href="/#contact">la page contact</a>.'
      ),
    };
  }

  const parts = cleanPath.split("/").filter(Boolean);
  if (parts.length === 2 && serviceSlugs.has(parts[0]) && citySlugs.has(parts[1])) {
    const city = CITIES.find((item) => item.slug === parts[1]);
    if (city) {
      const servicePayload = getServiceTemplate(parts[0], city);
      if (servicePayload) return servicePayload;
    }
  }

  if (parts.length === 1 && citySlugs.has(parts[0])) {
    const city = CITIES.find((item) => item.slug === parts[0]);
    if (city) {
      const canonical = `${SEO_BASE_URL}/${city.slug}`;
      return {
        title: `Peintre à ${city.name} (${city.postalCode}) | HN Rénovation - peinture`,
        description: `HN Rénovation, artisan peintre à ${city.name} (${city.postalCode}) dans le ${city.department} : peinture intérieure et extérieure, enduits, plâtrerie. Devis gratuit.`,
        canonical,
        bodyHtml: buildSeoBody(
          `Peintre à ${city.name} (${city.postalCode})`,
          [
            `HN Rénovation intervient à ${city.name} pour vos travaux de peinture intérieure et extérieure, enduits et plâtrerie. Nous assurons une préparation soignée des supports et des finitions durables.`,
            `Nos interventions couvrent maisons, appartements et locaux professionnels dans le ${city.department}, avec un devis gratuit et un planning clair.${nearbySentence(city)}`,
            "Nous vous conseillons sur les couleurs, les finitions et les matériaux adaptés à chaque pièce.",
          ],
          "Prestations proposées",
          [
            "Peinture intérieure et finitions.",
            "Peinture extérieure et façades.",
            "Enduits et ratissage.",
            "Plâtrerie, joints et reprises.",
            "Conseils déco et protection des supports.",
          ],
          'Voir nos <a href="/realisations">réalisations</a> et les <a href="/avis">avis clients</a>.'
        ),
      };
    }
  }

  return null;
};

const isAssetRequest = (pathname: string) => {
  if (pathname.startsWith("/assets/")) return true;
  if (pathname.startsWith("/uploads/")) return true;
  const ext = path.extname(pathname);
  return Boolean(ext);
};

const botUserAgents = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /slurp/i,
  /bingpreview/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /lighthouse/i,
];

const isLikelyBot = (userAgent: string) => botUserAgents.some((re) => re.test(userAgent));

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

app.use((req: Request, res: Response, next: express.NextFunction) => {
  if (isAssetRequest(req.path)) return next();
  const userAgent = req.headers["user-agent"] ?? "";
  const seoQuery = req.query?.seo;
  const seoParam = Array.isArray(seoQuery) ? seoQuery[0] : seoQuery;
  const isSeoPreview = seoParam === "1";
  if (!isSeoPreview && !isLikelyBot(userAgent)) return next();
  const payload = getSeoPayload(req.path);
  if (!payload) return next();
  const template = getSeoTemplate();
  if (!template) return next();
  const html = renderSeoHtml(template, payload);
  return res.status(200).send(html);
});

app.use(express.static(frontend, { redirect: false }));

app.use((req: Request, res: Response) => {
  const indexPath = path.join(frontend, "index.html");
  if (isSpaRoute(req.path)) {
    return res.sendFile(indexPath);
  }
  // Unknown route → 404 status but render SPA 404 screen
  return res.status(404).sendFile(indexPath);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
