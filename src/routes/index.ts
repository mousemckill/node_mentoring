import { Router } from "express";
import user from "./user";

export default () => {
  const app = Router();

  user(app);

  return app;
};
