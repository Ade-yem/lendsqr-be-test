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
const chai_1 = require("chai");
const db_1 = require("../../src/db");
const models_1 = require("../../src/models");
const testTable = "test_table";
class TestModel extends models_1.Model {
}
TestModel.tableName = testTable;
describe("Base Model", () => {
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        process.env.NODE_ENV = "test";
        yield db_1.db.schema.createTable(testTable, (table) => {
            table.increments("id").primary();
            table.string("name");
            table.string("class");
        });
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.db)(testTable).truncate();
    }));
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.schema.dropTable(testTable);
    }));
    it("should insert multiple rows", () => __awaiter(void 0, void 0, void 0, function* () {
        yield TestModel.insert({ name: "Adeyemi", class: "jss2" });
        yield TestModel.insert({ name: "Adeyemi", class: "jss2" });
        yield TestModel.insert({ name: "Adeyemi", class: "jss2" });
        yield TestModel.insert({ name: "Adeyemi", class: "jss2" });
        const results = yield TestModel.findAll();
        (0, chai_1.expect)(results.length).to.eq(4);
    }));
    it("should insert a row and check for it", () => __awaiter(void 0, void 0, void 0, function* () {
        yield TestModel.insert({ name: "Adeyemi", class: "jss2" });
        const results = yield TestModel.findAll();
        (0, chai_1.expect)(results.length).to.eq(1);
        (0, chai_1.expect)(results[0].name).to.eq("Adeyemi");
    }));
    it("should insert a row and fetch it by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = yield TestModel.insert({
            name: "TestName", class: "jss2"
        });
        const result = yield TestModel.findOneById(id);
        (0, chai_1.expect)(result.name).to.equal("TestName");
    }));
    it("should create a row and return it", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield TestModel.create({
            name: "TestName", class: "jss2"
        });
        (0, chai_1.expect)(result === null || result === void 0 ? void 0 : result.name).to.equal("TestName");
    }));
    it("should insert a row and update it", () => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = yield TestModel.insert({
            name: "TestName", class: "jss2"
        });
        const result = yield TestModel.updateOneById(id, {
            name: "Adeyemi",
        });
        (0, chai_1.expect)(result.name).to.equal("Adeyemi");
    }));
    it("should insert a row and delete it by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = yield TestModel.insert({
            name: "TestName", class: "jss2"
        });
        const result = yield TestModel.deleteOneById(id);
        (0, chai_1.expect)(result).to.equal(1);
    }));
});
