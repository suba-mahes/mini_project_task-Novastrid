const jwt = require('jsonwebtoken');

const config = require("../config/config.json")

const auth = require("../validation/auth_schema.js")
const register = require('../validation/user_detail_schema.js')

const delete_image = require("../middlewares/delete_image_file.js")

const display = require("../controllers/result_display.js");


module.exports.login = (req, res, next) => {
    try {
        const { error, value } = auth.login_schema.validate(req.body, { abortEarly: false });

        if (error) {
            display.end_result(res, 500, { "message": error.details.map(detail => detail.message) });
            return;
        }
        next();
    }
    catch (error) {
        display.end_result(res, error.status || 500, { "message": error.message || "Some error occurred." });
    }
}

module.exports.reqister = (req, res, next) => {
    try {
        const { error, value } = register.user_details_data_schema.validate(req.body, { abortEarly: false });

        if (error) {
            display.end_result(res, 500, { "message": error.details.map(detail => detail.message) });
            return;
        }
        next();
    }
    catch (error) {
        display.end_result(res, error.status || 500, { "message": error.message || "Some error occurred." });
    }
}

module.exports.forget_password = (req, res, next) => {
    try {
        const { error, value } = auth.forget_password_schema.validate(req.body, { abortEarly: false });

        if (error) {
            display.end_result(res, 500, { "message": error.details.map(detail => detail.message) });
            return;
        }
        next();
    }
    catch (error) {
        display.end_result(res, error.status || 500, { "message": error.message || "Some error occurred." });
    }
}

module.exports.reset_password = (req, res, next) => {
    try {
        const { error, value } = auth.reset_password_schema.validate(req.body, { abortEarly: false });

        if (error) {
            display.end_result(res, 500, { "message": error.details.map(detail => detail.message) });
            return;
        }
        next();
    }
    catch (error) {
        display.end_result(res, error.status || 500, { "message": error.message || "Some error occurred." });
    }
}

module.exports.authenticate_token = async (req, res, next) => {
    try {
        const auth_header = req.headers['authorization'];
        const token = auth_header && auth_header.split(' ')[1];

        if (!token) {
            display.end_result(res, 401, { "message": "Token not provided" });

            if (req.file && req.file.path) {
                try {
                    await delete_image.delete(req.file.path, res);
                }
                catch (error) {
                    display.end_result(res, err.status || 500, { "message": error.message || "Some error occurred." });
                }
            }
            return;
        }

        jwt.verify(token, config.secret_key, async (err, decoded) => {
            if (err) {
                display.end_result(res, 403, { "message": "Token is not valid" });

                if (req.file && req.file.path) {
                    try {
                        await delete_image.delete(req.file.path, res);
                    }
                    catch (error) {
                        display.end_result(res, err.status || 500, { "message": error.message || "Some error occurred." });
                    }
                }
                return;
            }
            req.data = decoded;
            next();
        });
    }
    catch (error) {
        display.end_result(res, error.status || 500, { "message": error.message || "Some error occurred." });
    }
}