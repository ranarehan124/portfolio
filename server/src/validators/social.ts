import { body } from 'express-validator';

export const socialValidator = [
  body('platform')
    .notEmpty()
    .withMessage('Platform is required')
    .trim()
    .isLength({ max: 50 })
    .withMessage('Platform must be less than 50 characters'),
  body('url')
    .notEmpty()
    .withMessage('URL is required')
    .isURL()
    .withMessage('Must be a valid URL'),
  body('icon')
    .optional()
    .trim(),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
];