import express from "express";
import upload from "../../middlewares/upload.middleware.js";
import {
  uploadPDF,
  getAllPDFs,
  getPDFById,
  downloadPDF,
  deletePDF,
   inlinePDF,
} from "../../controllers/document-logic/pdf.controller.js";

const router = express.Router();

router.post("/upload", upload.single("pdf"), uploadPDF);
router.get("/", getAllPDFs);
router.get("/:id", getPDFById);
router.delete("/:id", deletePDF);
router.get("/:id/download", downloadPDF);   // ← proxy download with correct filename
router.get("/:id/inline", inlinePDF);       // opens in browser tab

export default router;