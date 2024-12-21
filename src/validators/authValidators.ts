import { check } from 'express-validator';

export const validateLoginUser = [
  check('email').isEmail().withMessage('Invalid email'),
  check('password').notEmpty().withMessage('Password is required')
];

export const validateRegisterUser = [
  check('email').isEmail().withMessage('Invalid email'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('name').notEmpty().withMessage('Name is required')
];