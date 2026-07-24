import { body } from 'express-validator';

export const createServiceValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  body('icon')
    .optional()
    .trim(),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  body('features.*')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Each feature must be less than 200 characters'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

export const updateServiceValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  body('icon')
    .optional()
    .trim(),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  body('features.*')
    .optional()
    .isString()
    .trim(),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];