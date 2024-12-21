import { Knex } from "knex";

const tableName = "transactions";

export async function up(knex: Knex): Promise<void> {
return knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
  table.increments("id");
  table.string("type").notNullable();
  table.string("to").notNullable();
  table.string("from").notNullable();
  table.float("amount");
  table.timestamps(true, true)
})
};


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
};
