import { Router } from "express";
import user from "./user";
import group from "./group";
import { validationErrorHandler } from "middlewares/validationErrorHandler";
import { serviceLogger } from "middlewares/serviceLogger";

export default () => {
  const app = Router();

  app.use(serviceLogger);

  user(app);
  group(app);

  app.use(validationErrorHandler);

  return app;
};
