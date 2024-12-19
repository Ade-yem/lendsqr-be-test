import { Knex } from "knex";
import { faker } from "@faker-js/faker";
import type { Transaction } from "../../types";

const tableName = "accounts";

export async function seed(knex: Knex): Promise<void> {
  await knex(tableName).del();

  const usersIds: Array<{ id: number }> = await knex("accounts").select("id");
  const accounts: Omit<Transaction, "id">[] = [];

  usersIds.forEach(({ id: account_id }) => {
    const randomAmount = Math.floor(Math.random() * 10) + 1;

    for (let i = 0; i < randomAmount; i++) {
      accounts.push({
        type: faker.finance.transactionType(),
        amount: Number(faker.finance.amount()),
        to: faker.finance.accountNumber(),
        from: faker.finance.accountNumber(),
        account_id,
      });
    }
  });

  await knex(tableName).insert(accounts);
}
