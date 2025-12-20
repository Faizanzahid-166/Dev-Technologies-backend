import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  uploadDocument,
  listDocuments,
  downloadDocument,
  addSignature,
} from "../controllers/appwrite.controller.js";

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadDocument);
router.get("/my/list", protect, listDocuments);
router.get("/:id/download", protect, downloadDocument);
router.post("/:id/sign", protect, upload.single("signature"), addSignature);

export default router;
