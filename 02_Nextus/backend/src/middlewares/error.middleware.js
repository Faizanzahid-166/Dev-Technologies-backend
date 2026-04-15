import multer from "multer";

// for multer
export const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum allowed size is 30MB.",
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Only PDF files are allowed.",
      });
    }
  }

  next(err);
};

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Server Error", error: err.message });
};
