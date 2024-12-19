import { expect } from "chai";
import { db } from "../../src/db";
import UserModel from "../../src/models/user";
import { User } from "../../src/types";
import { faker } from "@faker-js/faker";

const testUser: Omit<User, "id"> = {
  email: faker.internet.email().toLowerCase(),
  name: faker.person.fullName(),
  password: "test_password",
};

describe("User Model", () => {
  before(async () => {
    process.env.NODE_ENV = "test";
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db(UserModel.getTableName).del();
  });

  after(async () => {
    await db.migrate.rollback();
  });

  it("should insert and retrieve user", async () => {
    await UserModel.insert<typeof testUser>(testUser);
    const allResults = await UserModel.findAll<User>();

    expect(allResults.length).to.equal(1);
    expect(allResults[0].name).to.equal(testUser.name);
  });

  it("should insert user and retrieve by email", async () => {
    const { id } = await UserModel.insert<typeof testUser>(testUser);
    const result = await UserModel.findOneById<User>(id);

    expect(result.name).to.equal(testUser.name);
  });
});
