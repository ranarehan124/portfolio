import { body } from 'express-validator';

export const createSkillValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['frontend', 'backend', 'tools', 'design', 'other'])
    .withMessage('Invalid category'),
  body('level')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Level must be between 0 and 100'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
];