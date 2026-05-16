import express from 'express';
import { signup, login, getMe, logout } from '../../controllers/auth/auth.Controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { signupValidation, loginValidation } from '../../utils/expressvalidators.js'

const router = express.Router();

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;