import { QueryInterface, DataTypes } from "sequelize";

export default {
  up: (queryInterface: QueryInterface, _: any) => {
    return queryInterface.createTable("groups", {
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
    });
  },
  down: (queryInterface: QueryInterface, _: any) => {
    return queryInterface.dropTable("groups");
  }
};
