import Knex from "knex";
import configs from "../../knexfile";


export const db = Knex(configs[process.env.NODE_ENV || "development"])
