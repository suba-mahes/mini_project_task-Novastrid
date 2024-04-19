const user_detail = require("../validation/user_detail_schema.js");
const delete_image = require("../middlewares/delete_image_file.js");

const validation = require("../validation/validation_for_update.js");
const display = require("../controllers/result_display.js");

const role_check = (req, res, next) => {
  const req_data = req.data;
  if (req_data.role != 1) {
    display.end_result(res, 401, {
      message: "you do not have access for this page",
    });
  } else {
    next();
  }
};

const user_role_check = async (req, res, next) => {
  const req_data = req.data;
  if (req_data.role != 0) {
    display.end_result(res, 401, {
      message: "you do not have access for this page",
    });
  } else {
    next();
  }
};

const id_params_check = (req, res, next) => {
  let id = parseInt(req.params.id);
  if (!id) {
    display.end_result(res, 403, { message: "parameter is empty" });
  } else {
    next();
  }
};

const update_request_validation = (req, res, next) => {
  const error = validation.update_validation(req.body);

  if (error.length) {
    display.end_result(res, 400, {
      error_message: "Invalid request",
      message: `the request contains invalid fields`,
      invalid_fiels: error,
    });
  } else {
    next();
  }
};

module.exports.role_check_and_id_params_check = (req, res, next) => {
  try {
    role_check(req, res, () => {
      id_params_check(req, res, () => {
        next();
      });
    });
  } catch (error) {
    end_error_result(res, error);
  }
};

module.exports.update_user = (req, res, next) => {
  try {
    let id = parseInt(req.params.id);
    const req_data = req.data;

    user_role_check(req, res, () => {
      update_request_validation(req, res, () => {
        if (req_data.user_id != id) {
          display.end_result(res, 403, {
            message:
              "sorry you don't have the access to update other's details (please check the id in params)",
          });
        } else {
          next();
        }
      });
    });
  } catch (error) {
    end_error_result(res, error);
  }
};

module.exports.update_user_profile = (req, res, next) => {
  try {
    user_role_check(req, res, () => {
      update_request_validation(req, res, () => {
        next();
      });
    });
  } catch (error) {
    end_error_result(res, error);
  }
};

module.exports.update_admin_profile = (req, res, next) => {
  try {
    role_check(req, res, () => {
      update_request_validation(req, res, () => {
        next();
      });
    });
  } catch (error) {
    end_error_result(res, error);
  }
};

module.exports.update_user_status = (req, res, next) => {
  try {
    role_check(req, res, () => {
      id_params_check(req, res, () => {
        const { error, value } =
          user_detail.user_status_update_data_schema.validate(req.body, {
            abortEarly: false,
          });

        if (error) {
          display.end_result(res, 500, {
            message: error.details.map((detail) => detail.message),
          });
          return;
        } else {
          next();
        }
      });
    });
  } catch (error) {
    end_error_result(res, error);
  }
};

module.exports.update_user_profile_image = async (req, res, next) => {
  try {
    const req_data = req.data;

    if (req_data.role != 0) {
      if (req.file && req.file.path) {
        try {
          await delete_image.delete(req.file.path, res);
        } catch (error) {
          display.end_result(res, err.status || 500, {
            message: error.message || "Some error occurred.",
          });
        }
      }

      display.end_result(res, 401, {
        message: "you do not have access for this page",
      });
    } else {
      next();
    }
  } catch (error) {
    end_error_result(res, error);
  }
};

module.exports.update_admin_profile_image = async (req, res, next) => {
  try {
    const req_data = req.data;

    if (req_data.role != 1) {
      if (req.file && req.file.path) {
        try {
          await delete_image.delete(req.file.path, res);
        } catch (error) {
          display.end_result(res, err.status || 500, {
            message: error.message || "Some error occurred.",
          });
        }
      }

      display.end_result(res, 401, {
        message: "you do not have access for this page",
      });
    } else {
      next();
    }
  } catch (error) {
    end_error_result(res, error);
  }
};

const end_error_result = (res, error) => {
  display.end_result(res, error.status || 500, {
    message: error.message || "Some error occurred.",
  });
};

module.exports.role_check = role_check;
