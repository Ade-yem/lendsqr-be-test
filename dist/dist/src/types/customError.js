"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
exports.default = CustomError;
