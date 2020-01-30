import {
  Model,
  DataTypes,
  HasManyGetAssociationsMixin,
  Association
} from "sequelize";
import db from "../database";
import { Group } from "./Group";
import { UserGroups } from "./UserGroups";

export class User extends Model {
  public id!: string;
  public login!: string;
  public password!: string;
  public age!: number;
  public isDeleted!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getGroups!: HasManyGetAssociationsMixin<Group>;

  public readonly groups?: Group[];

  public static associations: {
    groups: Association<User, Group>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    login: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
    tableName: "users"
  }
);
