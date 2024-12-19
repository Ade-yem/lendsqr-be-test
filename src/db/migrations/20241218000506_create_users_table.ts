import { Knex } from "knex";

const tableName = "users";

export async function up(knex: Knex): Promise<void> {
return knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
  table.increments("id");
  table.string("email").unique().notNullable();
  table.string("password").notNullable();
  table.string("name").notNullable();
  table.timestamps(true, true)
})
};


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
};
