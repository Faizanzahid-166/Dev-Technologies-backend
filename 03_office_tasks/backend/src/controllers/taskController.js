import Task, { TASK_REASONS } from '../models/Task.js';
import User from '../models/User.js';

// @desc    Create a task (Admin only)
// @route   POST /api/tasks
// @access  Admin
export const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;

    if (!title || !description || !assignedTo) {
      return res.status(400).json({ message: 'Title, description, and assignee are required.' });
    }

    // Verify assigned user exists and is an employee
    const employee = await User.findById(assignedTo);
    if (!employee || employee.role !== 'employee') {
      return res.status(400).json({ message: 'Invalid employee selected.' });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      dueDate: dueDate || null,
    });

    await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'assignedBy', select: 'name email' },
    ]);

    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks (Admin only)
// @route   GET /api/tasks
// @access  Admin
export const getAllTasks = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (status && ['pending', 'completed', 'not_completed'].includes(status)) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('assignedTo', 'name email')
        .populate('assignedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Task.countDocuments(filter),
    ]);

    // Dashboard stats
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statsMap = { pending: 0, completed: 0, not_completed: 0 };
    stats.forEach((s) => (statsMap[s._id] = s.count));

    res.status(200).json({
      success: true,
      tasks,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      stats: statsMap,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks assigned to logged-in employee
// @route   GET /api/tasks/my
// @access  Employee
export const getMyTasks = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    const filter = { assignedTo: req.user._id };

    if (status && ['pending', 'completed', 'not_completed'].includes(status)) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(filter)
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });

    // Stats for employee
    const stats = await Task.aggregate([
      { $match: { assignedTo: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statsMap = { pending: 0, completed: 0, not_completed: 0 };
    stats.forEach((s) => (statsMap[s._id] = s.count));

    res.status(200).json({ success: true, tasks, stats: statsMap });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status (Employee only - own tasks)
// @route   PATCH /api/tasks/:id/status
// @access  Employee
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;

    const validStatuses = ['pending', 'completed', 'not_completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Valid status is required.' });
    }

    // Validate reason when not_completed
    if (status === 'not_completed') {
      if (!reason) {
        return res.status(400).json({ message: 'Reason is required when task is not completed.' });
      }
      if (!TASK_REASONS.includes(reason)) {
        return res.status(400).json({ message: 'Invalid reason selected.' });
      }
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Only assigned employee can update
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update tasks assigned to you.' });
    }

    task.status = status;
    task.reason = status === 'not_completed' ? reason : null;
    await task.save();

    await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'assignedBy', select: 'name email' },
    ]);

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Get predefined reasons
// @route   GET /api/tasks/reasons
// @access  Private
export const getReasons = async (req, res) => {
  res.status(200).json({ success: true, reasons: TASK_REASONS });
};
