import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import nodemailer from "nodemailer";
import fs from "fs";
import googleReviewsApi from "./googleReviewsApi";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Use Render assigned PORT or fallback
const PORT = process.env.PORT || 5000;

// Allow CORS (optional if frontend is served by same server)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Uploads folder
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "maryem.hadjwannes@gmail.com",
    pass: process.env.EMAIL_PASS || "yqcdaakzgnrsekzi"// Store securely in Render secrets
  }
});

// API routes
app.use("/api", googleReviewsApi);

app.post("/upload", upload.array("photos"), async (req, res) => {
  try {
    const fields = req.body;
    const files = req.files as Express.Multer.File[];

    const mailOptions = {
      from: `"${fields.name}" <${fields.email}>`,
      to: process.env.EMAIL_USER || "maryem.hadjwannes@gmail.com",
      subject: `Nouvelle demande de devis: ${fields.project}`,
      text: `
        Nom: ${fields.name}
        Email: ${fields.email}
        Téléphone: ${fields.phone}
        Projet: ${fields.project}
        Message: ${fields.message}
      `,
      attachments: files?.map(f => ({ filename: f.originalname, path: f.path }))
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Formulaire envoyé avec succès !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'envoi de l'email" });
  }
});

// Serve frontend build
const frontendPath = path.join(process.cwd(), "dist");
app.use(express.static(frontendPath));
app.get(/^(?!\/(api|upload)).*$/, (_, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
