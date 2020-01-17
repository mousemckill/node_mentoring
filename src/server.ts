import express from "express";
import api from "./api";

const PORT: number = Number(process.env.PORT) || 3003;

const app: express.Application = express();

app.use(express.json());

app.use("/", api());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
