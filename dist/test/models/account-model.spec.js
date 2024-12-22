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
const chai_1 = require("chai");
const db_1 = require("../../src/db");
const faker_1 = require("@faker-js/faker");
const account_1 = __importDefault(require("../../src/models/account"));
const user_1 = __importDefault(require("../../src/models/user"));
const testAccount = {
    account_name: faker_1.faker.finance.accountName(),
    account_number: faker_1.faker.finance.accountNumber(10),
    balance: Number(faker_1.faker.finance.amount()),
    user_id: 1,
};
const testUser = {
    email: faker_1.faker.internet.email().toLowerCase(),
    name: faker_1.faker.person.fullName(),
    password: "test_password",
};
describe("Account Model", () => {
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Welcome to the test cases of Demo Credit");
        process.env.NODE_ENV = "test";
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const { id: user_id } = yield user_1.default.insert(testUser);
        testAccount.user_id = user_id;
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.db)(account_1.default.getTableName).del();
        yield (0, db_1.db)(user_1.default.getTableName).del();
    }));
    after(() => __awaiter(void 0, void 0, void 0, function* () { }));
    it("should insert and retrieve an account", () => __awaiter(void 0, void 0, void 0, function* () {
        yield account_1.default.insert(testAccount);
        const allResults = yield account_1.default.findAll();
        (0, chai_1.expect)(allResults.length).to.equal(1);
        (0, chai_1.expect)(allResults[0].account_number).to.equal(testAccount.account_number);
    }));
    it("should insert an account and retrieve by account number", () => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = yield account_1.default.insert(testAccount);
        const result = yield account_1.default.findOneById(id);
        (0, chai_1.expect)(result.account_number).to.equal(testAccount.account_number);
    }));
    it("should create an account and update the balance", () => __awaiter(void 0, void 0, void 0, function* () {
        const account = yield account_1.default.create(testAccount);
        (0, chai_1.assert)(account);
        const result = yield account_1.default.updateOneById(account.id, Object.assign(Object.assign({}, account), { balance: 2000 }));
        (0, chai_1.expect)(result.account_number).to.equal(testAccount.account_number);
        (0, chai_1.expect)(result.balance).to.equal(2000);
    }));
});
