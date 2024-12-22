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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const account_1 = require("../service/account");
const transaction_1 = require("../service/transaction");
const utils_1 = require("../service/utils");
const express_validator_1 = require("express-validator");
class AccountController {
    static checkIfYouOwnAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountNumber = req.method === "GET" ? req.params.accountNumber : req.body.accountNumber;
            if (!accountNumber || accountNumber.trim() === "") {
                res.status(422).json({ message: "No account number found in the request" });
                return;
            }
            const { userId } = res.locals.userData;
            yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const check = yield (0, account_1.checkOwner)(userId, accountNumber);
                    if (check) {
                        resolve();
                        return next();
                    }
                    else {
                        reject("You do not own this account");
                        return res
                            .status(403)
                            .json({ message: "You do not own this account" });
                    }
                }
                catch (error) {
                    reject(error);
                    (0, utils_1.dealWithError)(error, res);
                }
            }));
        });
    }
    static getAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(422).json({ errors: errors.array() });
                return;
            }
            const { id } = req.params;
            const { userId } = res.locals.userData;
            let convId;
            convId = Number(id);
            if (Number.isNaN(convId)) {
                res.status(422).json({ message: "Invalid id" });
                return;
            }
            try {
                const check = yield (0, account_1.confirmAccountAndId)(convId, userId);
                if (!check) {
                    res.status(403).json({ message: "You do not own this account" });
                    return;
                }
                const account = (0, account_1.getAccountById)(convId);
                res.status(200).json({ message: "Fetch successful", account });
            }
            catch (error) {
                (0, utils_1.dealWithError)(error, res);
            }
        });
    }
    static deleteAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(422).json({ errors: errors.array() });
                return;
            }
            const { id } = req.params;
            const { userId } = res.locals.userData;
            let convId; //converted id
            convId = Number(id);
            if (Number.isNaN(convId)) {
                res.status(422).json({ message: "Invalid id" });
                return;
            }
            try {
                const check = yield (0, account_1.confirmAccountAndId)(convId, userId);
                if (!check) {
                    res.status(403).json({ message: "You do not own this account" });
                    return;
                }
                const response = yield (0, account_1.deleteAccountById)(convId);
                if (response === "success")
                    res.status(204).json({ message: "Delete successful" });
                else
                    res.status(404).json({ message: "Account not found" });
            }
            catch (error) {
                (0, utils_1.dealWithError)(error, res);
            }
        });
    }
    static createAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(422).json({ errors: errors.array() });
                return;
            }
            const { accountName } = req.body;
            try {
                const { userId, } = res.locals.userData;
                const account = yield (0, account_1.createWalletAccount)(userId, accountName);
                res
                    .status(201)
                    .json({ message: "Account created successfully", account });
            }
            catch (error) {
                (0, utils_1.dealWithError)(error, res);
            }
        });
    }
    static fundAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(422).json({ errors: errors.array() });
                return;
            }
            const { amount, accountNumber } = req.body;
            try {
                const { account, receipt } = yield (0, account_1.addMoneyToAccount)(amount, accountNumber);
                res
                    .status(201)
                    .json({ message: "Account funded successfully", account, receipt });
            }
            catch (error) {
                (0, utils_1.dealWithError)(error, res);
            }
        });
    }
    static transferFunds(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(422).json({ errors: errors.array() });
                return;
            }
            const { accountNumber, to, amount } = req.body;
            try {
                const { account, receipt } = yield (0, account_1.transferBetweenAccounts)(accountNumber, to, amount);
                res
                    .status(201)
                    .json({ message: "Transfer successful", account, receipt });
            }
            catch (error) {
                (0, utils_1.dealWithError)(error, res);
            }
        });
    }
    static withdrawFunds(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(422).json({ errors: errors.array() });
                return;
            }
            const { accountNumber, to, amount } = req.body;
            try {
                const { account, receipt } = yield (0, account_1.withdrawFundsFromAccount)(accountNumber, to, amount);
                res.status(200).json({
                    message: "Successfully withdrawn " + amount,
                    account,
                    receipt,
                });
            }
            catch (error) {
                (0, utils_1.dealWithError)(error, res);
            }
        });
    }
    static getTransactions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(422).json({ errors: errors.array() });
                return;
            }
            const { accountNumber } = req.params;
            try {
                const transactions = yield (0, transaction_1.getAllTransactions)(accountNumber);
                res.status(200).json({ message: "Fetch successful", transactions });
            }
            catch (error) {
                (0, utils_1.dealWithError)(error, res);
            }
        });
    }
    static filterTransactions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(422).json({ errors: errors.array() });
                return;
            }
            const { accountNumber } = req.params;
            const { key, value } = req.query;
            if (!key || !value) {
                res.status(400).json({ message: "Key and value must be present" });
                return;
            }
            try {
                const transactions = yield (0, transaction_1.filterAllTransactionsByAccountNumber)(key, value, accountNumber);
                res.status(200).json({ message: "Fetch successful", transactions });
            }
            catch (error) {
                (0, utils_1.dealWithError)(error, res);
            }
        });
    }
}
exports.AccountController = AccountController;
