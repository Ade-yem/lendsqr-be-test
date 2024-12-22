"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealWithError = exports.generateAccountNumber = void 0;
const customError_1 = __importDefault(require("../types/customError"));
const generateAccountNumber = () => "7" + Math.floor(100000000 + Math.random() * 900000000).toString();
exports.generateAccountNumber = generateAccountNumber;
const dealWithError = (error, res) => {
    if (error instanceof customError_1.default) {
        res.status(error.code).json({ message: error.message });
    }
    else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
    }
};
exports.dealWithError = dealWithError;
