import { body, validationResult, param } from 'express-validator';

// Validation middleware factory
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

// Registration validation
export const validateRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validate,
];

// Login validation
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate,
];

// Post validation
export const validatePost = [
  body('content')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Post content cannot be more than 2000 characters'),
  validate,
];

// Comment validation
export const validateComment = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot be more than 1000 characters'),
  validate,
];

// Update profile validation
export const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot be more than 500 characters'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Website must be a valid URL'),
  validate,
];

// Forgot password validation
export const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  validate,
];

// Reset password validation
export const validateResetPassword = [
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validate,
];

// Story validation
export const validateStory = [
  body('caption')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Caption cannot be more than 500 characters'),
  validate,
];

// Message validation
export const validateMessage = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required'),
  validate,
];

// ID parameter validation
export const validateId = [
  param('id')
    .notEmpty()
    .withMessage('ID is required')
    .isMongoId()
    .withMessage('Invalid ID format'),
  validate,
];