const Joi = require("joi");

const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phoneNumber: Joi.number().required(),
  emailAddress: Joi.string().email().required(),
  password: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  gender: Joi.string().required(),
  role: Joi.string(),
  slotsBooked: Joi.array(),
});

module.exports = userSchema;
