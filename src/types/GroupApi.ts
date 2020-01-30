import Joi = require("@hapi/joi");
import { ValidatedRequestSchema, ContainerTypes } from "express-joi-validation";
import { Permission } from "types";

export namespace GroupApi {
  export const addGroupSchema: Joi.Schema = Joi.object({
    name: Joi.string()
      .min(2)
      .required(),
    permissions: Joi.array().items(Joi.string())
  });

  export const getGroupSchema: Joi.Schema = Joi.object({
    id: Joi.string()
      .guid({ version: ["uuidv4"] })
      .required()
  });

  export const addUsersSchema: Joi.Schema = Joi.object({
    userIds: Joi.array().items(Joi.string().guid({ version: ["uuidv4"] }))
  });

  export interface ICreateGroupRequest extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
      id: string;
      name: string;
      permissions: Permission[];
    };
  }

  export interface IGetGroupRequest extends ValidatedRequestSchema {
    [ContainerTypes.Params]: {
      id: string;
    };
  }

  export interface IUpdateGroupRequest extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
      name: string;
      permissions: Permission[];
    };
    [ContainerTypes.Params]: {
      id: string;
    };
  }

  export interface IAddUsersRequest extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
      userIds: string[];
    };
    [ContainerTypes.Params]: {
      id: string;
    };
  }
}
