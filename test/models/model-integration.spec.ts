import { expect } from "chai";
import { db } from "../../src/db";
import { Model } from "../../src/models";

const testTable = "test_table";
interface Test {
  id: number;
  name: string;
  class: string;
}

class TestModel extends Model {
  protected static tableName = testTable;
}

describe("Base Model", () => {
  before(async () => {
    process.env.NODE_ENV = "test";

    await db.schema.createTable(testTable, (table) => {
      table.increments("id").primary();
      table.string("name");
      table.string("class");
    });
  });

  afterEach(async () => {
    await db(testTable).truncate();
  });

  after(async () => {
    await db.schema.dropTable(testTable);
  });

  it("should insert multiple rows", async () => {
    await TestModel.insert<Omit<Test, "id">>({ name: "Adeyemi" , class: "jss2" });
    await TestModel.insert<Omit<Test, "id">>({ name: "Adeyemi" , class: "jss2" });
    await TestModel.insert<Omit<Test, "id">>({ name: "Adeyemi" , class: "jss2" });
    await TestModel.insert<Omit<Test, "id">>({ name: "Adeyemi" , class: "jss2" });
    const results = await TestModel.findAll<Test>();
    expect(results.length).to.eq(4);
  });

  it("should insert a row and check for it", async () => {
    await TestModel.insert<Omit<Test, "id">>({ name: "Adeyemi", class: "jss2" });
    const results = await TestModel.findAll<Test>();

    expect(results.length).to.eq(1);
    expect(results[0].name).to.eq("Adeyemi");
  });

  it("should insert a row and fetch it by id", async () => {
    const { id } = await TestModel.insert<Omit<Test, "id">>({
      name: "TestName", class: "jss2"
    });
    const result = await TestModel.findOneById<Test>(id);

    expect(result.name).to.equal("TestName");
  });

  it("should create a row and return it", async () => {
    const result = await TestModel.create<Omit<Test, "id">, Test>({
      name: "TestName", class: "jss2"
    });
    expect(result?.name).to.equal("TestName");
  });

  it("should insert a row and update it", async () => {
    const { id } = await TestModel.insert<Omit<Test, "id">>({
      name: "TestName", class: "jss2"
    });
    const result = await TestModel.updateOneById<Omit<Test, "id" | "class">, Test>(id, {
      name: "Adeyemi",
    });

    expect(result.name).to.equal("Adeyemi");
  });

  it("should insert a row and delete it by id", async () => {
    const { id } = await TestModel.insert<Omit<Test, "id">>({
      name: "TestName", class: "jss2"
    });
    const result = await TestModel.deleteOneById(id);

    expect(result).to.equal(1);
  });
});
