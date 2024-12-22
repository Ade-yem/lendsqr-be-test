"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../service/auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requests_1 = require("../service/requests");
const utils_1 = require("../service/utils");
const express_validator_1 = require("express-validator");
const secret = process.env.jwt_SECRET;
class AuthController {
    static loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(422).json({ errors: errors.array() });
                return;
            }
            const { email, password } = req.body;
            try {
                const user = yield (0, auth_1.login)({ email, password });
                const token = yield (0, auth_1.createToken)({ email, userId: user.id });
                res.status(200).json({ message: "Login successful", user, token });
            }
            catch (error) {
                (0, utils_1.dealWithError)(error, res);
            }
        });
    }
    static registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(422).json({ errors: errors.array() });
                return;
            }
            const { email, password, name } = req.body;
            try {
                const response = yield (0, requests_1.makeKarmaRequest)(email);
                if (response.status === "success" &&
                    response.message === "Successful" &&
                    response.data.karma_identity) {
                    res.status(403).json({ message: "You have been blacklisted" });
                    return;
                }
                const user = yield (0, auth_1.register)({ email, password, name });
                const token = yield (0, auth_1.createToken)({ email, userId: user.id });
                res.status(201).json({ message: "Login successful", user, token });
            }
            catch (error) {
                (0, utils_1.dealWithError)(error, res);
            }
        });
    }
    // middleware
    static verifyToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers.authorization;
            if (!token || token.trim() === "") {
                res.status(401).json({ message: "Invalid token" });
                return;
            }
            yield new Promise((resolve, reject) => {
                return jsonwebtoken_1.default.verify(token, secret, (err, success) => {
                    if (err) {
                        reject(err);
                        return res.status(401).json({ message: "Token expired" });
                    }
                    else {
                        resolve();
                        res.locals.userData = success;
                        return next();
                    }
                });
            });
        });
    }
}
exports.default = AuthController;
