import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import sharp from "sharp";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

     // Create a smaller temp file before upload
    const compressedPath = localFilePath.replace(/(\.\w+)$/, "-compressed$1");
    await sharp(localFilePath)
      .resize({ width: 1200 }) // reduce resolution
      .jpeg({ quality: 80 })   // compress
      .toFile(compressedPath);

    const result = await cloudinary.uploader.upload(compressedPath, 
      {
      resource_type: "auto"
    });
    console.log(result);
    
   // fs.unlinkSync(localFilePath); // remove local file after upload
    return result;
  } catch (error) {
        console.log("error", error);
  // Cleanup files
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    if (fs.existsSync(compressedPath)) fs.unlinkSync(compressedPath);
    throw error;

    
  }
};


