import type { Knex } from "knex";

const tableName = "accounts";
export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tableName, async (table) => {
    const exists = await knex.schema.hasColumn(tableName, "account_name");
    if (exists) {
      table.dropColumn("account_name");
    }
    table.string("account_name").notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}

