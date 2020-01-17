import { Router, Response, NextFunction, RequestHandler } from "express";
import {
  ValidatedRequestSchema,
  ContainerTypes,
  ValidatedRequest,
  ExpressJoiError
} from "express-joi-validation";
import UserService from "@services/UserService";
import validateParamId from "@validators/validateParamId";
import validateBodyUser from "@validators/validateBodyUser";
import validateParamLogin from "@validators/validateParamLogin";

const route = Router();

interface IUserIdParamRequest extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}

interface IUserBodyRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    login: string;
    password: string;
    age: number;
  };
}

interface IUserIdParamAndBodyRequest
  extends IUserBodyRequest,
    IUserBodyRequest {}

interface IUserSuggestParamRequest extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    loginSubstring: string;
  };
  [ContainerTypes.Query]: {
    limit: number;
  };
}

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

export default (app: Router) => {
  app.use("/users", route);

  // route.use(validationErrorHandler);

  route.get(
    ":id",
    validateParamId,
    (req: ValidatedRequest<IUserIdParamRequest>, res: Response) => {
      const { id } = req.params;
      const user = UserService.findUserById(id);

      if (!user) {
        res.status(400).json({ message: "User not found" });
      }

      res.status(200).json(user);
    }
  );

  route.post(
    "/users",
    validateBodyUser,
    (req: ValidatedRequest<IUserBodyRequest>, res: Response) => {
      const { login, password, age } = req.body;

      const user = UserService.addUser({ login, password, age });

      res.status(200).json(user);
    }
  );

  route.put(
    "/users/:id",
    validateParamId,
    validateBodyUser,
    (req: ValidatedRequest<IUserIdParamAndBodyRequest>, res: Response) => {
      const { login, password, age } = req.body;
      const { id } = req.params;
      const user = UserService.updateUserById(id, { login, age, password });

      if (!user) {
        res.status(400).json({ message: "User not found" });
      }

      res.status(200).json(user);
    }
  );

  route.delete(
    "/users/:id",
    validateParamId,
    (req: ValidatedRequest<IUserIdParamRequest>, res: Response) => {
      const { id } = req.params;
      const user = UserService.deleteUserById(id);

      if (!user) {
        res.status(400).json({ message: "User not found" });
      }

      res.status(200).json(user);
    }
  );

  route.get(
    "/suggest/:loginSubstring",
    validateParamLogin,
    (req: ValidatedRequest<IUserSuggestParamRequest>, res: Response) => {
      const { limit } = req.query;
      const { loginSubstring } = req.params;

      const result = UserService.find(loginSubstring, limit);

      res.status(200).json(result);
    }
  );
};