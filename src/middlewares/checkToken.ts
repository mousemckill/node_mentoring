import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export function checkToken(req: Request, res: Response, next: NextFunction) {
  const token: string | string[] | undefined = req.headers["x-access-token"];

  if (token && typeof token === "string") {
    jwt.verify(token, "123", function(err: jwt.VerifyErrors) {
      if (err) {
        res
          .status(403)
          .json({ success: false, msg: "Failed to authenticate token." });
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({ success: false, msg: "No token provided." });
  }
}
