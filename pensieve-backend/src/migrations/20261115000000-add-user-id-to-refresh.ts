import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.addColumn("refresh", "userId", {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
  await queryInterface.addConstraint("refresh", {
    fields: ["userId"],
    type: "foreign key",
    name: "refresh_user_id_fk",
    references: {
      table: "user",
      field: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  await queryInterface.sequelize.query("DELETE FROM refresh");
  await queryInterface.changeColumn("refresh", "userId", {
    type: DataTypes.INTEGER,
    allowNull: false,
  });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.removeConstraint("refresh", "refresh_user_id_fk");
  await queryInterface.removeColumn("refresh", "userId");
}
