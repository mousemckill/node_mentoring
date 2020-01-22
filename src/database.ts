import { Sequelize } from "sequelize";

const uri: string = process.env["DATABASE_URL"] || "";

const db = new Sequelize(uri, {
  ssl: true
});

export default db;
