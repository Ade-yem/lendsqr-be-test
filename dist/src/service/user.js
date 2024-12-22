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
exports.changePassword = exports.changeName = exports.getUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const customError_1 = __importDefault(require("../types/customError"));
const getUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findByEmail(email);
    if (!user)
        throw new customError_1.default(404, "User not found");
    return user;
});
exports.getUser = getUser;
const changeName = (name, id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.updateOneById(id, { name });
    if (!user)
        throw new customError_1.default(500, "Could not update user");
    return user;
});
exports.changeName = changeName;
const changePassword = (id, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.updateOneById(id, { password });
    if (!user)
        throw new customError_1.default(500, "Could not update user");
    return user;
});
exports.changePassword = changePassword;