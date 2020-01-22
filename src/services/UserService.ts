import uuid from "uuid";
import { User } from "@models/User";
import { Op } from "sequelize";

interface IUser {
  login: string;
  age: number;
  password: string;
}

export default class UserService {
  static async find(loginSubstring: string, limit: number) {
    return await User.findAll({
      where: {
        login: {
          [Op.like]: `%${loginSubstring}%`
        }
      },
      limit: limit
    });
  }

  static async deleteUserById(id: string) {
    let user = await UserService.findUserById(id);

    if (!user) {
      throw new Error("User not found");
    }

    await user.update({ isDeleted: true });

    return user;
  }

  static async updateUserById(id: string, { login, age, password }: IUser) {
    let user = await UserService.findUserById(id);

    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = await user.update({ login, age, password });

    return updatedUser;
  }

  static async addUser({ login, age, password }: IUser) {
    const user: User = await User.create({
      id: uuid.v4(),
      login,
      password,
      age
    });

    return user;
  }

  static async findUserById(id: string) {
    const user = await User.findByPk(id);

    return user;
  }
}
