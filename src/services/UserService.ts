import uuid from "uuid";
import { User } from "@models/User";
import { Op } from "sequelize";
import { IUser } from "@types";

export default class UserService {
  userModel: typeof User;

  constructor(UserModel: typeof User) {
    this.userModel = UserModel;
  }

  async find(loginSubstring: string, limit: number) {
    return await this.userModel.findAll({
      where: {
        login: {
          [Op.like]: `%${loginSubstring}%`
        }
      },
      limit: limit
    });
  }

  async deleteUserById(id: string) {
    let user = await this.findUserById(id);

    if (!user) {
      throw new Error("User not found");
    }

    await user.update({ isDeleted: true });

    return user;
  }

  async updateUserById(id: string, { login, age, password }: IUser) {
    let user = await this.findUserById(id);

    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = await user.update({ login, age, password });

    return updatedUser;
  }

  async addUser({ login, age, password }: IUser) {
    const user: User = await this.userModel.create({
      id: uuid.v4(),
      login,
      password,
      age
    });

    return user;
  }

  async findUserById(id: string) {
    const user = await this.userModel.findByPk(id);

    return user;
  }

  async findUserByLogin(login: string, password: string) {
    const user = await this.userModel.findOne({
      where: { login, password }
    });

    return user;
  }
}
