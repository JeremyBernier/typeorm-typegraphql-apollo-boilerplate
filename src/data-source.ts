import { DataSource } from "typeorm";
const isProd = process.env.NODE_ENV === "production";
const rootDir = !isProd ? "src" : "build";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,

  ssl: !isProd ? false : { rejectUnauthorized: false },

  synchronize: true,
  logging: true,

  entities: [rootDir + "/entity/*.entity.{js,ts}"],
  migrations: [rootDir + "/db/migrations/*.{js,ts}"],
  subscribers: [],
});
