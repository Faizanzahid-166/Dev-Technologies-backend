import User from "../../models/user/User.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  getAuthCookieHeader,
  clearAuthCookieHeader,
  sendTokenResponse
} from '../../lib/auth.js';
//import {getUserFromCookies} from '../../lib/getUserFromCookies.js' not used here only in middleware
import { ApiSuccess, ApiError } from '../../utils/apiResponse.js';
//import { signupSchema, loginSchema } from '../../utils/validators.js';
import redisService from '../../database/redis/redis.js'
import bcrypt from "bcryptjs";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email already exists',
    });
  }

  const user = await User.create({ name, email, password });

  sendTokenResponse(user, 201, res);
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account has been deactivated',
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Debug: show what will be sent to client
  try {
    const out = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
    console.log('→ auth.login: sending', JSON.stringify({ success: true, token: '[REDACTED]', user: out }));
  } catch (e) {
    console.warn('→ auth.login: debug log failed', e);
  }

  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Get current authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

/**
 * @desc    Logout user (client-side token removal + optional Redis session clear)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  // Clear any Redis session
  await redisService.del(redisService.keys.sessionToken(req.user._id));

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

export { signup, login, getMe, logout };