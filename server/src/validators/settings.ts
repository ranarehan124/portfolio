import { body } from 'express-validator';

export const updateSettingsValidator = [
  body('siteName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Site name must be less than 100 characters'),
  body('siteDescription')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Site description must be less than 500 characters'),
  body('siteUrl')
    .optional()
    .isURL()
    .withMessage('Site URL must be valid'),
  body('logoUrl')
    .optional()
    .isURL()
    .withMessage('Logo URL must be valid'),
  body('faviconUrl')
    .optional()
    .isURL()
    .withMessage('Favicon URL must be valid'),
  body('primaryColor')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Must be a valid hex color'),
  body('accentColor')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Must be a valid hex color'),
  body('contactEmail')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email'),
  body('contactPhone')
    .optional()
    .trim(),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Address must be less than 300 characters'),
  body('resumeUrl')
    .optional()
    .isURL()
    .withMessage('Resume URL must be valid'),
  body('showResumeButton')
    .optional()
    .isBoolean()
    .withMessage('showResumeButton must be a boolean'),
  body('maintenanceMode')
    .optional()
    .isBoolean()
    .withMessage('maintenanceMode must be a boolean'),
];

export const updateSeoValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 70 })
    .withMessage('SEO title must be less than 70 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('SEO description must be less than 160 characters'),
  body('keywords')
    .optional()
    .isArray()
    .withMessage('Keywords must be an array'),
  body('keywords.*')
    .optional()
    .isString()
    .trim(),
  body('ogTitle')
    .optional()
    .trim()
    .isLength({ max: 70 })
    .withMessage('OG title must be less than 70 characters'),
  body('ogDescription')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('OG description must be less than 160 characters'),
  body('ogImage')
    .optional()
    .isURL()
    .withMessage('OG image must be a valid URL'),
  body('ogType')
    .optional()
    .isIn(['website', 'article', 'profile'])
    .withMessage('OG type must be website, article, or profile'),
  body('twitterCard')
    .optional()
    .isIn(['summary', 'summary_large_image'])
    .withMessage('Twitter card must be summary or summary_large_image'),
  body('twitterTitle')
    .optional()
    .trim()
    .isLength({ max: 70 })
    .withMessage('Twitter title must be less than 70 characters'),
  body('twitterDescription')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('Twitter description must be less than 160 characters'),
  body('twitterImage')
    .optional()
    .isURL()
    .withMessage('Twitter image must be a valid URL'),
  body('canonicalUrl')
    .optional()
    .isURL()
    .withMessage('Canonical URL must be valid'),
  body('robots')
    .optional()
    .trim(),
];