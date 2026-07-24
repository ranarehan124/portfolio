import { body } from 'express-validator';

export const createAboutValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
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
  body('longDescription')
    .optional()
    .trim(),
  body('profileImage')
    .optional()
    .isURL()
    .withMessage('Profile image must be a valid URL'),
  body('age')
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be between 0 and 150'),
  body('country')
    .notEmpty()
    .withMessage('Country is required')
    .trim(),
  body('city')
    .notEmpty()
    .withMessage('City is required')
    .trim(),
  body('languages')
    .optional()
    .isArray()
    .withMessage('Languages must be an array'),
  body('languages.*')
    .optional()
    .isString()
    .trim(),
  body('yearsOfExperience')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Years of experience must be non-negative'),
  body('availableForHire')
    .optional()
    .isBoolean()
    .withMessage('availableForHire must be a boolean'),
  body('resumeUrl')
    .optional()
    .isURL()
    .withMessage('Resume URL must be valid'),
];

export const updateAboutValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('description')
    .optional()
    .trim(),
  body('longDescription')
    .optional()
    .trim(),
  body('profileImage')
    .optional()
    .isURL()
    .withMessage('Profile image must be a valid URL'),
  body('age')
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be between 0 and 150'),
  body('country')
    .optional()
    .trim(),
  body('city')
    .optional()
    .trim(),
  body('languages')
    .optional()
    .isArray()
    .withMessage('Languages must be an array'),
  body('yearsOfExperience')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Years of experience must be non-negative'),
  body('availableForHire')
    .optional()
    .isBoolean()
    .withMessage('availableForHire must be a boolean'),
  body('resumeUrl')
    .optional()
    .isURL()
    .withMessage('Resume URL must be valid'),
];