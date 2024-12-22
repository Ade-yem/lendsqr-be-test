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
exports.seed = seed;
const faker_1 = require("@faker-js/faker");
const tableName = "accounts";
function seed(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex(tableName).del();
        const usersIds = yield knex("accounts").select("id");
        const accounts = [];
        usersIds.forEach(({ id: account_id }) => {
            const randomAmount = Math.floor(Math.random() * 10) + 1;
            for (let i = 0; i < randomAmount; i++) {
                accounts.push({
                    type: faker_1.faker.finance.transactionType(),
                    amount: Number(faker_1.faker.finance.amount()),
                    to: faker_1.faker.finance.accountNumber(),
                    from: faker_1.faker.finance.accountNumber(),
                    account_id,
                });
            }
        });
        yield knex(tableName).insert(accounts);
    });
}
