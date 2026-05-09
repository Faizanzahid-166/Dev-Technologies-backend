import Dependency from '../../models/Dependency.js';
import redisService from '../../database/redis/redis.js';

/**
 * @desc    Get all dependencies for the logged-in user
 * @route   GET /api/dependencies
 * @access  Private
 */
const getDependencies = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const { status, priority, page = 1, limit = 20, sort = '-createdAt' } = req.query;

    // Build filter
    const filter = { userId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Only cache if no special filters
    const isDefaultQuery = !status && !priority && page == 1;
    const cacheKey = redisService.keys.userDependencies(userId);

    if (isDefaultQuery) {
      const cached = await redisService.get(cacheKey);
      if (cached) {
        return res.status(200).json({ success: true, source: 'cache', ...cached });
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [dependencies, total] = await Promise.all([
      Dependency.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Dependency.countDocuments(filter),
    ]);

    const response = {
      dependencies,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    };

    if (isDefaultQuery) {
      await redisService.set(cacheKey, response, 300); // 5 min cache
    }

    res.status(200).json({ success: true, source: 'database', ...response });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new dependency
 * @route   POST /api/dependencies
 * @access  Private
 */
const createDependency = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { title, description, status, priority, dueDate, tags } = req.body;

    const dependency = await Dependency.create({
      userId,
      title,
      description,
      status,
      priority,
      dueDate,
      tags,
    });

    // Invalidate list cache
    await redisService.del(redisService.keys.userDependencies(userId.toString()));

    res.status(201).json({
      success: true,
      message: 'Dependency created',
      dependency,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a dependency
 * @route   PUT /api/dependencies/:id
 * @access  Private
 */
const updateDependency = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate', 'tags'];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update',
      });
    }

    const dependency = await Dependency.findOneAndUpdate(
      { _id: id, userId }, // Ensure ownership
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!dependency) {
      return res.status(404).json({
        success: false,
        message: 'Dependency not found or unauthorized',
      });
    }

    // Invalidate list cache
    await redisService.del(redisService.keys.userDependencies(userId.toString()));

    res.status(200).json({
      success: true,
      message: 'Dependency updated',
      dependency,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a dependency
 * @route   DELETE /api/dependencies/:id
 * @access  Private
 */
const deleteDependency = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const dependency = await Dependency.findOneAndDelete({ _id: id, userId });

    if (!dependency) {
      return res.status(404).json({
        success: false,
        message: 'Dependency not found or unauthorized',
      });
    }

    // Invalidate list cache
    await redisService.del(redisService.keys.userDependencies(userId.toString()));

    res.status(200).json({
      success: true,
      message: 'Dependency deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single dependency
 * @route   GET /api/dependencies/:id
 * @access  Private
 */
const getDependency = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const dependency = await Dependency.findOne({ _id: id, userId });

    if (!dependency) {
      return res.status(404).json({
        success: false,
        message: 'Dependency not found',
      });
    }

    res.status(200).json({ success: true, dependency });
  } catch (error) {
    next(error);
  }
};

export {
  getDependencies,
  createDependency,
  updateDependency,
  deleteDependency,
  getDependency,
};