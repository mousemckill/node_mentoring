import * as Joi from "@hapi/joi";
import { ValidatedRequestSchema, ContainerTypes } from "express-joi-validation";

const password: any = Joi.extend(joi => ({
  type: "alphabetAndNumbers",
  base: joi.string(),
  messages: {
    "passwordComplexity.alphabet": '"{{#label}}" must be contain some chars',
    "passwordComplexity.number": '"{{#label}}" must be contain some numbers'
  },
  validate(value, helpers) {
    if (!/[a-zA-Z]+/.test(value)) {
      return {
        value,
        errors: helpers.error("passwordComplexity.alphabet")
      };
    }

    if (!/\d+/.test(value)) {
      return { value, errors: helpers.error("passwordComplexity.number") };
    }
  }
}));

export namespace UserApi {
  export const getUserSchema: Joi.Schema = Joi.object({
    id: Joi.string()
      .guid({ version: ["uuidv4"] })
      .required()
  });

  export const createUserSchema: Joi.Schema = Joi.object({
    login: Joi.string()
      .min(2)
      .required(),
    password: password.alphabetAndNumbers().required(),
    age: Joi.number()
      .min(4)
      .max(130)
      .required()
  });

  export const loginSubstringSchema = Joi.object({
    loginSubstring: Joi.string().required()
  });

  export const limitSchema = Joi.object({
    limit: Joi.number()
      .min(1)
      .integer()
      .required()
  });

  export interface IGetUserRequest extends ValidatedRequestSchema {
    [ContainerTypes.Params]: {
      id: string;
    };
  }

  export interface ICreateUserRequest extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
      login: string;
      password: string;
      age: number;
    };
  }

  export interface IUpdateUserRequest extends ValidatedRequestSchema {
    [ContainerTypes.Params]: {
      id: string;
    };
    [ContainerTypes.Body]: {
      login: string;
      password: string;
      age: number;
    };
  }

  export interface IUserSuggestRequest extends ValidatedRequestSchema {
    [ContainerTypes.Params]: {
      loginSubstring: string;
    };
    [ContainerTypes.Query]: {
      limit: number;
    };
  }
}
