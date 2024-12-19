import { db } from "../db";

export abstract class Model {
  protected static tableName?: string;

  protected static get table() {
    if (!this.tableName) {
      throw new Error("Table name not defined");
    }
    return db(this.tableName);
  }

  public static get getTableName() {
    return this.tableName;
  }

  public static async insert<Payload>(data: Payload): Promise<{ id: number }> {
    const [id] = await this.table.insert(data);
    return { id };
  }

  public static async deleteOneById(
    id: number
  ): Promise<number> {
    return await this.table.where({ id }).delete();
  }

  public static async findOneById<Result>(id: number): Promise<Result> {
    return this.table.where("id", id).select("*").first();
  }

  public static async findAll<Item>(): Promise<Item[]> {
    return this.table.select("*");
  }

  public static async create<Payload, Result>(data: Payload): Promise<Result | null> {
    const [id] = await this.table.insert(data);
    return await this.findOneById(id);
  }
  
  public static async updateOneById<Payload, Result>(
    id: number,
    data: Payload
  ): Promise<Result> {
    const result = await this.table.where({ id }).update(data);
    return await this.findOneById(result);
  }
}
