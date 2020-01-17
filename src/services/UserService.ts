import { find } from "lodash";
import uuid from "uuid";
import { autosuggest } from "@utils/autosuggest";

type User = {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
};

interface IUser {
  login: string;
  age: number;
  password: string;
}

const UserCollection: User[] = [];

export default class UserService {
  static find(loginSubstring: string, limit: number) {
    return autosuggest(UserCollection, loginSubstring, limit);
  }

  static deleteUserById(id: string) {
    let user = UserService.findUserById(id);

    if (!user) return;

    user.isDeleted = true;

    return user;
  }

  static updateUserById(id: string, { login, age, password }: IUser) {
    let user = UserService.findUserById(id);

    if (!user) return;

    user = { ...user, login, age, password };

    return user;
  }

  static addUser({ login, age, password }: IUser) {
    const user: User = {
      id: uuid.v4(),
      login,
      password,
      age,
      isDeleted: false
    };

    UserCollection.push(user);

    return user;
  }

  static findUserById(id: string) {
    return find(UserCollection, { id });
  }
}
