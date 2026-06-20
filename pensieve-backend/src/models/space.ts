import { Model, DataTypes, ForeignKey } from "sequelize";
import { sequelize } from "../database.js";

class Space extends Model {
  declare id: number;
  declare ownerId: ForeignKey<number>;
  declare name: string;
}

Space.init(
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
  },
  {
    sequelize,
    modelName: "space",
    tableName: "space",
    timestamps: true,
  }
);
export default Space;
