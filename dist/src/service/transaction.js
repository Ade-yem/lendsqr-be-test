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
exports.filterAllTransactionsByAccountNumber = exports.getAllTransactions = exports.createTransaction = void 0;
const transactions_1 = __importDefault(require("../models/transactions"));
const customError_1 = __importDefault(require("../types/customError"));
const createTransaction = (transactionData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transactions_1.default.create(transactionData);
    if (!result)
        throw new customError_1.default(500, "Could not create transaction");
    return result;
});
exports.createTransaction = createTransaction;
const getAllTransactions = (accountNumber) => __awaiter(void 0, void 0, void 0, function* () {
    return yield transactions_1.default.findAllByAccountNumber(accountNumber);
});
exports.getAllTransactions = getAllTransactions;
const filterAllTransactionsByAccountNumber = (key, value, accountNumber) => __awaiter(void 0, void 0, void 0, function* () {
    return yield transactions_1.default.findByKeyValueAndAccountNumber(key, value, accountNumber);
});
exports.filterAllTransactionsByAccountNumber = filterAllTransactionsByAccountNumber;
