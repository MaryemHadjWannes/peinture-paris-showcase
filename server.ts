import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import { Resend } from "resend";
import fs from "fs";
import googleReviewsApi from "./googleReviewsApi";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Use Render assigned PORT or fallback
const PORT = process.env.PORT || 5000 ;

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

// Resend setup
const resend = new Resend(process.env.RESEND_API_KEY);

// API routes
app.use("/api", googleReviewsApi);

app.post("/upload", upload.array("photos"), async (req, res) => {
  const recipientEmail = process.env.EMAIL_USER || "hn.renovation.fr@gmail.com";
  try {
    const fields = req.body;
    const files = req.files as Express.Multer.File[] | undefined;

    // Prepare attachments for Resend (if any)
    const attachments = files?.map(f => ({
      filename: f.originalname,
      content: fs.readFileSync(f.path).toString("base64"),
      contentType: f.mimetype,
      encoding: "base64"
    }));

    await resend.emails.send({
      from: `${fields.name} <${fields.email}>`,
      to: [recipientEmail],
      subject: `Nouvelle demande de devis: ${fields.project}`,
      html: `<p><strong>Nom:</strong> ${fields.name}<br/><strong>Email:</strong> ${fields.email}<br/><strong>Téléphone:</strong> ${fields.phone}<br/><strong>Projet:</strong> ${fields.project}<br/><strong>Message:</strong> ${fields.message}</p>`,
      attachments
    });
    res.json({ message: "Formulaire envoyé avec succès !" });
  } catch (err) {
    console.error("Resend Error during sendMail:", err);
    res.status(500).json({ error: "Erreur lors de l'envoi de l'email. Veuillez vérifier les logs du serveur (Render) pour plus de détails." });
  }
});

// Serve frontend build
const frontendPath = path.join(process.cwd(), "dist");
app.use(express.static(frontendPath));
app.get(/^(?!\/(api|upload)).*$/, (_, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));