import {QueryInterface, QueryTypes} from "sequelize";

export async function up({context: queryInterface}: { context: QueryInterface }) {
    const users = await queryInterface.sequelize.query("SELECT id FROM `user` LIMIT 1", {
        type: QueryTypes.SELECT,
    });
    if (users.length > 0) {
        throw new Error("The email login migration requires an empty user table.");
    }

    await queryInterface.sequelize.query(`
        ALTER TABLE \`user\`
            ADD COLUMN \`email\` VARCHAR(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
      ADD UNIQUE INDEX \`user_email_unique\` (\`email\`),
      MODIFY COLUMN \`username\` VARCHAR(255) NULL
    `);
}

export async function down({context: queryInterface}: { context: QueryInterface }) {
    const usersWithoutUsername = await queryInterface.sequelize.query(
        "SELECT id FROM `user` WHERE username IS NULL LIMIT 1",
        {type: QueryTypes.SELECT},
    );
    if (usersWithoutUsername.length > 0) {
        throw new Error("Cannot restore required usernames while users without usernames exist.");
    }

    await queryInterface.sequelize.query(`
        ALTER TABLE \`user\`
        DROP INDEX \`user_email_unique\`,
        DROP
        COLUMN \`email\`,
      MODIFY COLUMN \`username\` VARCHAR(255) NOT NULL
    `);
}
