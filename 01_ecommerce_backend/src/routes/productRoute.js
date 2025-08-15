// routes/productRoutes.js
import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import upload from "../middleware/multer.Middleware.js";

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', upload.single("image"),createProduct);// use it later
router.put('/:id',upload.single("image"), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
