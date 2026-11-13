import { Model, DataTypes, ForeignKey } from "sequelize";
import { sequelize } from "../database.js";
import User from "./user.js";

class RefreshToken extends Model {
  declare token: string;
  declare expiresAt: Date;
  declare userId: ForeignKey<number>;
}

RefreshToken.init(
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "refreshToken",
    tableName: "refresh",
    timestamps: true,
  }
);

RefreshToken.belongsTo(User, { foreignKey: "userId" });
User.hasMany(RefreshToken, { foreignKey: "userId", onDelete: "CASCADE" });

export default RefreshToken;