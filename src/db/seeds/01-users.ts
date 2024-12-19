import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import { User } from '../../types';


const tableName = 'users';

export async function seed(knex: Knex): Promise<void> {
  await knex(tableName).del();
  const users: Omit<User, "id">[] = [...Array(10).keys()].map(key => ({
    email: faker.internet.email().toLowerCase(),
    name: faker.person.fullName(),
    password: faker.internet.password()
  }));
  await knex(tableName).insert(users.map(user => ({ ...user })));
}