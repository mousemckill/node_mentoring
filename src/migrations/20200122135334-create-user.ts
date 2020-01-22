import { QueryInterface, DataTypes } from "sequelize";

export default {
  up: (queryInterface: QueryInterface, _: any) => {
    return queryInterface.createTable("users", {
      id: {
        allowNull: false,
        primaryKey: true,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      login: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
      age: {
        type: DataTypes.INTEGER
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
    });
  },
  down: (queryInterface: QueryInterface, _: any) => {
    return queryInterface.dropTable("users");
  }
};
