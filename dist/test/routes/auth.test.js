"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const bcrypt = __importStar(require("bcryptjs"));
const testUser = {
    email: faker_1.faker.internet.email().toLowerCase(),
    name: faker_1.faker.person.fullName(),
    password: faker_1.faker.internet.password(),
};
const testPasswordHash = bcrypt.hashSync(testUser.password, 10);
describe("Test for the authentication routes and their controllers", () => {
    describe("/POST register", () => {
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            process.env.NODE_ENV = "test";
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, db_1.db)(user_1.default.getTableName).del();
        }));
        after(() => __awaiter(void 0, void 0, void 0, function* () { }));
        it("should register user", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app).post("/api/auth/register").send(testUser);
            (0, chai_1.expect)(res.status).to.eq(201);
            (0, chai_1.expect)(res.body.user.name).to.eq(testUser.name);
        }));
        it("should fail to register repeat user", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(src_1.app).post("/api/auth/register").send(testUser);
            const res = yield (0, supertest_1.default)(src_1.app).post("/api/auth/register").send(testUser);
            (0, chai_1.expect)(res.status).to.eq(409);
        }));
    });
    describe("/POST login", () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield user_1.default.create(Object.assign(Object.assign({}, testUser), { password: testPasswordHash }));
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, db_1.db)(user_1.default.getTableName).del();
        }));
        it("should login a user", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/auth/login")
                .send({ email: testUser.email, password: testUser.password });
            (0, chai_1.expect)(res.body.message).to.equal("Login successful");
            (0, chai_1.expect)(res.body.user.name).to.equal(testUser.name);
            (0, chai_1.expect)(res.status).to.eq(200);
        }));
        it("should reject invalid password", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/auth/login")
                .send({ email: testUser.email, password: "testUser.password" });
            (0, chai_1.expect)(res.status).to.eq(401);
            (0, chai_1.expect)(res.body.message).to.eq("Invalid password");
        }));
        it("should reject invalid email", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(src_1.app)
                .post("/api/auth/login")
                .send({ email: "adejumo@test.com", password: testUser.password });
            (0, chai_1.expect)(res.status).to.eq(401);
            (0, chai_1.expect)(res.body.message).to.eq("User with email not found");
        }));
    });
});
