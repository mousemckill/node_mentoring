import { Router, Request, Response, NextFunction } from "express";
import uuid from "uuid";
import {
  createValidator,
  ExpressJoiError,
  ValidatedRequestSchema,
  ContainerTypes,
  ValidatedRequest
} from "express-joi-validation";
import { UserType } from "./UserType";
import { autosuggest } from "./utils/autosuggest";
import { findUserById } from "./utils/findUser";
import { idSchema, bodySchema, loginSubstringSchema } from "./validationSchema";

const UserApi = Router();

const userList: UserType[] = [];

const validator = createValidator({ passError: true });

interface UserIdParamRequest extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}

interface UserBodyRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    login: string;
    password: string;
    age: number;
  };
}

interface UserSuggestParamRequest extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    loginSubstring: string;
  };
  [ContainerTypes.Query]: {
    limit: number;
  };
}

interface UserIdParamAndBodyRequest extends UserBodyRequest, UserBodyRequest {}

UserApi.get(
  "/users/:id",
  validator.params(idSchema),
  (req: ValidatedRequest<UserIdParamRequest>, res: Response) => {
    const { id } = req.params;
    const user = findUserById(userList, id);

    if (!user) {
      res.status(400).json({ message: "User not found" });
    }

    res.status(200).json(user);
  }
);

UserApi.post(
  "/users",
  validator.body(bodySchema),
  (req: ValidatedRequest<UserBodyRequest>, res: Response) => {
    const { login, password, age } = req.body;

    const newUser: UserType = {
      id: uuid.v4(),
      login,
      password,
      age,
      isDeleted: false
    };

    userList.push(newUser);

    res.status(200).json(newUser);
  }
);

UserApi.put(
  "/users/:id",
  validator.params(idSchema),
  validator.body(bodySchema),
  (req: ValidatedRequest<UserIdParamAndBodyRequest>, res: Response) => {
    const { login, password, age } = req.body;
    const { id } = req.params;
    const user = findUserById(userList, id);

    if (!user) {
      res.status(400).json({ message: "User not found" });
    } else {
      user.login = login;
      user.age = Number(age);
      user.password = password;
    }

    res.status(200).json(user);
  }
);

UserApi.delete(
  "/users/:id",
  validator.params(idSchema),
  (req: ValidatedRequest<UserIdParamRequest>, res: Response) => {
    const { id } = req.params;
    const user = findUserById(userList, id);

    if (!user) {
      res.status(400).json({ message: "User not found" });
    } else {
      user.isDeleted = true;
    }

    res.status(200).json(user);
  }
);

UserApi.get(
  "/suggest/:loginSubstring",
  validator.params(loginSubstringSchema),
  (req: ValidatedRequest<UserSuggestParamRequest>, res: Response) => {
    const { limit } = req.query;
    const { loginSubstring } = req.params;

    const result = autosuggest(userList, loginSubstring, limit);

    res.status(200).json(result);
  }
);

UserApi.use(
  (
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
  }
);

export { UserApi };
