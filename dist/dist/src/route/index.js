"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRouter_1 = __importDefault(require("./authRouter"));
const userRouter_1 = __importDefault(require("./userRouter"));
const accountRouter_1 = __importDefault(require("./accountRouter"));
const mainRouter = (0, express_1.Router)();
mainRouter.use("/auth", authRouter_1.default);
mainRouter.use("/user", userRouter_1.default);
mainRouter.use("/account", accountRouter_1.default);
exports.default = mainRouter;
