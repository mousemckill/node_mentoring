import {
  Model,
  DataTypes,
  BelongsToGetAssociationMixin,
  BelongsToManyAddAssociationMixin
} from "sequelize";
import db from "../database";
import { Permission } from "@types";
import { User } from "./User";
import { UserGroups } from "./UserGroups";

export class Group extends Model {
  public id!: string;
  public name!: string;
  public permissions!: Permission[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getUsers!: BelongsToGetAssociationMixin<User>;
  public addUsers!: BelongsToManyAddAssociationMixin<User, User[]>;

  public readonly users?: User[];
}

Group.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      unique: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      unique: true,
      type: DataTypes.STRING(128),
      allowNull: false
    },
    permissions: {
      allowNull: false,
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  {
    sequelize: db,
    tableName: "groups"
  }
);

Group.belongsToMany(User, {
  through: {
    model: UserGroups
  },
  foreignKey: "groupId",
  otherKey: "userId",
  constraints: false
});
