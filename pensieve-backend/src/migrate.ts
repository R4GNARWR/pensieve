import { sequelize } from "./database.js";
import { migrator } from "./migrations/umzug.js";

const command = process.argv[2] || "up";

try {
  switch (command) {
    case "up":
      await migrator.up();
      break;
    case "down":
      await migrator.down();
      break;
    case "status": {
      const [executed, pending] = await Promise.all([
        migrator.executed(),
        migrator.pending(),
      ]);
      console.log(JSON.stringify({ executed, pending }, null, 2));
      break;
    }
    default:
      throw new Error(`Unknown migration command: ${command}. Use up, down or status.`);
  }
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
