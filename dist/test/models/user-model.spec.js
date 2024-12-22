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
const testUser = {
    email: faker_1.faker.internet.email().toLowerCase(),
    name: faker_1.faker.person.fullName(),
    password: "test_password",
};
describe("User Model", () => {
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        process.env.NODE_ENV = "test";
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.db)(user_1.default.getTableName).del();
    }));
    after(() => __awaiter(void 0, void 0, void 0, function* () {
    }));
    it("should insert and retrieve user", () => __awaiter(void 0, void 0, void 0, function* () {
        yield user_1.default.insert(testUser);
        const allResults = yield user_1.default.findAll();
        (0, chai_1.expect)(allResults.length).to.equal(1);
        (0, chai_1.expect)(allResults[0].name).to.equal(testUser.name);
    }));
    it("should insert user and retrieve by email", () => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = yield user_1.default.insert(testUser);
        const result = yield user_1.default.findOneById(id);
        (0, chai_1.expect)(result.name).to.equal(testUser.name);
    }));
    it("should create a user and update it", () => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = yield user_1.default.insert(testUser);
        const result = yield user_1.default.updateOneById(id, { name: "Adeyemi Adejumo" });
        (0, chai_1.expect)(result.name).to.equal("Adeyemi Adejumo");
    }));
});
