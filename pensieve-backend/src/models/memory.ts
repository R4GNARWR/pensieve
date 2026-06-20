import { Model, DataTypes, } from "sequelize";
import type { ForeignKey } from "sequelize";
import { sequelize } from "../database.js";

class Memory extends Model {
  declare id: number;
  declare userId: ForeignKey<number>;
  declare spaceId: ForeignKey<number>;
  declare name: string;
  declare description: string;
  declare date: string;
  declare photo: string;
}

Memory.init(
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: "memory",
    tableName: "memory",
    timestamps: true,
  }
);


export default Memory;
