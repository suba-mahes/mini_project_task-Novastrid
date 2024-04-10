const Joi = require("joi");


exports.login_schema = Joi.object({
    email_id: Joi.string().email().required().messages({
      "any.required" : "email is required",
      "string.empty" : "email cannot be empty",
      "string.email" : "some thing is missing in email format",
    }),
    password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9@]{3,30}$')).required().messages({
      "any.required" : "password is required",
      "string.empty" : "password cannot be empty",
      "string.min" : "password must be atleast 8 character",
      "string.pattern.base" : "Password must be alphanumeric and between 3-10 characters long"
    })
  });