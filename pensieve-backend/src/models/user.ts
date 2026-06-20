import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database.js";

class User extends Model {
  declare id: number;
  declare name: string;
  declare username: string;
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
    username: {
      type: DataTypes.STRING,
      allowNull: false,
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
