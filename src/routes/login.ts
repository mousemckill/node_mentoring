import { Router, Response } from "express";
import { createValidator, ValidatedRequest } from "express-joi-validation";
import * as jwt from "jsonwebtoken";
import { LoginApi } from "types/LoginApi";
import UserService from "@services/UserService";
import { User } from "@models/User";

const validator = createValidator({ passError: true });
const userService = new UserService(User);

export default (app: Router) => {
  app.post(
    "/login",
    validator.body(LoginApi.loginRequestSchema),
    async (req: ValidatedRequest<LoginApi.ILoginRequest>, res: Response) => {
      const { username, password } = req.body;

      const user = await userService.findUserByLogin(username, password);

      if (!user) {
        return res
          .status(403)
          .json({ message: "Bad username/password combination." });
      }

      const token = jwt.sign({ username }, "123", { expiresIn: "1h" });

      res.json({ token });
    }
  );
};
