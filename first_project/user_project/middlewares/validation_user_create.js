//var user_schema = require("../validation/user_schema.js")
var user_detail_schema = require('../validation/user_detail_schema.js')
var display = require("../controllers/result_display.js");


module.exports.validation_user = (req, res, next)=>{
    const { error, value } =  user_schema.user_data_schema.validate(req.body, { abortEarly: false });
    
    if(error){
        display.end_result(res,500,{"message": error.details.map(detail => detail.message)});
        return;
    }
    next();
}

module.exports.validation_user_detail = (req, res, next)=>{
    const { error, value } = user_detail_schema.user_details_data_schema.validate(req.body, { abortEarly: false });
    if(error){
        display.end_result(res,500,{"message": error.details.map(detail => detail.message)});
        return;
    }
    next();
}