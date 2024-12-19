import { expect } from "chai";
import { db } from "../../src/db";
import { Account, User } from "../../src/types";
import { faker } from "@faker-js/faker";
import AccountModel from "../../src/models/account";
import UserModel from "../../src/models/user";

const testAccount: Omit<Account, "id"> = {
  account_name: faker.finance.accountName(),
  account_number: faker.finance.accountNumber(10),
  balance: Number(faker.finance.amount()),
  user_id: 1,
};

const testUser: Omit<User, "id"> = {
  email: faker.internet.email().toLowerCase(),
  name: faker.person.fullName(),
  password: "test_password",
};

describe("Account Model", () => {
  before(async () => {
    process.env.NODE_ENV = "test";
    await db.migrate.latest();
  });

  beforeEach(async () => {
    const { id: user_id } = await UserModel.insert<typeof testUser>(testUser);
    testAccount.user_id = user_id;
  });

  afterEach(async () => {
    await db(AccountModel.getTableName).del();
    await db(UserModel.getTableName).del();
  });

  after(async () => {
    await db.migrate.rollback();
  });

  it("should insert and retrieve an account", async () => {
    await AccountModel.insert<typeof testAccount>(testAccount);
    const allResults = await AccountModel.findAll<Account>();

    expect(allResults.length).to.equal(1);
    expect(allResults[0].account_number).to.equal(testAccount.account_number);
  });

  it("should insert user and retrieve by account number", async () => {
    const { id } = await AccountModel.insert<typeof testAccount>(testAccount);
    const result = await AccountModel.findOneById<Account>(id);
    expect(result.account_number).to.equal(testAccount.account_number);
  });
});
