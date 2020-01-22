import Joi from "@hapi/joi";
import { createValidator } from "express-joi-validation";

const validator = createValidator({ passError: true });

const loginSubstringSchema = Joi.object({
  loginSubstring: Joi.string().required()
});

export default validator.params(loginSubstringSchema);
