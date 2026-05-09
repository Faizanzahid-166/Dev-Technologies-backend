import express from 'express';
import { getEmployees } from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/employees', restrictTo('admin'), getEmployees);

export default router;
