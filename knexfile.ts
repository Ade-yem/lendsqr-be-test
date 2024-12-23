import {config } from "dotenv";

config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: 'mysql2',
    connection: {
      user: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      database: process.env.DB_DB_NAME as string,
      host: process.env.DB_HOST as string,
      port: Number(process.env.DB_PORT),
    },
    migrations: {
      directory: 'src/db/migrations',
      extension: "ts"
    },
    seeds: {
      directory: 'src/db/seeds',
      extension: "ts"
    }
  },
  test: {
    client: 'mysql2',
    connection: {
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "root",
      database: "test_db",
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306
    },
  },

  staging: {
    client: 'mysql2',
    connection: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DB_NAME,
      host: process.env.DB_HOST
    },
    migrations: {
      directory: 'src/db/migrations',
    },
    seeds: {
      directory: 'src/db/seeds'
    },
    pool: {
      min: 2,
      max: 10
    },
  },

  production: {
    client: 'mysql2',
    connection: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT
    },
    migrations: {
      directory: 'src/db/migrations',
    },
    seeds: {
      directory: 'src/db/seeds'
    },
    pool: {
      min: 2,
      max: 10
    },
  }

};

