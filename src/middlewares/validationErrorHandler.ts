import { NextFunction, Request, Response } from "express";
import { ExpressJoiError } from "express-joi-validation";

export const validationErrorHandler = (
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
