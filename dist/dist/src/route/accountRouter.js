"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accountController_1 = require("../controllers/accountController");
const authController_1 = __importDefault(require("../controllers/authController"));
const accountRouter = (0, express_1.Router)();
accountRouter.get("/get-account/:id", authController_1.default.verifyToken, accountController_1.AccountController.getAccount);
accountRouter.delete("/delete-account/:id", authController_1.default.verifyToken, accountController_1.AccountController.deleteAccount);
accountRouter.post("/create-account", authController_1.default.verifyToken, accountController_1.AccountController.createAccount);
accountRouter.post("/fund-account", authController_1.default.verifyToken, accountController_1.AccountController.fundAccount);
accountRouter.post("/withdraw", authController_1.default.verifyToken, accountController_1.AccountController.checkIfYouOwnAccount, accountController_1.AccountController.withdrawFunds);
accountRouter.post("/transfer", authController_1.default.verifyToken, accountController_1.AccountController.checkIfYouOwnAccount, accountController_1.AccountController.transferFunds);
accountRouter.get("/all-transactions/:accountNumber", authController_1.default.verifyToken, accountController_1.AccountController.checkIfYouOwnAccount, accountController_1.AccountController.getTransactions);
accountRouter.get("/filter-transactions/:accountNumber", authController_1.default.verifyToken, accountController_1.AccountController.checkIfYouOwnAccount, accountController_1.AccountController.filterTransactions);
exports.default = accountRouter;
