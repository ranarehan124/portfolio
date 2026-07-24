import { body } from 'express-validator';

export const contactValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .trim()
    .toLowerCase(),
  body('subject')
    .notEmpty()
    .withMessage('Subject is required')
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subject must be less than 200 characters'),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Message must be between 10 and 5000 characters'),
];