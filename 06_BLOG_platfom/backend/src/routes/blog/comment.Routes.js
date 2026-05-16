import express from 'express';
import { getComments, addComment, deleteComment } from '../../controllers/blog/comment.controller.js';
import { protect, adminOnly } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/:blogId', getComments);
router.post('/:blogId', addComment);
router.delete('/:id', protect, adminOnly, deleteComment);

export default router;