import { expect } from "chai";
import { db } from "../../src/db";
import UserModel from "../../src/models/user";
import { User } from "../../src/types";
import { faker } from "@faker-js/faker";
import { app } from "../../src";
import request from "supertest";

const testUser: Omit<User, "id"> = {
  email: faker.internet.email().toLowerCase(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
};
let token: string;


describe("Test for the user routes and their controllers", () => {
  beforeEach(async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    token = res.body.token;
  });

  before(async () => {
    process.env.NODE_ENV = "test";
  });

  afterEach(async () => {
    await db(UserModel.getTableName).del();
  });

  after(async () => {
    // console.log("Thank you for seeing it through");
    // console.log("Closing down...");
    // process.exit(1);
  });

  

  describe("/GET get-user", () => {
    it("should get user", async () => {
      const res = await request(app)
        .get("/api/user/get-user")
        .set("Authorization", token);
      expect(res.status).to.eq(201);
      expect(res.body.user.name).to.eq(testUser.name);
      expect(res.body.message).to.eq("Fetch successful");
    });

    it("should fail to to get user", async () => {
      const res = await request(app).get("/api/user/get-user");
      expect(res.status).to.eq(401);
      expect(res.body.message).to.eq("Invalid token");
    });
  });

  describe("/POST change-name", () => {
    it("should change the name of user", async () => {
      const res = await request(app)
        .post("/api/user/change-name")
        .set("Authorization", token)
        .send({ name: "Adeyemi Adejumo" });
      // expect(res.status).to.eq(201);
      expect(res.body.message).to.equal("Name changed successfully");
      expect(res.body.user.name).to.equal("Adeyemi Adejumo");
    });

    it("should fail to change the name of user", async () => {
      const res = await request(app)
        .post("/api/user/change-name")
        .send({ name: "Adeyemi Adejumo" });
      expect(res.status).to.eq(401);
      expect(res.body.message).to.equal("Invalid token");
    });
  });

  describe("/POST change-password", () => {
    it("should change the password of user", async () => {
      const res = await request(app)
        .post("/api/user/change-password")
        .set("Authorization", token)
        .send({ password: testUser.password, newPassword: "vyufiutxdypoup" });
      expect(res.status).to.eq(201);
      expect(res.body.message).to.equal("Password change successful");
    });
    it("should fail to change the password of user", async () => {
      const res = await request(app)
        .post("/api/user/change-password")
        .set("Authorization", token)
        .send({ password: "testUser.password", newPassword: "vyufiutxdypoup" });
      expect(res.body.message).to.equal("Incorrect password");
      expect(res.status).to.eq(403);
    });
  });
});
