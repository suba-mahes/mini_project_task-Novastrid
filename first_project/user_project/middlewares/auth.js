const jwt = require('jsonwebtoken');

var secret_key = require("../config/config_auth.js");
var login = require("../validation/login.js")
var register = require('../validation/user_detail_schema.js')
var display = require("../controllers/result_display.js");


module.exports.login = (req, res, next)=>{
    const { error, value } =  login.login_schema.validate(req.body, { abortEarly: false });
    
    if(error){
        display.end_result(res,500,{"message": error.details.map(detail => detail.message)});
        return;
    }
    next();
}

module.exports.reqister = (req, res, next)=>{
    const { error, value } =  register.user_details_data_schema.validate(req.body.data, { abortEarly: false });
    
    if(error){
        display.end_result(res,500,{"message": error.details.map(detail => detail.message)});
        return;
    }
    next();
}

module.exports.authenticate_token = (req, res, next)=>{
    const auth_header = req.headers['authorization'];
    const token = auth_header && auth_header.split(' ')[1];

    if(!token){
        display.end_result(res,401,{"message": "Token not provided"});
        return;
    }
    
    jwt.verify(token, secret_key, (err, decoded) => {
        if (err) {
            display.end_result(res,403,{"message": "Token is not valid"});
            return;
        }
        req.data = decoded;
        next();
    });
}