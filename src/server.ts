import express from "express";
import routes from "./routes";

const PORT: number = Number(process.env.PORT) || 3003;

const app: express.Application = express();

app.use(express.json());

app.use("/", routes());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
