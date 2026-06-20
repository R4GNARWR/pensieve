import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database.js";
class Space extends Model {
}
Space.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "space",
    tableName: "space",
    timestamps: true,
});
export default Space;
