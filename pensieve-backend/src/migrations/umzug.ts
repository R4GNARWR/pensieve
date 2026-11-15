import { fileURLToPath } from "node:url";
import { SequelizeStorage, Umzug } from "umzug";
import { sequelize } from "../database.js";

export const migrator = new Umzug({
  migrations: {
    glob: fileURLToPath(new URL("./[0-9]*.js", import.meta.url)).replace(/\\/g, "/"),
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});
