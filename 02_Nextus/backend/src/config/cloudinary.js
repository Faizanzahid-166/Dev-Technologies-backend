import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (localFilePath, mimetype) => {
  try {
    const isPdf = mimetype === "application/pdf";
    const resourceType = isPdf ? "raw" : "image"; // raw for PDF/docs

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
      folder: "documents",
      use_filename: true,
      unique_filename: true,
    });

    // Return secure URL for public access
    let downloadUrl = response.secure_url;

    // For PDFs, optionally generate signed URL
    if (isPdf) {
      downloadUrl = cloudinary.utils.private_download_url(
        response.public_id,
        "pdf",
        { resource_type: "raw" }
      );
    }

    return { ...response, downloadUrl };
  } catch (err) {
    console.error("Cloudinary upload error:", err.message);
    return null;
  }
};

export { uploadCloudinary };
