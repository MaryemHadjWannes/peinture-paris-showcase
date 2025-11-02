// migrate.ts

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Load .env file from the project root
dotenv.config();

// --- Configuration from server.ts ---
// Root directory of your local images
const LOCAL_BASE_DIR = path.join(process.cwd(), "public", "photos");

// Cloudinary's top-level folder for this project
const CLOUDINARY_ROOT_FOLDER = "peinture-paris-showcase";

// Map local folders to their corresponding Cloudinary subfolders
const folderMap: Record<string, string> = {
  "ENDUIT": "ENDUIT",
  "PEINTURE INTERIEUR": "PEINTURE INTERIEUR",
  "ESCALIER": "ESCALIER",
  "AVANT-APRES": "AVANT-APRES",
};
// ------------------------------------


// --- CLOUDINARY CONFIGURATION ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
// --------------------------------


/**
 * Uploads a single file to Cloudinary.
 * @param localPath The full path to the local file.
 * @param cloudinarySubFolder The Cloudinary subfolder (e.g., "ENDUIT").
 * @returns The upload result object.
 */
async function uploadFile(localPath: string, cloudinarySubFolder: string) {
    const filename = path.basename(localPath, path.extname(localPath));
    const targetFolder = `${CLOUDINARY_ROOT_FOLDER}/${cloudinarySubFolder}`;

    console.log(`  -> Uploading ${path.basename(localPath)} to ${targetFolder}...`);

    try {
        const result = await cloudinary.uploader.upload(localPath, {
            folder: targetFolder,
            // Use the original filename (without extension) as the Public ID
            // to keep the naming consistent and prevent accidental duplication.
            public_id: filename, 
            resource_type: 'image',
            overwrite: false, // DO NOT overwrite existing files
        });
        
        console.log(`  -> SUCCESS: ${result.secure_url}`);
        return result;
    } catch (error: any) {
        if (error.http_code === 400 && error.message.includes('already exists')) {
            console.warn(`  -> WARNING: File already exists with public ID ${filename}. Skipping.`);
            return null;
        }
        console.error(`  -> ERROR: Failed to upload ${localPath}:`, error.message);
        return null;
    }
}

/**
 * Main function to iterate through local folders and upload files.
 */
async function migrate() {
    console.log("--- Starting Cloudinary Migration ---");
    console.log(`Local base directory: ${LOCAL_BASE_DIR}`);

    for (const [localDirName, cloudinaryFolder] of Object.entries(folderMap)) {
        const localDirPath = path.join(LOCAL_BASE_DIR, localDirName);

        if (!fs.existsSync(localDirPath)) {
            console.log(`\nCategory: ${localDirName} - Folder not found. Skipping.`);
            continue;
        }

        console.log(`\n--- Processing Category: ${localDirName} ---`);

        const files = fs.readdirSync(localDirPath)
            .filter(file => /\.(jpe?g|png|webp|gif)$/i.test(file));
        
        if (files.length === 0) {
            console.log("No images found in folder. Skipping.");
            continue;
        }

        for (const file of files) {
            const localFilePath = path.join(localDirPath, file);
            await uploadFile(localFilePath, cloudinaryFolder);
        }
    }

    console.log("\n--- Migration Complete! ---");
    console.log("Please delete your local 'public/photos' directory to prevent serving old files.");
}

migrate().catch(err => {
    console.error("\n*** GLOBAL MIGRATION ERROR ***", err);
    process.exit(1);
});