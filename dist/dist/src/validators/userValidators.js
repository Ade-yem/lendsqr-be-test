"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdatePassword = exports.validateCreateAccount = exports.validateUpdateName = void 0;
const express_validator_1 = require("express-validator");
exports.validateUpdateName = [
    (0, express_validator_1.body)('name').escape().notEmpty().withMessage('Invalid name, name must not be empty')
];
exports.validateCreateAccount = [
    (0, express_validator_1.check)('accountName').notEmpty().escape().withMessage('Name is required'),
];
exports.validateUpdatePassword = [
    (0, express_validator_1.body)('password').escape().notEmpty().withMessage('Password cannot be empty'),
    (0, express_validator_1.body)('newPassword').isStrongPassword().escape().notEmpty().withMessage('New password cannot be empty'),
];
