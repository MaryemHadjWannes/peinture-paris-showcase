import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import { Resend } from "resend"; // Make sure 'resend' is installed in package.json
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
// Ensure RESEND_API_KEY is set in Render secrets
const resend = new Resend(process.env.RESEND_API_KEY); 

// API routes
app.use("/api", googleReviewsApi);

app.post("/upload", upload.array("photos"), async (req, res) => {
  const recipientEmail = process.env.EMAIL_USER || "hn.renovation.fr@gmail.com";
  // Hold references to file paths for cleanup
  let filePaths: string[] = []; 

  try {
    const fields = req.body;
    const files = req.files as Express.Multer.File[] | undefined;

    // 1. Prepare attachments and capture file paths for later deletion
    const attachments = files?.map(f => {
      filePaths.push(f.path); // Add path to cleanup list
      return {
        filename: f.originalname,
        content: fs.readFileSync(f.path).toString("base64"),
        contentType: f.mimetype,
        encoding: "base64"
      };
    });

    // 2. Send Email via Resend and capture the response for tracing
    const sendResult = await resend.emails.send({
      from: `${fields.name} <${fields.email}>`,
      to: [recipientEmail], // Resend expects an array for 'to'
      subject: `Nouvelle demande de devis: ${fields.project}`,
      html: `<p><strong>Nom:</strong> ${fields.name}<br/><strong>Email:</strong> ${fields.email}<br/><strong>Téléphone:</strong> ${fields.phone}<br/><strong>Projet:</strong> ${fields.project}<br/><strong>Message:</strong> ${fields.message}</p>`,
      attachments
    });

    // *** TRACING: Log the Resend response ***
    console.log("Resend API Email Accepted. Tracing ID:", sendResult.data?.id);
    console.log("Full Resend Response:", JSON.stringify(sendResult));

    // 3. File Cleanup
    filePaths.forEach(filePath => {
        try {
            fs.unlinkSync(filePath);
            console.log(`Successfully deleted file: ${filePath}`);
        } catch (cleanupErr) {
            console.error(`Failed to delete file ${filePath}:`, cleanupErr);
        }
    });

    if (sendResult.error) {
         // Should not happen if await passes, but good for type safety/future proofing
         throw new Error(sendResult.error.message);
    }

    res.json({ message: "Formulaire envoyé avec succès !" });

  } catch (err) {
    // 4. Enhanced Error Logging for Resend Failures
    console.error("Resend API Error during sendMail:", err);
    
    // Attempt cleanup even on failure
    filePaths.forEach(filePath => {
        try {
            fs.unlinkSync(filePath);
        } catch (cleanupErr) {
            // Log cleanup failure, but don't halt the error response
            console.error(`Failed to delete file on error ${filePath}:`, cleanupErr);
        }
    });

    res.status(500).json({ error: "Erreur lors de l'envoi de l'email. Vérifiez la clé API Resend ou le domaine de l'expéditeur." });
  }
});

// Serve frontend build
const frontendPath = path.join(process.cwd(), "dist");
app.use(express.static(frontendPath));
app.get(/^(?!\/(api|upload)).*$/, (_, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));