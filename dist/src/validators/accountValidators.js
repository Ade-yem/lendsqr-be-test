"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetTransactions = exports.validateDeleteAccount = exports.validateTransferFunds = exports.validateFundAccount = exports.validateCreateAccount = exports.validateGetAccount = void 0;
const express_validator_1 = require("express-validator");
exports.validateGetAccount = [
    (0, express_validator_1.param)('id').isInt().withMessage('Invalid id')
];
exports.validateCreateAccount = [
    (0, express_validator_1.check)('accountName').notEmpty().escape().withMessage('Name is required'),
];
exports.validateFundAccount = [
    (0, express_validator_1.body)('amount').isNumeric().isFloat().notEmpty().withMessage('Amount cannot be empty'),
    (0, express_validator_1.body)('accountNumber').isNumeric().withMessage('Account number must be numeric'),
];
exports.validateTransferFunds = [
    (0, express_validator_1.body)('amount').isFloat().notEmpty().withMessage('Amount cannot be empty'),
    (0, express_validator_1.body)('accountNumber').isNumeric().withMessage('Account number must be numeric'),
    (0, express_validator_1.body)('to').isNumeric().withMessage('Account number must be numeric'),
];
exports.validateDeleteAccount = [
    (0, express_validator_1.param)('id').isInt().withMessage('Invalid id')
];
exports.validateGetTransactions = [
    (0, express_validator_1.param)('accountNumber').isNumeric().withMessage('Invalid account number')
];
