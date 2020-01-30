import { Router, NextFunction, Request, Response } from "express";
import user from "./user";
import group from "./group";
import { ExpressJoiError } from "express-joi-validation";

const validationErrorHandler = (
  err: any | ExpressJoiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err && err.error && err.error.isJoi) {
    const e: ExpressJoiError = err;

    res.status(400).json({
      type: e.type,
      message: e.error.toString()
    });
  } else {
    next(err);
  }
};

export default () => {
  const app = Router();

  user(app);
  group(app);

  app.use(validationErrorHandler);

  return app;
};
