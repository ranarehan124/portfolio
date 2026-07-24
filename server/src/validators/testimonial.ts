import { body } from 'express-validator';

export const createTestimonialValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .trim()
    .isLength({ max: 200 })
    .withMessage('Role must be less than 200 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Company must be less than 200 characters'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Content must be between 10 and 1000 characters'),
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
];

export const updateTestimonialValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
  body('role')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Role must be less than 200 characters'),
  body('company')
    .optional()
    .trim(),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Content must be between 10 and 1000 characters'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
];