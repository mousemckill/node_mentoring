import { QueryInterface, DataTypes } from "sequelize";
import uuid from "uuid";

export default {
  up: (queryInterface: QueryInterface, _: any) => {
    return queryInterface.bulkInsert("groups", [
      {
        id: uuid.v4(),
        name: "admin",
        permissions: ["READ", "WRITE", "DELETE", "SHARE", "UPLOAD_FILES"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuid.v4(),
        name: "manager",
        permissions: ["READ", "WRITE", "UPLOAD_FILES"],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: (queryInterface: QueryInterface, _: any) => {
    return queryInterface.bulkDelete("groups", {}, {});
  }
};
