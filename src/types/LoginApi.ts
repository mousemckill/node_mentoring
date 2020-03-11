import * as Joi from "@hapi/joi";
import { ValidatedRequestSchema, ContainerTypes } from "express-joi-validation";

export namespace LoginApi {
  export const loginRequestSchema: Joi.Schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  });

  export interface ILoginRequest extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
      username: string;
      password: string;
    };
  }
}
