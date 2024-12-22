"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegisterUser = exports.validateLoginUser = void 0;
const express_validator_1 = require("express-validator");
exports.validateLoginUser = [
    (0, express_validator_1.check)('email').isEmail().withMessage('Invalid email'),
    (0, express_validator_1.check)('password').notEmpty().withMessage('Password is required')
];
exports.validateRegisterUser = [
    (0, express_validator_1.check)('email').isEmail().withMessage('Invalid email'),
    (0, express_validator_1.check)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.check)('name').notEmpty().withMessage('Name is required')
];
