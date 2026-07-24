import { body } from 'express-validator';

export const createProjectValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim(),
  body('thumbnail')
    .notEmpty()
    .withMessage('Thumbnail is required')
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .trim(),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
];

export const updateProjectValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('description').optional().trim(),
  body('thumbnail')
    .optional()
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
];