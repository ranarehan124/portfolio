import { body } from 'express-validator';

export const createEducationValidator = [
  body('institution')
    .notEmpty()
    .withMessage('Institution is required')
    .trim()
    .isLength({ max: 200 })
    .withMessage('Institution must be less than 200 characters'),
  body('degree')
    .notEmpty()
    .withMessage('Degree is required')
    .trim()
    .isLength({ max: 200 })
    .withMessage('Degree must be less than 200 characters'),
  body('field')
    .notEmpty()
    .withMessage('Field of study is required')
    .trim()
    .isLength({ max: 200 })
    .withMessage('Field must be less than 200 characters'),
  body('startYear')
    .notEmpty()
    .withMessage('Start year is required')
    .matches(/^\d{4}$/)
    .withMessage('Must be a valid 4-digit year'),
  body('endYear')
    .notEmpty()
    .withMessage('End year is required')
    .matches(/^\d{4}$|^Present$/i)
    .withMessage('Must be a valid year or "Present"'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('logoUrl')
    .optional()
    .isURL()
    .withMessage('Logo URL must be valid'),
  body('grade')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Grade must be less than 50 characters'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

export const updateEducationValidator = [
  body('institution')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Institution must be less than 200 characters'),
  body('degree')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Degree must be less than 200 characters'),
  body('field')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Field must be less than 200 characters'),
  body('startYear')
    .optional()
    .matches(/^\d{4}$/)
    .withMessage('Must be a valid 4-digit year'),
  body('endYear')
    .optional()
    .matches(/^\d{4}$|^Present$/i)
    .withMessage('Must be a valid year or "Present"'),
  body('description')
    .optional()
    .trim(),
  body('logoUrl')
    .optional()
    .isURL()
    .withMessage('Logo URL must be valid'),
  body('grade')
    .optional()
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