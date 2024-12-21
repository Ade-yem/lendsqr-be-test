import { body, check } from 'express-validator';

export const validateUpdateName = [
  body('name').escape().notEmpty().withMessage('Invalid name, name must not be empty')
];

export const validateCreateAccount = [
  check('accountName').notEmpty().escape().withMessage('Name is required'),
];

export const validateUpdatePassword = [
  body('password').escape().notEmpty().withMessage('Password cannot be empty'),
  body('newPassword').isStrongPassword().escape().notEmpty().withMessage('New password cannot be empty'),
];
