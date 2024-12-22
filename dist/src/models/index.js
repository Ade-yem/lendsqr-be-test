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
exports.Model = void 0;
const db_1 = require("../db");
class Model {
    static get table() {
        if (!this.tableName) {
            throw new Error("Table name not defined");
        }
        return (0, db_1.db)(this.tableName);
    }
    static get getTableName() {
        return this.tableName;
    }
    static insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.table.insert(data);
            return { id };
        });
    }
    static deleteOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.table.where({ id }).delete();
        });
    }
    static findOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.table.where("id", id).select("*").first();
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.table.select("*");
        });
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.table.insert(data);
            return yield this.findOneById(id);
        });
    }
    static updateOneById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.table.where({ id }).update(data);
            return yield this.findOneById(id);
        });
    }
}
exports.Model = Model;
