import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

/**
 * Cloudinary config
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload buffer to Cloudinary
 * Supports PDFs (raw) & Images (image)
 *
 * @param {Buffer} fileBuffer
 * @param {string} folder - e.g. 02_next_us/documents/<userId>
 * @param {string} mimetype - file mimetype
 */
const uploadCloudinary = (
  fileBuffer,
  folder = "documents",
  mimetype = "application/pdf"
) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      return reject(new Error("File buffer is required"));
    }

    const isPdf = mimetype === "application/pdf";

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,                              // ✅ nested folders supported
        resource_type: isPdf ? "raw" : "image",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          return reject(error);
        }

        resolve({
          secureUrl: result.secure_url,      // normalized keys
          publicId: result.public_id,
          resourceType: result.resource_type,
          bytes: result.bytes,
          format: result.format,
        });
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export { uploadCloudinary };
