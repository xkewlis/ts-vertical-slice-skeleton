import env from "@/shared/env";
import { Options } from "sequelize";

export const config: Options = {
    port: Number(env.DB_PORT),
    host: env.DB_HOST,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    dialect: 'mysql',
    timezone: '+00:00',
    benchmark: true,
    logging: false,
}
