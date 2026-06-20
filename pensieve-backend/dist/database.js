import { Sequelize } from "sequelize";
const sequelizeInstance = new Sequelize(
  process.env.DB_NAME || "",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  },
);
export const sequelize = sequelizeInstance;
