import { DataTypes, QueryInterface } from "sequelize";

const timestamps = {
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false },
};

const id = {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
};

export async function up({ context: queryInterface }: { context: QueryInterface }) {
  const tableNames = ["user", "space", "memory", "user_spaces", "refresh"];
  const existingTables = await queryInterface.showAllTables();
  const existingApplicationTables = tableNames.filter((tableName) =>
    existingTables.includes(tableName),
  );

  if (existingApplicationTables.length === tableNames.length) return;
  if (existingApplicationTables.length > 0) {
    throw new Error(
      `Cannot initialize a partial schema. Existing tables: ${existingApplicationTables.join(", ")}`,
    );
  }

  const createTable = queryInterface.createTable.bind(queryInterface);

  await createTable("user", {
    id,
    name: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    salt: { type: DataTypes.STRING, allowNull: false },
    ...timestamps,
  });
  await createTable("space", {
    id,
    name: { type: DataTypes.STRING, allowNull: false },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: { tableName: "user" }, key: "id" },
      onDelete: "CASCADE",
    },
    ...timestamps,
  });
  await createTable("memory", {
    id,
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    date: { type: DataTypes.DATE, allowNull: false },
    photo: { type: DataTypes.STRING, allowNull: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: { tableName: "user" }, key: "id" },
      onDelete: "CASCADE",
    },
    spaceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: { tableName: "space" }, key: "id" },
      onDelete: "CASCADE",
    },
    ...timestamps,
  });
  await createTable("user_spaces", {
    id,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: { tableName: "user" }, key: "id" },
      onDelete: "CASCADE",
    },
    spaceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: { tableName: "space" }, key: "id" },
      onDelete: "CASCADE",
    },
    ...timestamps,
  });
  await queryInterface.addIndex("user_spaces", ["userId", "spaceId"], {
    name: "user_spaces_user_id_space_id_unique",
    unique: true,
  });
  await createTable("refresh", {
    id,
    token: { type: DataTypes.STRING, allowNull: false, unique: true },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    ...timestamps,
  });
}
