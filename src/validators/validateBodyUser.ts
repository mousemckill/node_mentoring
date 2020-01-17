import { createValidator } from "express-joi-validation";
import * as Joi from "@hapi/joi";

const validator = createValidator({ passError: true });

const password: any = Joi.extend(joi => ({
  type: "alphabetAndNumbers",
  base: joi.string(),
  messages: {
    "passwordComplexity.alphabet": '"{{#label}}" must be contain some chars',
    "passwordComplexity.number": '"{{#label}}" must be contain some numbers'
  },
  validate(value, helpers) {
    console.log({ value });
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

export default validator.body(
  Joi.object({
    login: Joi.string()
      .min(2)
      .required(),
    password: password.alphabetAndNumbers().required(),
    age: Joi.number()
      .min(4)
      .max(130)
      .required()
  })
);
