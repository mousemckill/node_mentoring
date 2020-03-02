import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "middlewares/errorHandler";

const PORT: number = Number(process.env.PORT) || 3003;

const app: express.Application = express();

app.use(express.json());
app.use(cors());

app.use("/", routes());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

process.on("uncaughtException", event => {
  console.error("Произошла незарегистрированная ошибка", event);
});

process.on("unhandledRejection", event => {
  console.error("Произошла ошибка промиса", event);
});
