import multer from "multer";

/**
 * Multer memory storage (Cloudinary compatible)
 */
const storage = multer.memoryStorage();

/**
 * File filter (PDF only)
 */
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Only PDF files are allowed"
      )
    );
  }
};

/**
 * Multer instance
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 30 * 1024 * 1024, // ✅ 30 MB
  },
});
