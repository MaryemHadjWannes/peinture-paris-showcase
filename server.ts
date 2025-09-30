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

// Nodemailer setup
// *** FIX: Use explicit host/port for better reliability on cloud servers (Render) ***
// *** FIX: Remove hardcoded password for security and to ensure App Password is used ***
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Explicitly set host
  port: 465,             // Use Port 465 for SMTPS
  secure: true,          // Must be true for port 465 (SMTPS)
  auth: {
    // The fallback email address is fine, but the password MUST be loaded from env
    user: process.env.EMAIL_USER || "hn.renovation.fr@gmail.com",
    pass: process.env.EMAIL_PASS // REMOVED: || "kodfvmlgojsfkvmq" (This must be the 16-character App Password set in Render secrets)
  },
  // Adding a connection timeout to help diagnose connection issues, though Nodemailer has a default
  connectionTimeout: 30000, // 30 seconds
  socketTimeout: 30000,     // 30 seconds
});

// API routes
app.use("/api", googleReviewsApi);

app.post("/upload", upload.array("photos"), async (req, res) => {
  // Define default recipient in case EMAIL_USER is not set
  const recipientEmail = process.env.EMAIL_USER || "hn.renovation.fr@gmail.com";

  try {
    const fields = req.body;
    // Type assertion for files (good practice in TS)
    const files = req.files as Express.Multer.File[] | undefined; 

    // Check if files exist and map them for attachments
    const attachments = files?.map(f => ({ 
      filename: f.originalname, 
      path: f.path 
    }));

    const mailOptions = {
      from: `"${fields.name}" <${fields.email}>`,
      to: recipientEmail, // Use the defined recipient
      subject: `Nouvelle demande de devis: ${fields.project}`,
      text: `
        Nom: ${fields.name}
        Email: ${fields.email}
        Téléphone: ${fields.phone}
        Projet: ${fields.project}
        Message: ${fields.message}
      `,
      attachments: attachments
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Formulaire envoyé avec succès !" });
  } catch (err) {
    // Log the full error to the console (Render logs)
    console.error("Nodemailer Error during sendMail:", err); 
    
    // Provide a more informative error response
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