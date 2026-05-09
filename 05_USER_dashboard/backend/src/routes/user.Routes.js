import express from 'express';
import { getProfile, updateProfile, getDashboardStats } from '../controllers/user/user.Controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { profileUpdateValidation } from '../utils/expressvalidators.js';

const router = express.Router();
router.use(protect); // All user routes require authentication

router.get('/profile', getProfile);
router.put('/profile', profileUpdateValidation, updateProfile);
router.get('/stats', getDashboardStats);

export default router;