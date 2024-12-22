"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const userController_1 = __importDefault(require("../controllers/userController"));
const userRouter = (0, express_1.Router)();
userRouter.get("/get-user", authController_1.default.verifyToken, userController_1.default.getUserData);
userRouter.post("/change-name", authController_1.default.verifyToken, userController_1.default.updateName);
userRouter.post("/change-password", authController_1.default.verifyToken, userController_1.default.updatePassword);
exports.default = userRouter;
