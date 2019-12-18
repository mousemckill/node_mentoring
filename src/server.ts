import express from "express";
import { UserApi } from "./UserApi";

const PORT: number = Number(process.env.PORT) || 3003;

const app: express.Application = express();

app.use(express.json());

app.use("/", UserApi);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
