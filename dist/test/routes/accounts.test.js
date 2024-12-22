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
const user_1 = __importDefault(require("../../src/models/user"));
const faker_1 = require("@faker-js/faker");
const src_1 = require("../../src");
const supertest_1 = __importDefault(require("supertest"));
const account_1 = __importDefault(require("../../src/models/account"));
let testUser1 = {
    email: faker_1.faker.internet.email().toLowerCase(),
    name: faker_1.faker.person.fullName(),
    password: faker_1.faker.internet.password(),
};
let testUser2 = {
    email: faker_1.faker.internet.email().toLowerCase(),
    name: faker_1.faker.person.fullName(),
    password: faker_1.faker.internet.password(),
};
let testAccount1 = {
    account_name: faker_1.faker.finance.accountName(),
};
let testAccount2 = {
    account_name: faker_1.faker.finance.accountName(),
};
let token1;
let token2;
const createAccountAndFundIt = (account, token) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, supertest_1.default)(src_1.app)
        .post("/api/account/create-account")
        .set("Authorization", token)
        .send({ accountName: account.account_name });
    account.id = res.body.account.id;
    account.account_number = res.body.account.account_number;
    account.balance = res.body.account.balance;
    account.user_id = res.body.account.user_id;
    const fundRes = yield (0, supertest_1.default)(src_1.app)
        .post("/api/account/fund-account")
        .set("Authorization", token)
        .send({ accountNumber: account.account_number, amount: 40000 });
    account.balance = fundRes.body.account.balance;
});
const deleteAccount = (id, token) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(src_1.app)
        .delete("/api/account/delete-account/" + id)
        .set("Authorization", token);
});
describe("Test for the account routes and their controllers", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const res1 = yield (0, supertest_1.default)(src_1.app).post("/api/auth/register").send(testUser1);
        token1 = res1.body.token;
        testUser1 = res1.body.user;
        const res2 = yield (0, supertest_1.default)(src_1.app).post("/api/auth/register").send(testUser2);
        token2 = res2.body.token;
        testUser2 = res2.body.user;
    }));
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        process.env.NODE_ENV = "test";
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.db)(user_1.default.getTableName).del();
        yield (0, db_1.db)(account_1.default.getTableName).del();
    }));
    describe("/POST create-account", () => {
        it("should create an account for testUser1", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/account/create-account")
                .set("Authorization", token1)
                .send({ accountName: testAccount1.account_name });
            (0, chai_1.expect)(res.status).to.eq(201);
            (0, chai_1.expect)(res.body.account.account_name).to.eq(testAccount1.account_name);
            (0, chai_1.expect)(res.body.account.balance).to.eq(0);
            (0, chai_1.expect)(res.body.account.user_id).to.eq(testUser1.id);
        }));
        it("should fail to to create account without auth token", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/account/create-account")
                .send({ accountName: testAccount1.account_name });
            (0, chai_1.expect)(res.status).to.eq(401);
            (0, chai_1.expect)(res.body.message).to.eq("Invalid token");
        }));
    });
    describe("/DELETE delete-account", () => {
        it("should create an account for testUser1 and delete it", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/account/create-account")
                .set("Authorization", token1)
                .send({ accountName: testAccount1.account_name });
            const id = res.body.account.id;
            const delRes = yield (0, supertest_1.default)(src_1.app)
                .delete("/api/account/delete-account/" + id)
                .set("Authorization", token1);
            (0, chai_1.expect)(delRes.status).to.eq(204);
        }));
        it("should fail to to delete account without auth token", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/account/create-account")
                .set("Authorization", token1)
                .send({ accountName: testAccount1.account_name });
            const id = res.body.account.id;
            const delRes = yield (0, supertest_1.default)(src_1.app).delete("/api/account/delete-account/" + id);
            (0, chai_1.expect)(delRes.status).to.eq(401);
            (0, chai_1.expect)(delRes.body.message).to.eq("Invalid token");
        }));
        it("should fail to to delete account with invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
            const delRes = yield (0, supertest_1.default)(src_1.app).delete("/api/account/delete-account/sfdfdd").set("Authorization", token1);
            (0, chai_1.expect)(delRes.body.message).to.eq("Invalid id");
            (0, chai_1.expect)(delRes.status).to.eq(422);
        }));
        it("should fail to to delete account with id that does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const delRes = yield (0, supertest_1.default)(src_1.app)
                .delete("/api/account/delete-account/10000")
                .set("Authorization", token1);
            (0, chai_1.expect)(delRes.body.message).to.eq("Account not found");
            (0, chai_1.expect)(delRes.status).to.eq(404);
        }));
    });
    describe("/POST fund-account", () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/account/create-account")
                .set("Authorization", token1)
                .send({ accountName: testAccount1.account_name });
            testAccount1.id = res.body.account.id;
            testAccount1.account_number = res.body.account.account_number;
            testAccount1.balance = res.body.account.balance;
            testAccount1.user_id = res.body.account.user_id;
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield deleteAccount(testAccount1.id, token1);
        }));
        it("should fund an account", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/account/fund-account")
                .set("Authorization", token1)
                .send({ accountNumber: testAccount1.account_number, amount: 40000 });
            (0, chai_1.expect)(res.body.message).to.equal("Account funded successfully");
            (0, chai_1.expect)(res.status).to.eq(201);
            (0, chai_1.expect)(res.body.account.balance).to.equal(testAccount1.balance + 40000);
            (0, chai_1.expect)(res.body.receipt.amount).to.equal(40000);
        }));
        it("should fail to fund account if account does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/account/fund-account")
                .set("Authorization", token1)
                .send({ accountNumber: "7465687789", amount: 40000 });
            (0, chai_1.expect)(res.status).to.eq(404);
            (0, chai_1.expect)(res.body.message).to.equal(`Account number ${"7465687789"} does not exist`);
        }));
    });
    describe("/POST withdraw", () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            // create and fund account
            yield createAccountAndFundIt(testAccount2, token2);
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield deleteAccount(testAccount2.id, token2);
        }));
        it("should withdraw funds from account", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/account/withdraw")
                .set("Authorization", token2)
                .send({ accountNumber: testAccount2.account_number, to: "0234537774", amount: 20000 });
            (0, chai_1.expect)(res.body.message).to.equal("Successfully withdrawn 20000");
            (0, chai_1.expect)(res.status).to.eq(200);
            (0, chai_1.expect)(res.body.account.balance).to.equal(testAccount2.balance - 20000);
            (0, chai_1.expect)(res.body.receipt.amount).to.equal(20000);
        }));
        it("should fail to withdraw if user does not own the account", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/account/withdraw")
                .set("Authorization", token1)
                .send({ accountNumber: testAccount2.account_number, amount: 20000 });
            (0, chai_1.expect)(res.body.message).to.equal("You do not own this account");
            (0, chai_1.expect)(res.status).to.eq(403);
        }));
        it("should fail to withdraw if there is not sufficient fund", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/account/withdraw")
                .set("Authorization", token2)
                .send({ accountNumber: testAccount2.account_number, to: "0234537774", amount: 80000 });
            (0, chai_1.expect)(res.body.message).to.equal("Insufficient funds");
            (0, chai_1.expect)(res.status).to.eq(402);
        }));
    });
    describe("/POST transfer", () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            // create and fund account
            yield createAccountAndFundIt(testAccount1, token1);
            yield createAccountAndFundIt(testAccount2, token2);
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield deleteAccount(testAccount1.id, token1);
            yield deleteAccount(testAccount2.id, token2);
        }));
        it("should transfer between accounts", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/account/transfer")
                .set("Authorization", token1)
                .send({
                accountNumber: testAccount1.account_number,
                to: testAccount2.account_number,
                amount: 2000,
            });
            (0, chai_1.expect)(res.status).to.eq(201);
            (0, chai_1.expect)(res.body.message).to.equal("Transfer successful");
            (0, chai_1.expect)(res.body.account.balance).to.equal(testAccount1.balance - 2000);
            (0, chai_1.expect)(res.body.receipt.amount).to.equal(2000);
        }));
        it("should fail to transfer due to insufficient funds", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/account/transfer")
                .set("Authorization", token1)
                .send({
                accountNumber: testAccount1.account_number,
                to: testAccount2.account_number,
                amount: 60000,
            });
            (0, chai_1.expect)(res.body.message).to.equal("Insufficient funds");
            (0, chai_1.expect)(res.status).to.eq(402);
        }));
        it("should fail to transfer if any of the account numbers does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/account/transfer")
                .set("Authorization", token1)
                .send({
                accountNumber: testAccount1.account_number,
                to: "7535468734",
                amount: 5000,
            });
            (0, chai_1.expect)(res.status).to.eq(404);
            (0, chai_1.expect)(res.body.message).to.equal(`Account number ${"7535468734"} does not exist`);
        }));
    });
    describe("/GET all-transactions", () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield createAccountAndFundIt(testAccount1, token1);
            yield createAccountAndFundIt(testAccount2, token2);
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield deleteAccount(testAccount1.id, token1);
            yield deleteAccount(testAccount2.id, token2);
        }));
        it("get all transactions made by an account", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .get("/api/account/all-transactions/" + testAccount1.account_number)
                .set("Authorization", token1);
            (0, chai_1.expect)(res.body.message).to.equal("Fetch successful");
            (0, chai_1.expect)(res.status).to.eq(200);
            (0, chai_1.assert)(res.body.transactions instanceof Array, "Transactions response is not an array");
            (0, chai_1.expect)(res.body.transactions.length).to.equal(1);
        }));
        it("should fail due to invalid account number", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .get("/api/account/all-transactions/777222356")
                .set("Authorization", token1);
            (0, chai_1.expect)(res.body.message).to.equal("Account number 777222356 is invalid");
            (0, chai_1.expect)(res.status).to.eq(422);
        }));
        it("should fail to if account number does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .get("/api/account/all-transactions/7772223565")
                .set("Authorization", token1);
            (0, chai_1.expect)(res.body.message).to.equal("Account number 7772223565 does not exist");
            (0, chai_1.expect)(res.status).to.eq(404);
        }));
    });
    // describe("/GET filter-transactions", () => {
    //   it("should get transaction based on the recipient", async () => {
    //     const res = await request(app)
    //       .get(
    //         `/api/account/filter-transactions/${testAccount1.account_number}?key=to?value=${testAccount1.account_number}`
    //       )
    //       .set("Authorization", token1);
    //     expect(res.status).to.eq(200);
    //     expect(res.body.message).to.equal("Name changed successfully");
    //     expect(res.body.user.name).to.equal("Adeyemi Adejumo");
    //   });
    //   it("should fail to if account number does not exist", async () => {
    //     const res = await request(app)
    //       .get("/api/account/filter-transactions/")
    //       .set("Authorization", token1);
    //     expect(res.body.message).to.equal("No account number found");
    //     expect(res.status).to.eq(422);
    //   });
    // });
});
