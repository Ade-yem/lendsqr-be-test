import { expect } from "chai";
import { db } from "../../src/db";
import UserModel from "../../src/models/user";
import { User } from "../../src/types";
import { faker } from "@faker-js/faker";
import { app } from "../../src";
import request from "supertest";
import * as bcrypt from "bcryptjs";

const testUser: Omit<User, "id"> = {
  email: faker.internet.email().toLowerCase(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
};
const testPasswordHash = bcrypt.hashSync(testUser.password, 10);

describe("Test for the authentication routes and their controllers", () => {
  describe("/POST register", () => {
    before(async () => {
      process.env.NODE_ENV = "test";
    });

    afterEach(async () => {
      await db(UserModel.getTableName).del();
    });

    after(async () => {});
    it("should register user", async () => {
      const res = await request(app).post("/api/auth/register").send(testUser);
      expect(res.status).to.eq(201);
      expect(res.body.user.name).to.eq(testUser.name);
    });

    it("should fail to register repeat user", async () => {
      await request(app).post("/api/auth/register").send(testUser);
      const res = await request(app).post("/api/auth/register").send(testUser);
      expect(res.status).to.eq(409);
    });
  });

  describe("/POST login", () => {
    beforeEach(async () => {
      await UserModel.create<Omit<User, "id">, User>({
        ...testUser,
        password: testPasswordHash,
      });
    });

    afterEach(async () => {
      await db(UserModel.getTableName).del();
    });

    it("should login a user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: testUser.password });
      expect(res.body.message).to.equal("Login successful");
      expect(res.body.user.name).to.equal(testUser.name);
      expect(res.status).to.eq(200);
    });

    it("should reject invalid password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: "testUser.password" });
      expect(res.status).to.eq(401);
      expect(res.body.message).to.eq("Invalid password");
    });

    it("should reject invalid email", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "adejumo@test.com", password: testUser.password });
      expect(res.status).to.eq(401);
      expect(res.body.message).to.eq("User with email not found");
    });
  });

});
