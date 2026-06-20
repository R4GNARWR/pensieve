import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database.js";
class RefreshToken extends Model {
}
RefreshToken.init({
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
}, {
    sequelize,
    modelName: "refreshToken",
    tableName: 'refresh',
    timestamps: true,
});
export default RefreshToken;
