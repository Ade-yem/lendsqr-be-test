"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function (o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o)
                if (Object.prototype.hasOwnProperty.call(o, k))
                    ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k = ownKeys(mod), i = 0; i < k.length; i++)
                if (k[i] !== "default")
                    __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const user_1 = __importDefault(require("../models/user"));
const bcrypt = __importStar(require("bcryptjs"));
const customError_1 = __importDefault(require("../types/customError"));
(0, dotenv_1.config)();
const register = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = data;
    const existingUser = yield user_1.default.findByEmail(email);
    if (existingUser)
        throw new customError_1.default(409, "User already exists");
    const userData = {
        email,
        password: bcrypt.hashSync(password, 10),
        name,
    };
    const user = (yield user_1.default.create(userData));
    return user;
});
exports.register = register;
const login = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = data;
    const user = yield user_1.default.findByEmail(email);
    if (!user)
        throw new customError_1.default(401, "User with email not found");
    const comparison = bcrypt.compareSync(password, user.password);
    if (!comparison)
        throw new customError_1.default(401, "Invalid password");
    return user;
});
exports.login = login;
const secret = process.env.jwt_SECRET;
const expiration = process.env.jwt_EXPIRES_IN;
const createToken = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign(data, secret, {
        expiresIn: expiration,
    });
    return token;
});
exports.createToken = createToken;
