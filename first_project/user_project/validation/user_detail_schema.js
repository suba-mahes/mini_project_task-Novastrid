const Joi = require("joi");


exports.user_details_data_schema = Joi.object({
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
  }),
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
  gender: Joi.string().required().messages({
    "any.required" : "gender is required",
    "string.empty" : "gender cannot be empty",
  }),
  d_o_b: Joi.date().iso().max('now').required().messages({
    "any.required" : "date of birth is required",
    "date.empty" : "date of birth cannot be empty",
    "date.format" : "missing date format",
    "date.max" : 'maximun than the given range',
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
  },
  family_details : {
    gardian_name: Joi.string().required().messages({
      "any.required" : "gardiun name  is required",
      "string.empty" : "gardiun name cannot be empty",
    }),
    mother_name: Joi.string().required().messages({
      "any.required" : "mother name is required",
      "string.empty" : "mother name cannot be empty",
    }),
    gardian_occupation: Joi.string().required().messages({
      "any.required" : "gardiun occupation  is required",
      "string.empty" : "gardiun occupation cannot be empty",
    }),
    mother_occupation: Joi.string().required().messages({
      "any.required" : "mother occupation is required",
      "string.empty" : "mother occupation cannot be empty",
    }),
  }
});