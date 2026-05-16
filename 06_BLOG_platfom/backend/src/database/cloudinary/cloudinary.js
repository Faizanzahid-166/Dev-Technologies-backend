import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

/**
 * =====================================================
 * Cloudinary Config
 * =====================================================
 */
cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET,
});

/**
 * =====================================================
 * Detect Resource Type
 * =====================================================
 */
const getResourceType = (
  mimetype = ""
) => {
  if (
    mimetype.startsWith("image/")
  ) {
    return "image";
  }

  if (
    mimetype.startsWith("video/")
  ) {
    return "video";
  }

  if (
    mimetype ===
    "application/pdf"
  ) {
    return "raw"; //raw, pdf, image
  }

  return "auto";
};

/**
 * =====================================================
 * Auto Folder Structure
 * =====================================================
 *
 * my-app/
 * └── uploads/
 *     ├── images/
 *     ├── videos/
 *     └── pdfs/
 * =====================================================
 */
const getFolderByType = (
  mimetype = ""
) => {
  if (
    mimetype.startsWith("image/")
  ) {
    return "01-blitz-news/uploads/images";
  }

  if (
    mimetype.startsWith("video/")
  ) {
    return "01-blitz-news/uploads/videos";
  }

  if (
    mimetype ===
    "application/pdf"
  ) {
    return "01-blitz-news/uploads/pdfs";
  }

  return "01-blitz-news/uploads/others";
};

/**
 * =====================================================
 * Upload File
 * =====================================================
 */
const uploadCloudinary = (
  fileBuffer,
  {
    folder = null,
    mimetype = "application/octet-stream",
    publicId = null,
  } = {}
) => {
  return new Promise(
    (resolve, reject) => {
      try {
        if (!fileBuffer) {
          return reject(
            new Error(
              "File buffer is required"
            )
          );
        }

        /**
         * Auto Detect
         */
        const resourceType =
          getResourceType(
            mimetype
          );

        /**
         * IMPORTANT FIX
         *
         * Use dynamic folders
         * if folder not provided
         */
        const finalFolder =
          folder ||
          getFolderByType(
            mimetype
          );

        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
  folder: finalFolder,

  resource_type: resourceType,

  use_filename: true,

  unique_filename: !publicId,

  overwrite: !!publicId,

  public_id: publicId || undefined,

  // ✅ IMPORTANT FIX
  format:
    mimetype === "application/pdf"
      ? "pdf"
      : undefined,
},

            (
              error,
              result
            ) => {
              if (error) {
                console.error(
                  "❌ Cloudinary Upload Error:",
                  error
                );

                return reject(
                  error
                );
              }

              resolve({
                secureUrl:
                  result.secure_url,

                publicId:
                  result.public_id,

                resourceType:
                  result.resource_type,

                format:
                  result.format,

                bytes:
                  result.bytes,

                version:
                  result.version,

                folder:
                  result.folder,

                
              });
               console.log(result.secure_url);
               
            }
          );

         

        streamifier
          .createReadStream(
            fileBuffer
          )
          .pipe(uploadStream);
          
      } catch (error) {
        reject(error);
      }
    }
  );
};

/**
 * =====================================================
 * Delete File
 * =====================================================
 */
const deleteCloudinary =
  async (
    publicId,
    resourceType = "image"
  ) => {
    if (!publicId) {
      throw new Error(
        "Public ID is required"
      );
    }

    return await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type:
          resourceType,
      }
    );
  };

/**
 * =====================================================
 * Update Existing File
 * =====================================================
 */
const updateCloudinary =
  async (
    fileBuffer,
    {
      publicId = null,
      folder = null,
      mimetype = "application/octet-stream",
    }
  ) => {
    if (!publicId) {
      throw new Error(
        "Public ID is required for update"
      );
    }

    return await uploadCloudinary(
      fileBuffer,
      {
        folder,
        mimetype,
        publicId,
        
      }
    );
  };

  
export {
  uploadCloudinary,
  updateCloudinary,
  deleteCloudinary,
};