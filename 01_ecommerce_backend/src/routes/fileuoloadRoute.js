import express from "express";
import upload from "../middleware/multer.Middleware.js";
import { registerbanner, getBanners, getProductById } from "../controllers/registerproductController.js";

//console.log("Product routes loaded ✅");

const router = express.Router();

router.post("/banner", upload.single("image"), registerbanner);
router.get("/bannerinfo", getBanners);
router.get('/:id', getProductById);

export default router;

