import { Request, Response, NextFunction } from "express";

export const apiLogger = (apiName: string) => (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { path, query, params, body } = req;

  console.log(
    "ApiLogger:",
    apiName,
    "path:",
    path,
    "query:",
    query,
    "params:",
    params,
    "body:",
    body
  );

  next();
};
