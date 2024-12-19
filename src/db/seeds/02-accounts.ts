import { Knex } from "knex";
import { faker } from "@faker-js/faker";
import type { Account } from "../../types";

const tableName = "accounts";

export async function seed(knex: Knex): Promise<void> {
  await knex(tableName).del();

  const usersIds: Array<{ id: number }> = await knex("users").select("id");
  const accounts: Omit<Account, "id">[] = [];

  usersIds.forEach(({ id: user_id }) => {
    const randomAmount = Math.floor(Math.random() * 10) + 1;

    for (let i = 0; i < randomAmount; i++) {
      accounts.push({
        account_number: faker.finance.accountNumber(10),
        balance: Number(faker.finance.amount()),
        user_id,
      });
    }
  });

  await knex(tableName).insert(accounts);
}
