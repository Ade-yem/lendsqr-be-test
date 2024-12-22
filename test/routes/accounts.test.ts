import { assert, expect } from "chai";
import { db } from "../../src/db";
import UserModel from "../../src/models/user";
import { Account, User } from "../../src/types";
import { faker } from "@faker-js/faker";
import { app } from "../../src";
import request from "supertest";
import AccountModel from "../../src/models/account";

let testUser1: Partial<User> = {
  email: faker.internet.email().toLowerCase(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
};
let testUser2: Partial<User> = {
  email: faker.internet.email().toLowerCase(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
};

let testAccount1: Partial<Account> = {
  account_name: faker.finance.accountName(),
};

let testAccount2: Partial<Account> = {
  account_name: faker.finance.accountName(),
};

let token1: string;
let token2: string;

const createAccountAndFundIt = async (
  account: Partial<Account>,
  token: string
) => {
  const res = await request(app)
    .post("/api/account/create-account")
    .set("Authorization", token)
    .send({ accountName: account.account_name });
  account.id = res.body.account.id;
  account.account_number = res.body.account.account_number;
  account.balance = res.body.account.balance;
  account.user_id = res.body.account.user_id;

  const fundRes = await request(app)
    .post("/api/account/fund-account")
    .set("Authorization", token)
    .send({ accountNumber: account.account_number, amount: 40000 });
  account.balance = fundRes.body.account.balance;
};

const deleteAccount = async (id: number, token: string) => {
  await request(app)
    .delete("/api/account/delete-account/" + id)
    .set("Authorization", token);
};
describe("Test for the account routes and their controllers", () => {
  beforeEach(async () => {
    const res1 = await request(app).post("/api/auth/register").send(testUser1);
    token1 = res1.body.token;
    testUser1 = res1.body.user;
    const res2 = await request(app).post("/api/auth/register").send(testUser2);
    token2 = res2.body.token;
    testUser2 = res2.body.user;
  });

  before(async () => {
    process.env.NODE_ENV = "test";
  });

  afterEach(async () => {
    await db(UserModel.getTableName).del();
    await db(AccountModel.getTableName).del();
  });

  describe("/POST create-account", () => {
    it("should create an account for testUser1", async () => {
      const res = await request(app)
        .post("/api/account/create-account")
        .set("Authorization", token1)
        .send({ accountName: testAccount1.account_name });
      expect(res.status).to.eq(201);
      expect(res.body.account.account_name).to.eq(testAccount1.account_name);
      expect(res.body.account.balance).to.eq(0);
      expect(res.body.account.user_id).to.eq(testUser1.id);
    });

    it("should fail to to create account without auth token", async () => {
      const res = await request(app)
        .post("/api/account/create-account")
        .send({accountName: testAccount1.account_name});
      expect(res.status).to.eq(401);
      expect(res.body.message).to.eq("Invalid token");
    });
  });

  describe("/DELETE delete-account", () => {
    it("should create an account for testUser1 and delete it", async () => {
      const res = await request(app)
        .post("/api/account/create-account")
        .set("Authorization", token1)
        .send({accountName: testAccount1.account_name});
      const id = res.body.account.id;
      const delRes = await request(app)
        .delete("/api/account/delete-account/" + id)
        .set("Authorization", token1);
        expect(delRes.status).to.eq(204);
    });

    it("should fail to to delete account without auth token", async () => {
      const res = await request(app)
        .post("/api/account/create-account")
        .set("Authorization", token1)
        .send({accountName: testAccount1.account_name});
      const id = res.body.account.id;
      const delRes = await request(app).delete(
        "/api/account/delete-account/" + id
      );
      expect(delRes.status).to.eq(401);
      expect(delRes.body.message).to.eq("Invalid token");
    });
    it("should fail to to delete account with invalid id", async () => {
      const delRes = await request(app).delete(
        "/api/account/delete-account/sfdfdd"
      ).set("Authorization", token1);
      expect(delRes.body.message).to.eq("Invalid id");
      expect(delRes.status).to.eq(422);
    });
    it("should fail to to delete account with id that does not exist", async () => {
      const delRes = await request(app)
        .delete("/api/account/delete-account/10000")
        .set("Authorization", token1);
        expect(delRes.body.message).to.eq("Account not found");
      expect(delRes.status).to.eq(404);
    });
  });

  describe("/POST fund-account", () => {
    beforeEach(async () => {
      const res = await request(app)
        .post("/api/account/create-account")
        .set("Authorization", token1)
        .send({accountName: testAccount1.account_name});
      testAccount1.id = res.body.account.id;
      testAccount1.account_number = res.body.account.account_number;
      testAccount1.balance = res.body.account.balance;
      testAccount1.user_id = res.body.account.user_id;
    });

    afterEach(async () => {
      await deleteAccount(testAccount1.id as number, token1);
    });

    it("should fund an account", async () => {
      const res = await request(app)
        .post("/api/account/fund-account")
        .set("Authorization", token1)
        .send({ accountNumber: testAccount1.account_number, amount: 40000 });
        expect(res.body.message).to.equal("Account funded successfully");
      expect(res.status).to.eq(200);
      expect(res.body.account.balance).to.equal(
        (testAccount1.balance as number) + 40000
      );
      expect(res.body.receipt.amount).to.equal(40000);
    });

    it("should fail to fund account if account does not exist", async () => {
      const res = await request(app)
        .post("/api/account/fund-account")
        .set("Authorization", token1)
        .send({ accountNumber: "7465687789", amount: 40000 });
      expect(res.status).to.eq(404);
      expect(res.body.message).to.equal(
        `Account number ${"7465687789"} does not exist`
      );
    });
  });

  describe("/POST withdraw", () => {
    beforeEach(async () => {
      // create and fund account
      await createAccountAndFundIt(testAccount2, token2);
    });

    afterEach(async () => {
      await deleteAccount(testAccount2.id as number, token2);
    });

    it("should withdraw funds from account", async () => {
      const res = await request(app)
        .post("/api/account/withdraw")
        .set("Authorization", token2)
        .send({ accountNumber: testAccount2.account_number, to: "0234537774", amount: 20000 });
        expect(res.body.message).to.equal("Successfully withdrawn 20000");
      expect(res.status).to.eq(200);
      expect(res.body.account.balance).to.equal(
        (testAccount2.balance as number) - 20000
      );
      expect(res.body.receipt.amount).to.equal(20000);
    });
    it("should fail to withdraw if user does not own the account", async () => {
      const res = await request(app)
        .post("/api/account/withdraw")
        .set("Authorization", token1)
        .send({ accountNumber: testAccount2.account_number, amount: 20000 });
      expect(res.body.message).to.equal("You do not own this account");
      expect(res.status).to.eq(403);
    });
    it("should fail to withdraw if there is not sufficient fund", async () => {
      const res = await request(app)
        .post("/api/account/withdraw")
        .set("Authorization", token2)
        .send({ accountNumber: testAccount2.account_number, to: "0234537774", amount: 80000 });
        expect(res.body.message).to.equal("Insufficient funds");
      expect(res.status).to.eq(402);
    });
  });

  describe("/POST transfer", () => {
    beforeEach(async () => {
      // create and fund account
      await createAccountAndFundIt(testAccount1, token1);
      await createAccountAndFundIt(testAccount2, token2);
    });

    afterEach(async () => {
      await deleteAccount(testAccount1.id as number, token1);
      await deleteAccount(testAccount2.id as number, token2);
    });

    it("should transfer between accounts", async () => {
      const res = await request(app)
        .post("/api/account/transfer")
        .set("Authorization", token1)
        .send({
          accountNumber: testAccount1.account_number,
          to: testAccount2.account_number,
          amount: 2000,
        });
      expect(res.status).to.eq(201);
      expect(res.body.message).to.equal("Transfer successful");
      expect(res.body.account.balance).to.equal(
        (testAccount1.balance as number) - 2000
      );
      expect(res.body.receipt.amount).to.equal(2000);
    });

    it("should fail to transfer due to insufficient funds", async () => {
      const res = await request(app)
        .post("/api/account/transfer")
        .set("Authorization", token1)
        .send({
          accountNumber: testAccount1.account_number,
          to: testAccount2.account_number,
          amount: 60000,
        });
        expect(res.body.message).to.equal("Insufficient funds");
      expect(res.status).to.eq(402);
    });

    it("should fail to transfer if any of the account numbers does not exist", async () => {
      const res = await request(app)
        .post("/api/account/transfer")
        .set("Authorization", token1)
        .send({
          accountNumber: testAccount1.account_number,
          to: "7535468734",
          amount: 5000,
        });
      expect(res.status).to.eq(404);
      expect(res.body.message).to.equal(
        `Account number ${"7535468734"} does not exist`
      );
    });
  });

  describe("/GET all-transactions", () => {
    beforeEach(async () => {
      await createAccountAndFundIt(testAccount1, token1);
      await createAccountAndFundIt(testAccount2, token2);
    });

    afterEach(async () => {
      await deleteAccount(testAccount1.id as number, token1);
      await deleteAccount(testAccount2.id as number, token2);
    });

    it("get all transactions made by an account", async () => {
      const res = await request(app)
        .get("/api/account/all-transactions/" + testAccount1.account_number)
        .set("Authorization", token1);
        expect(res.body.message).to.equal("Fetch successful");
      expect(res.status).to.eq(200);
      assert(
        res.body.transactions instanceof Array,
        "Transactions response is not an array"
      );
      expect(res.body.transactions.length).to.equal(1);
    });
    it("should fail due to invalid account number", async () => {
      const res = await request(app)
        .get("/api/account/all-transactions/777222356")
        .set("Authorization", token1);
      expect(res.body.message).to.equal("Account number 777222356 is invalid");
      expect(res.status).to.eq(422);
    });

    it("should fail to if account number does not exist", async () => {
      const res = await request(app)
        .get("/api/account/all-transactions/7772223565")
        .set("Authorization", token1);
      expect(res.body.message).to.equal(
        "Account number 7772223565 does not exist"
      );
      expect(res.status).to.eq(404);
    });
  });
  describe("/GET filter-transactions", () => {
    it("should get transaction based on the recipient", async () => {
      const res = await request(app)
        .get(
          `/api/account/filter-transactions/${testAccount1.account_number}?key=to?value=${testAccount1.account_number}`
        )
        .set("Authorization", token1);
      expect(res.status).to.eq(200);
      expect(res.body.message).to.equal("Name changed successfully");
      expect(res.body.user.name).to.equal("Adeyemi Adejumo");
    });
    it("should fail to if account number does not exist", async () => {
      const res = await request(app)
        .get("/api/account/filter-transactions/")
        .set("Authorization", token1);
      expect(res.body.message).to.equal("No account number found");
      expect(res.status).to.eq(422);
    });
  });
});
