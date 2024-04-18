const jwt = require('jsonwebtoken');

const config = require("../config/config.json")

var auth = require("../validation/auth_schema.js")
var register = require('../validation/user_detail_schema.js')

var delete_image = require("../middlewares/delete_image_file.js")

var display = require("../controllers/result_display.js");


module.exports.login = async(req, res, next)=>{
    const { error, value } =  auth.login_schema.validate(req.body, { abortEarly: false });
    
    if(error){
        display.end_result(res,500,{"message": error.details.map(detail => detail.message)});
        return;
    }
    next();
}

module.exports.reqister = async(req, res, next)=>{
    const { error, value } =  register.user_details_data_schema.validate(req.body, { abortEarly: false });
    
    if(error){
        display.end_result(res,500,{"message": error.details.map(detail => detail.message)});
        return;
    }
    next();
}

module.exports.forget_password = async(req, res, next)=>{
    const { error, value } =  auth.forget_password_schema.validate(req.body, { abortEarly: false });
    
    if(error){
        display.end_result(res,500,{"message": error.details.map(detail => detail.message)});
        return;
    }
    next();
}

module.exports.reset_password = async(req, res, next)=>{
    const { error, value } =  auth.reset_password_schema.validate(req.body, { abortEarly: false });
    
    if(error){
        display.end_result(res,500,{"message": error.details.map(detail => detail.message)});
        return;
    }
    next();
}

module.exports.authenticate_token = async(req, res, next)=>{
    const auth_header = req.headers['authorization'];
    const token = auth_header && auth_header.split(' ')[1];

    if(!token){
        display.end_result(res,401,{"message": "Token not provided"});

        if(!req.file.path){
            return;
        }
        else{
            await delete_image.delete(req.file.path);
            return;
        }
    }
    
    jwt.verify(token, config.secret_key, async(err, decoded) => {
        if (err) {
            display.end_result(res,403,{"message": "Token is not valid"});

            if(!req.file.path){
                return;
            }
            else{
                await delete_image.delete(req.file.path);
                return;
            }
        }
        req.data = decoded;
        next();
    });
}