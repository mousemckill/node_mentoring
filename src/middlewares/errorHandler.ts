import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  res.status(500).json({ error: err });
};
