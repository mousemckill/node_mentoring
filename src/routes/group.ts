import { Router, Request, Response } from "express";
import GroupService from "@services/GroupService";
import { ValidatedRequest, createValidator } from "express-joi-validation";
import { Group } from "@models/Group";
import { User } from "@models/User";
import { GroupApi } from "types/GroupApi";

const route = Router();
const groupService = new GroupService(Group, User);
const validator = createValidator({ passError: true });

export default (app: Router) => {
  app.use("/groups", route);

  route.get("/", (req: Request, res: Response) => {
    groupService.all().then(groupList => {
      res.json(groupList);
    });
  });

  route.post(
    "/",
    validator.body(GroupApi.addGroupSchema),
    async (
      req: ValidatedRequest<GroupApi.ICreateGroupRequest>,
      res: Response
    ) => {
      const group = await groupService.addGroup(req.body);

      res.json(group);
    }
  );

  route.get(
    "/:id",
    validator.params(GroupApi.getGroupSchema),
    async (req: ValidatedRequest<GroupApi.IGetGroupRequest>, res: Response) => {
      const { id } = req.params;

      const group = await groupService.getGroupById(id);

      if (!group) {
        res.status(400).json({ message: "Group not found" });
      }

      res.status(200).json(group);
    }
  );

  route.put(
    "/:id",
    validator.params(GroupApi.getGroupSchema),
    validator.body(GroupApi.addGroupSchema),
    async (
      req: ValidatedRequest<GroupApi.IUpdateGroupRequest>,
      res: Response
    ) => {
      const group = await groupService.updateGroup(req.params.id, req.body);

      if (!group) {
        res.status(400).json({ message: "Group not found" });
      }

      res.status(200).json(group);
    }
  );

  route.delete(
    "/:id",
    validator.params(GroupApi.addGroupSchema),
    async (req: ValidatedRequest<GroupApi.IGetGroupRequest>, res: Response) => {
      const group = await groupService.deleteGroup(req.params.id);

      res.json(group);
    }
  );

  route.post(
    "/addUsers/:id",
    validator.params(GroupApi.getGroupSchema),
    validator.body(GroupApi.addUsersSchema),
    async (req: ValidatedRequest<GroupApi.IAddUsersRequest>, res: Response) => {
      const addedUsers = await groupService.addUsersToGroup(
        req.params.id,
        req.body.userIds
      );

      res.json(addedUsers);
    }
  );
};
