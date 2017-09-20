const Joi = require('joi');

const authenticateUserSchema = Joi.alternatives().try(
  Joi.object({
    username: Joi.string().alphanum().required(),
    password: Joi.string().required()
  }),
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
);

module.exports = authenticateUserSchema;
