import { body } from 'express-validator';

export const createExperienceValidator = [
  body('company')
    .notEmpty()
    .withMessage('Company is required')
    .trim()
    .isLength({ max: 200 })
    .withMessage('Company must be less than 200 characters'),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .trim(),
  body('location')
    .notEmpty()
    .withMessage('Location is required')
    .trim(),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .trim(),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim(),
  body('current')
    .optional()
    .isBoolean()
    .withMessage('Current must be a boolean'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
];