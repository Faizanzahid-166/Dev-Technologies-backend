// src/middlewares/upload.middleware.js

import multer from "multer";

/**
 * Allowed MIME Types
 */
const ALLOWED_MIME_TYPES = {
  images: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/jpg",
  ],

  videos: [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime", // mov
  ],

  documents: [
    "application/pdf",
  ],
};

/**
 * Flatten all allowed mime types
 */
const ALL_ALLOWED_TYPES = [
  ...ALLOWED_MIME_TYPES.images,
  ...ALLOWED_MIME_TYPES.videos,
  ...ALLOWED_MIME_TYPES.documents,
];

/**
 * Multer Memory Storage
 *
 * WHY MEMORY STORAGE?
 * -------------------
 * We upload directly to Cloudinary.
 * No need to save files locally.
 *
 * Benefits:
 * ✅ Faster
 * ✅ Cleaner
 * ✅ No temp files
 * ✅ Better for serverless/VPS
 */
const storage = multer.memoryStorage();

/**
 * File Filter
 */
const fileFilter = (req, file, cb) => {
  try {
    if (!ALL_ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(
        new Error(`Unsupported file type: ${file.mimetype}`),
        false
      );
    }

    cb(null, true);
  } catch (error) {
    cb(error, false);
  }
};

/**
 * Upload Middleware
 */
const upload = multer({
  storage,

  fileFilter,

  limits: {
    // 100MB
    fileSize: 100 * 1024 * 1024,

    // prevent spam uploads
    files: 5,
  },
});

/**
 * Helper Middleware
 *
 * Converts uploaded files into:
 * req.uploadedFiles
 */
export const handleUploadedFiles = (req, res, next) => {
  try {
    if (!req.files && !req.file) {
      req.uploadedFiles = [];
      return next();
    }

    // multiple files
    if (req.files) {
      req.uploadedFiles = Array.isArray(req.files)
        ? req.files
        : Object.values(req.files).flat();

      return next();
    }

    // single file
    req.uploadedFiles = [req.file];

    next();
  } catch (error) {
    next(error);
  }
};

export default upload;