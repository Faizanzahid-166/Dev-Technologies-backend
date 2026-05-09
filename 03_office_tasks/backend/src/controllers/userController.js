import User from '../models/User.js';

// @desc    Get all employees (Admin only)
// @route   GET /api/users/employees
// @access  Admin
export const getEmployees = async (req, res, next) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password').sort({ name: 1 });
    res.status(200).json({ success: true, employees });
  } catch (error) {
    next(error);
  }
};
