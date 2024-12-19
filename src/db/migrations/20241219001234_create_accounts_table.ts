import { Knex } from "knex";

const tableName = "accounts";

export async function up(knex: Knex): Promise<void> {
return knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
  table.increments("id");
  table.string("account_name").unique().notNullable();
  table.string("account_number").unique().notNullable();
  table.integer("user_id").unsigned().notNullable();
  table.float("balance");
  table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE")
  table.timestamps(true, true)
})
};


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
};
