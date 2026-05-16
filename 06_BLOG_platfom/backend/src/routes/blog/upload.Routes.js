// SRC: backend/src/routes/blog/upload.routes.js

import express from "express";
import upload, { handleUploadedFiles} from "../../middlewares/upload.middleware.js";
import {
  uploadSingleFile,
  uploadMultipleFiles,
  updateFile,
  deleteFile,
  inlinePDF,
} from "../../controllers/blog/upload.controller.js";
import { protect, adminOnly,} from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * =========================================================
 * Upload Single File
 * Supports:
 * - image
 * - video
 * - pdf
 *
 * field name: file
 * =========================================================
 */
router.post("/single", protect,adminOnly, upload.single("file"), uploadSingleFile);

/**
 * =========================================================
 * Upload Multiple Files
 *
 * field name: files
 * max: 5 files
 * =========================================================
 */
router.post( "/multiple", protect, adminOnly, upload.array("files", 5), handleUploadedFiles,
 uploadMultipleFiles
);

/**
 * =========================================================
 * Update Existing File
 *
 * field name: file
 * =========================================================
 */
router.put( "/update/:publicId", protect, adminOnly,
  upload.single("file"),updateFile);

/**
 * =========================================================
 * Delete File
 * =========================================================
 */
router.delete(
  "/delete", protect, adminOnly,
   deleteFile
);

router.get(
  "/inline-pdf",
  inlinePDF
);

export default router;