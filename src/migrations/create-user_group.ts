import { QueryInterface, DataTypes } from "sequelize";

export default {
  up: (queryInterface: QueryInterface, _: any) => {
    return queryInterface.createTable("user_groups", {
      id: {
        allowNull: false,
        primaryKey: true,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      groupId: {
        type: DataTypes.UUID,
        references: {
          model: "groups",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      }
    });
  },
  down: (queryInterface: QueryInterface, _: any) => {
    return queryInterface.dropTable("user_groups");
  }
};
