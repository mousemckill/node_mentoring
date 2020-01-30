import { Model, DataTypes } from "sequelize";
import db from "../database";

export class UserGroups extends Model {}
UserGroups.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING
    },
    groupId: {
      type: DataTypes.STRING
    }
  },
  { sequelize: db, modelName: "user_groups", timestamps: false }
);
