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
const testUser = {
    email: faker_1.faker.internet.email().toLowerCase(),
    name: faker_1.faker.person.fullName(),
    password: faker_1.faker.internet.password(),
};
let token;
describe("Test for the user routes and their controllers", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(src_1.app).post("/api/auth/register").send(testUser);
        token = res.body.token;
    }));
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        process.env.NODE_ENV = "test";
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.db)(user_1.default.getTableName).del();
    }));
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        // console.log("Thank you for seeing it through");
        // console.log("Closing down...");
        // process.exit(1);
    }));
    describe("/GET get-user", () => {
        it("should get user", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .get("/api/user/get-user")
                .set("Authorization", token);
            (0, chai_1.expect)(res.status).to.eq(201);
            (0, chai_1.expect)(res.body.user.name).to.eq(testUser.name);
            (0, chai_1.expect)(res.body.message).to.eq("Fetch successful");
        }));
        it("should fail to to get user", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app).get("/api/user/get-user");
            (0, chai_1.expect)(res.status).to.eq(401);
            (0, chai_1.expect)(res.body.message).to.eq("Invalid token");
        }));
    });
    describe("/POST change-name", () => {
        it("should change the name of user", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/user/change-name")
                .set("Authorization", token)
                .send({ name: "Adeyemi Adejumo" });
            // expect(res.status).to.eq(201);
            (0, chai_1.expect)(res.body.message).to.equal("Name changed successfully");
            (0, chai_1.expect)(res.body.user.name).to.equal("Adeyemi Adejumo");
        }));
        it("should fail to change the name of user", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/user/change-name")
                .send({ name: "Adeyemi Adejumo" });
            (0, chai_1.expect)(res.status).to.eq(401);
            (0, chai_1.expect)(res.body.message).to.equal("Invalid token");
        }));
    });
    describe("/POST change-password", () => {
        it("should change the password of user", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/user/change-password")
                .set("Authorization", token)
                .send({ password: testUser.password, newPassword: "vyufiutxdypoup" });
            (0, chai_1.expect)(res.status).to.eq(201);
            (0, chai_1.expect)(res.body.message).to.equal("Password change successful");
        }));
        it("should fail to change the password of user", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/user/change-password")
                .set("Authorization", token)
                .send({ password: "testUser.password", newPassword: "vyufiutxdypoup" });
            (0, chai_1.expect)(res.body.message).to.equal("Incorrect password");
            (0, chai_1.expect)(res.status).to.eq(403);
        }));
    });
});
