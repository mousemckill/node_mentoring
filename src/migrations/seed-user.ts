import { QueryInterface, DataTypes } from "sequelize";
import uuid from "uuid";

export default {
  up: (queryInterface: QueryInterface, _: any) => {
    return queryInterface.bulkInsert("users", [
      {
        id: uuid.v4(),
        login: "Joe",
        password: "joe123",
        age: 26,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuid.v4(),
        login: "Vadim",
        password: "vad1m",
        age: 41,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuid.v4(),
        login: "Anna",
        password: "0an4A",
        age: 18,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: (queryInterface: QueryInterface, _: any) => {
    return queryInterface.bulkDelete("users", {}, {});
  }
};
