import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database.js";

class User extends Model {
  declare id: number;
  declare name: string;
    declare email: string;
    declare username: string | null;
  declare password: string;
  declare salt: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
      email: {
          type: DataTypes.STRING(254).BINARY,
          allowNull: false,
          unique: "user_email_unique",
    },
    username: {
      type: DataTypes.STRING,
        allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "user",
    tableName: "user",
    timestamps: true,
  }
);

export default User;
