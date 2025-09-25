import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import nodemailer from "nodemailer";
import fs from "fs";

const app = express();
const PORT = 5000;

// Allow requests from Vite frontend (localhost:8080)
app.use(cors({
  origin: ["http://localhost:8080", "http://localhost:5173"], // Support both dev ports
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// Parse URL-encoded and JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set upload folder
const uploadDir = path.join(process.cwd(), "public/uploads");

// Ensure the uploads folder exists
if (!fs.existsSync(uploadDir)) {
  console.log("Uploads folder not found, creating:", uploadDir);
  fs.mkdirSync(uploadDir, { recursive: true });
} else {
  console.log("Uploads folder exists:", uploadDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Saving file to:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    console.log("Generating filename:", uniqueSuffix + "-" + file.originalname);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // max 5MB per file
});

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "maryem.hadjwannes@gmail.com",
    pass: "yqcdaakzgnrsekzi" // Gmail App Password
  }
});

// Endpoint for form submission with multiple photos
app.post("/upload", upload.array("photos"), async (req, res) => {
  console.log("=== /upload endpoint hit ===");
  try {
    const fields = req.body;
    const files = req.files as Express.Multer.File[];
    console.log("Received form fields:", fields);
    console.log("Number of files uploaded:", files?.length || 0);

    // Debug file details
    if (files?.length) {
      files.forEach((file, idx) => {
        console.log(`File[${idx}] ->`, {
          originalname: file.originalname,
          path: file.path,
          size: file.size
        });
      });
    }

    // Prepare email options
    const mailOptions = {
      from: `"${fields.name}" <${fields.email}>`,
      to: "maryem.hadjwannes@gmail.com",
      subject: `Nouvelle demande de devis: ${fields.project}`,
      text: `
        Nom: ${fields.name}
        Email: ${fields.email}
        Téléphone: ${fields.phone}
        Projet: ${fields.project}
        Message: ${fields.message}
      `,
      attachments: files?.map(file => ({
        filename: file.originalname,
        path: file.path
      }))
    };

    console.log("Prepared mailOptions:", mailOptions);

    // Send email
    console.log("Attempting to send email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    res.json({ message: "Formulaire envoyé avec succès !" });
  } catch (err) {
    console.error("Error in /upload:", err);
    res.status(500).json({ error: "Erreur lors de l'envoi de l'email" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});