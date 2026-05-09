import express from 'express';
import {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
  getReasons,
} from '../controllers/taskController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Shared
router.get('/reasons', getReasons);

// Admin routes
router.post('/', restrictTo('admin'), createTask);
router.get('/', restrictTo('admin'), getAllTasks);

// Employee routes
router.get('/my', restrictTo('employee'), getMyTasks);
router.patch('/:id/status', restrictTo('employee'), updateTaskStatus);

export default router;
