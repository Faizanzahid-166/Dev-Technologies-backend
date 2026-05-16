import express from 'express';
import { subscribe, unsubscribe, getSubscribers } from '../../controllers/blog/newsletter.controller.js';
import { protect, adminOnly } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/subscribers', protect, adminOnly, getSubscribers);

export default router;