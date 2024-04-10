const Joi = require("joi");


exports.user_details_data_schema = Joi.object({
    first_name: Joi.string().alphanum().min(3).max(30).required().messages({
      "any.required" : "first_name is required",
      "string.empty" : "first name cannot be empty",
      "string.min" : "first name should have atleast 3 minimum characters",
      "string.max" : "first name should have only 3o maximum characters",
      "string.alphanum" : "first name should be alpha numeric",
    }),
    last_name: Joi.string().alphanum().min(3).max(30).required().messages({
      "any.required" : "last_name is required",
      "string.empty" : "last name cannot be empty",
      "string.min" : "last name should have atleast 3 minimum characters",
      "string.max" : "last name should have only 3o maximum characters",
      "string.alphanum" : "last name should be alpha numeric",
    }),
    email_id: Joi.string().email().required().messages({
      "any.required" : "email is required",
      "string.empty" : "email cannot be empty",
      "string.email" : "some thing is missing in email format",
    }),
    address: {
      address1: Joi.string().required().messages({
        "any.required" : "address is required",
        "string.empty" : "address cannot be empty",
      }),
      address2: Joi.string().required().messages({
        "any.required" : "address is required",
        "string.empty" : "address cannot be empty",
      }),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional()
    }
  });