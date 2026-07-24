import { body } from 'express-validator';

export const createCertificateValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('issuer')
    .notEmpty()
    .withMessage('Issuer is required')
    .trim()
    .isLength({ max: 200 })
    .withMessage('Issuer must be less than 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('certificateUrl')
    .optional()
    .isURL()
    .withMessage('Certificate URL must be valid'),
  body('badgeUrl')
    .optional()
    .isURL()
    .withMessage('Badge URL must be valid'),
  body('issueDate')
    .notEmpty()
    .withMessage('Issue date is required')
    .trim(),
  body('expiryDate')
    .optional()
    .trim(),
  body('credentialId')
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

export const updateCertificateValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('issuer')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Issuer must be less than 200 characters'),
  body('description')
    .optional()
    .trim(),
  body('certificateUrl')
    .optional()
    .isURL()
    .withMessage('Certificate URL must be valid'),
  body('badgeUrl')
    .optional()
    .isURL()
    .withMessage('Badge URL must be valid'),
  body('issueDate')
    .optional()
    .trim(),
  body('expiryDate')
    .optional()
    .trim(),
  body('credentialId')
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