import { Model } from "sequelize";
import { sequelize } from "../database.js";
class UserSpaces extends Model {
}
UserSpaces.init({}, {
    sequelize,
    modelName: "userSpaces",
    tableName: "user_spaces",
    timestamps: true,
});
export default UserSpaces;
