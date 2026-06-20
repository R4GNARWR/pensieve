import { Model, DataTypes, ForeignKey } from "sequelize";
import { sequelize } from "../database.js";

class RefreshToken extends Model {
  declare token: string;
  declare expiresAt: Date;
  declare userId: ForeignKey<number>
}

RefreshToken.init(
  {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
  },
  {
    sequelize,
    modelName: "refreshToken",
    tableName: 'refresh',
    timestamps: true,
  }
);
export default RefreshToken;