import User from '../../models/User.js';
import redisService from '../../database/redis/redis.js';
import Dependency from "../../models/Dependency.js";

const ALLOWED_PROFILE_FIELDS = [
  // Basic
  'name', 'bio', 'skills', 'profileImage',
  // Personal
  'fatherName', 'mobileNumber', 'whatsappNumber', 'cnic',
  'dateOfBirth', 'gender', 'religion', 'maritalStatus', 'disabilityStatus',
  // Address
  'domicileProvince', 'domicileDistrict', 'city', 'permanentAddress', 'postalAddress',
  // Education
  'qualifications',
];

/**
 * @desc    Get user profile (Redis cached)
 * @route   GET /api/user/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const cacheKey = redisService.keys.userProfile(userId);

    // 1. Check Redis cache
    const cached = await redisService.get(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, source: 'cache', user: cached });
    }

    // 2. Cache miss — fetch from MongoDB
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const profile = user.toSafeObject();

    // 3. Store in Redis
    await redisService.set(cacheKey, profile);

    res.status(200).json({ success: true, source: 'database', user: profile });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile (busts Redis cache)
 * @route   PUT /api/user/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();

    const updates = {};
    ALLOWED_PROFILE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields provided' });
    }

    // Strip client-side `id` fields from qualifications (use MongoDB _id)
    if (updates.qualifications) {
      updates.qualifications = updates.qualifications.map(({ id, ...rest }) => rest);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Invalidate Redis cache
    await redisService.del(redisService.keys.userProfile(userId));

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard stats
 * @route   GET /api/user/stats
 * @access  Private
 */


const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [total, pending, inProgress, completed] = await Promise.all([
      Dependency.countDocuments({ userId }),
      Dependency.countDocuments({ userId, status: "pending" }),
      Dependency.countDocuments({ userId, status: "in-progress" }),
      Dependency.countDocuments({ userId, status: "completed" }),
    ]);

    const recentDeps = await Dependency.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        completed,
        completionRate:
          total > 0 ? Math.round((completed / total) * 100) : 0,
      },
      recentDependencies: recentDeps,
    });
  } catch (error) {
    next(error);
  }
};

export { getProfile, updateProfile, getDashboardStats };