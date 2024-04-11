var display = require("../controllers/result_display.js");


module.exports.update_validation = (req, res, next)=>{
    const invalid_fields = ["email_id" ,"password", "role"];
    const error = [];
    
    for(invalid_field of invalid_fields){
        if(Object.keys(req.body).includes(invalid_field)){
            error.push(invalid_field);
        }
    }
    display.end_result(res,400,{"error_message": "Invalid request","message": `the request contains ${error}`});
    return;
    next();
}