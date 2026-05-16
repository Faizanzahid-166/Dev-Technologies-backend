import { body, validationResult } from 'express-validator';

// Middleware to handle validation errors
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const signupValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  handleValidation,
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

const profileUpdateValidation = [
  body('name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Name must be 1–100 chars'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  body('skills').optional().isArray({ max: 20 }).withMessage('Skills must be an array with max 20 items'),
  // Allow base64 or URL for profileImage
  body('profileImage').optional().trim(),
  // Personal
  body('fatherName').optional().trim().isLength({ max: 100 }).withMessage('Father name too long'),
  body('mobileNumber').optional().trim().isLength({ max: 20 }),
  body('whatsappNumber').optional().trim().isLength({ max: 20 }),
  body('cnic').optional().trim().isLength({ max: 15 }),
  body('dateOfBirth').optional({ nullable: true }).isISO8601().withMessage('Invalid date of birth'),
  body('gender').optional().isIn(['Male', 'Female', 'Transgender']).withMessage('Invalid gender'),
  body('religion').optional().trim().isLength({ max: 50 }),
  body('maritalStatus').optional().isIn(['Single', 'Married', 'Divorced', 'Widowed']).withMessage('Invalid marital status'),
  body('disabilityStatus').optional().isIn(['Yes', 'No']).withMessage('Invalid disability status'),
  // Address
  body('domicileProvince').optional().trim().isLength({ max: 100 }),
  body('domicileDistrict').optional().trim().isLength({ max: 100 }),
  body('city').optional().trim().isLength({ max: 100 }),
  body('permanentAddress').optional().trim().isLength({ max: 500 }),
  body('postalAddress').optional().trim().isLength({ max: 500 }),
  // Education
  body('qualifications').optional().isArray({ max: 15 }).withMessage('Max 15 qualifications'),
  body('qualifications.*.degreeType').optional().trim().isLength({ max: 100 }),
  body('qualifications.*.institution').optional().trim().isLength({ max: 200 }),
  body('qualifications.*.yearOfCompletion').optional().trim(),
  handleValidation,
];

const dependencyValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid date'),
  handleValidation,
];

const dependencyUpdateValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid date'),
  handleValidation,
];

export {
  signupValidation,
  loginValidation,
  profileUpdateValidation,
  dependencyValidation,
  dependencyUpdateValidation,
};
