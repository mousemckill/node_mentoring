import { Op } from "sequelize";
import uuid from "uuid";
import { IGroup } from "@types";
import { Group } from "@models/Group";
import { User } from "@models/User";
import db from "database";

export default class GroupService {
  groupModel: typeof Group;
  userModel: typeof User;
  constructor(GroupModel: typeof Group, UserModel: typeof User) {
    this.groupModel = GroupModel;
    this.userModel = UserModel;
  }

  async all() {
    const list = await this.groupModel.findAll();

    return list;
  }

  async addGroup(params: IGroup) {
    const group = await this.groupModel.create({
      id: uuid.v4(),
      ...params
    });

    console.log(group);

    return group;
  }

  async deleteGroup(id: string) {
    const group = await this.getGroupById(id);

    if (group) {
      group.destroy();
    }

    return group;
  }

  async updateGroup(id: string, params: IGroup) {
    const group = await this.getGroupById(id);

    if (group) {
      group.update(params);
    }

    return group;
  }

  async getGroupById(id: string) {
    const group = await this.groupModel.findByPk(id);

    return group;
  }

  async addUsersToGroup(groupId: string, userIds: string[]) {
    const group = await this.getGroupById(groupId);
    await db.transaction(t => {
      return this.userModel
        .findAll({
          where: {
            id: {
              [Op.in]: userIds
            }
          }
        })
        .then(users => {
          return group?.addUsers(users, { transaction: t });
        });
    });

    return group?.getUsers();
  }
}
