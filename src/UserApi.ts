import { Router, Request, Response, NextFunction } from "express";
import uuid from "uuid";
import { UserType } from "./UserType";
import { autosuggest } from "./utils/autosuggest";
import { findUserById } from "./utils/findUser";

const UserApi = Router();

const userList: UserType[] = [];

UserApi.get("/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const user = findUserById(userList, id);

  if (!user) {
    res.status(400).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

UserApi.post("/users", (req: Request, res: Response) => {
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
});

UserApi.put("/users/:id", (req: Request, res: Response) => {
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
});

UserApi.delete("/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const user = findUserById(userList, id);

  if (!user) {
    res.status(400).json({ message: "User not found" });
  } else {
    user.isDeleted = true;
  }

  res.status(200).json(user);
});

UserApi.get("/suggest/:loginSubstring", (req: Request, res: Response) => {
  const { limit } = req.query;
  const { loginSubstring } = req.params;

  const result = autosuggest(userList, loginSubstring, limit);

  res.status(200).json(result);
});

export { UserApi };
