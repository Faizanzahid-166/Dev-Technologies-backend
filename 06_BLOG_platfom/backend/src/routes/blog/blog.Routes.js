import express from 'express';
import {
  getBlogs,
  getBlogBySlug,
  getBlogById,
  getFeaturedBlogs,
  getTrendingBlogs,
  getAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  getDashboardStats,
  getCategories,
} from '../../controllers/blog/blog.controller.js';
import { protect, adminOnly } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/trending', getTrendingBlogs);
router.get('/categories', getCategories);
 
// Admin routes (must be before /:slug to avoid conflict)
router.get('/admin/all', protect, adminOnly, getAdminBlogs);
router.get('/admin/stats', protect, adminOnly, getDashboardStats);
router.get('/admin/id/:id', protect, adminOnly, getBlogById);
router.post('/', protect, adminOnly, createBlog);
router.put('/:id', protect, adminOnly, updateBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);
 
// Public slug route (last to avoid matching admin routes)
router.get('/:slug', getBlogBySlug);
router.post('/:id/like', toggleLike);
 

export default router;