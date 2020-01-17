import { createValidator } from "express-joi-validation";
import * as Joi from "@hapi/joi";

const validator = createValidator({ passError: true });

export default validator.params(
  Joi.object({
    id: Joi.string()
      .guid({ version: ["uuidv4"] })
      .required()
  })
);
