import { body, check, param } from 'express-validator';

export const validateGetAccount = [
  param('id').isInt().withMessage('Invalid id')
];

export const validateCreateAccount = [
  check('accountName').notEmpty().escape().withMessage('Name is required'),
];

export const validateFundAccount = [
  body('amount').isNumeric().isFloat().notEmpty().withMessage('Amount cannot be empty'),
  body('accountNumber').isNumeric().withMessage('Account number must be numeric'),
];

export const validateTransferFunds = [
  body('amount').isFloat().notEmpty().withMessage('Amount cannot be empty'),
  body('accountNumber').isNumeric().withMessage('Account number must be numeric'),
  body('to').isNumeric().withMessage('Account number must be numeric'),
];

export const validateDeleteAccount = [
  param('id').isInt().withMessage('Invalid id')
];

export const validateGetTransactions = [
  param('accountNumber').isNumeric().withMessage('Invalid account number')
];