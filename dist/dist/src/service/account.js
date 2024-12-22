"use strict";
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
exports.withdrawFundsFromAccount = exports.transferBetweenAccounts = exports.addMoneyToAccount = exports.deleteAccountById = exports.createWalletAccount = exports.confirmAccountAndId = exports.getAccountById = exports.checkOwner = void 0;
const account_1 = __importDefault(require("../models/account"));
const customError_1 = __importDefault(require("../types/customError"));
const transaction_1 = require("./transaction");
const utils_1 = require("./utils");
const getAccount = (accountNumber) => __awaiter(void 0, void 0, void 0, function* () {
    if (accountNumber.length !== 10)
        throw new customError_1.default(422, `Account number ${accountNumber} is invalid`);
    const account = yield account_1.default.findByAccountNumber(accountNumber);
    if (!account)
        throw new customError_1.default(404, `Account number ${accountNumber} does not exist`);
    return account;
});
const checkOwner = (userId, accountNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield getAccount(accountNumber);
    if (account.user_id === userId)
        return true;
    else
        return false;
});
exports.checkOwner = checkOwner;
const getAccountById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield account_1.default.findOneById(id);
    if (!account)
        throw new customError_1.default(404, "Account not found");
    return account;
});
exports.getAccountById = getAccountById;
const confirmAccountAndId = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield (0, exports.getAccountById)(id);
    return account.user_id === userId;
});
exports.confirmAccountAndId = confirmAccountAndId;
const createWalletAccount = (userId, accountName) => __awaiter(void 0, void 0, void 0, function* () {
    const accountData = {
        account_name: accountName,
        account_number: (0, utils_1.generateAccountNumber)(),
        balance: 0,
        user_id: userId,
    };
    const account = yield account_1.default.create(accountData);
    if (!account)
        throw new customError_1.default(500, "Unable to create Account");
    return account;
});
exports.createWalletAccount = createWalletAccount;
const deleteAccountById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield account_1.default.deleteOneById(id);
    if (count)
        return "success";
});
exports.deleteAccountById = deleteAccountById;
const addMoneyToAccount = (amount, accountNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield getAccount(accountNumber);
    const updated = yield account_1.default.updateOneById(account.id, {
        balance: account.balance + amount,
    });
    const receipt = yield (0, transaction_1.createTransaction)({
        type: "credit",
        from: "external",
        to: accountNumber,
        amount,
    });
    if (!updated)
        throw new customError_1.default(500, "Unable to update Account");
    return { account: updated, receipt };
});
exports.addMoneyToAccount = addMoneyToAccount;
const transferBetweenAccounts = (from, to, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const sender = yield getAccount(from);
    if (sender.balance < amount)
        throw new customError_1.default(402, "Insufficient funds");
    const recipient = yield getAccount(to);
    const updatedSender = yield account_1.default.updateOneById(sender.id, {
        balance: sender.balance - amount,
    });
    yield account_1.default.updateOneById(recipient.id, {
        balance: recipient.balance + amount,
    });
    const receipt = yield (0, transaction_1.createTransaction)({
        type: "transfer",
        from,
        to,
        amount,
    });
    return { account: updatedSender, receipt };
});
exports.transferBetweenAccounts = transferBetweenAccounts;
const withdrawFundsFromAccount = (accountNumber, to, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield getAccount(accountNumber);
    if (account.balance < amount)
        throw new customError_1.default(402, "Insufficient funds");
    const updatedAccount = yield account_1.default.updateOneById(account.id, {
        balance: account.balance - amount,
    });
    // funds withdrawn and sent to the <to> account number
    const receipt = yield (0, transaction_1.createTransaction)({
        type: "withdrawal",
        from: accountNumber,
        to,
        amount,
    });
    return { account: updatedAccount, receipt };
});
exports.withdrawFundsFromAccount = withdrawFundsFromAccount;
