var display = require("../controllers/result_display.js");


module.exports.update_validation = (data)=>{
    const invalid_fields = ["email_id" ,"password", "role", "is_active"];
    const error = [];
    
    for(invalid_field of invalid_fields){
        if(Object.keys(data).includes(invalid_field)){
            error.push(invalid_field);
        }
    }
    return error;
}