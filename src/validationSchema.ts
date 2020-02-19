import * as Joi from "@hapi/joi";

export const idSchema = Joi.object({
  id: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required()
});

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

export const bodySchema = Joi.object({
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

export const querySchema = Joi.object({
  limit: Joi.number()
    .min(1)
    .required()
});
