import { Router, Response } from "express";
import { ValidatedRequest, createValidator } from "express-joi-validation";
import UserService from "@services/UserService";
import { User } from "@models/User";
import { UserApi } from "types/UserApi";

const validator = createValidator({ passError: true });
const route = Router();

const userService = new UserService(User);

export default (app: Router) => {
  app.use("/users", route);

  route.get(
    "/:id",
    validator.params(UserApi.getUserSchema),
    async (req: ValidatedRequest<UserApi.IGetUserRequest>, res: Response) => {
      const { id } = req.params;
      const user = await userService.findUserById(id);

      if (!user) {
        res.status(400).json({ message: "User not found" });
      }

      res.status(200).json(user);
    }
  );

  route.post(
    "/",
    validator.body(UserApi.createUserSchema),
    (req: ValidatedRequest<UserApi.ICreateUserRequest>, res: Response) => {
      const { login, password, age } = req.body;

      userService.addUser({ login, password, age }).then(user => {
        res.status(200).json(user);
      });
    }
  );

  route.put(
    "/:id",
    validator.params(UserApi.getUserSchema),
    validator.body(UserApi.createUserSchema),
    (req: ValidatedRequest<UserApi.IUpdateUserRequest>, res: Response) => {
      const { login, password, age } = req.body;
      const { id } = req.params;

      userService
        .updateUserById(id, { login, age, password })
        .then(user => {
          res.status(200).json(user);
        })
        .catch(e => {
          res.status(400).json({ message: "User not found" });
        });
    }
  );

  route.delete(
    "/:id",
    validator.params(UserApi.getUserSchema),
    async (req: ValidatedRequest<UserApi.IGetUserRequest>, res: Response) => {
      const { id } = req.params;

      try {
        const user = await userService.deleteUserById(id);

        res.status(200).json(user);
      } catch (error) {
        res.status(400).json({ message: "User not found" });
      }
    }
  );

  route.get(
    "/suggest/:loginSubstring",
    validator.params(UserApi.loginSubstringSchema),
    validator.query(UserApi.limitSchema),
    async (
      req: ValidatedRequest<UserApi.IUserSuggestRequest>,
      res: Response
    ) => {
      const { limit } = req.query;
      const { loginSubstring } = req.params;

      const result = await userService.find(loginSubstring, limit);

      res.status(200).json(result);
    }
  );
};
