import { Model, DataTypes, ForeignKey } from "sequelize";
import { sequelize } from "../database.js";

class UserSpaces extends Model {
  declare userId: ForeignKey<number>;
  declare spaceId: ForeignKey<number>;
}

UserSpaces.init({},
  {
    sequelize,
    modelName: "userSpaces",
    tableName: "user_spaces",
    timestamps: true,
  }
);

export default UserSpaces;
