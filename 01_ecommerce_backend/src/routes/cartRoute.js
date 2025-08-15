import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
} from '../controllers/cartController.js';
import protect   from '../middleware/authMiddleware.js';
const router = express.Router();

// Cart routes
router.get('/',protect, getCart);
router.post('/',protect, addToCart);
router.put('/item/:productId',protect, updateCartItem);
router.delete('/item/:productId',protect, removeFromCart);

export default router;
