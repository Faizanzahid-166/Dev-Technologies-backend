import express from "express";
import { upload } from "../../middlewares/upload.middleware.js";
import {
  uploadDocument,
  getMyDocuments, docsPreview,
  getDocumentById,
  addSignature,
} from "../../controllers/document-logic/document.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadDocument);
router.get("/my/list", protect, getMyDocuments);
router.get("/preview/:id", protect, docsPreview),
router.get("/:id/download", protect, getDocumentById);
router.post("/:id/sign", protect, upload.single("signature"), addSignature);

export default router;
