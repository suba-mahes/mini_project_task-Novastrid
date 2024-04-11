var user_detail = require('../validation/user_detail_schema.js')

var validation = require('../validation/validation_for_update.js')
var display = require("../controllers/result_display.js");

module.exports.role_check = (req, res, next)=>{
    const req_data = req.data;
    if(req_data.role != 1){
        display.end_result(res,200,{"message": "you do not have access for this page"});  
        return;  
    }
    next();
}

module.exports.id_params_check = (req, res, next)=>{
    let id = parseInt(req.params.id);
    if(!id){
      display.end_result(res,404,{"message":'parameter is empty'});  
      return;
    }
    next();
}


module.exports.update_user = (req, res, next)=>{
    let id = parseInt(req.params.id);
    const req_data = req.data;
    const user_data = req.body;
    const error =  validation.update_validation(req.body);
    console.log(error)
    
    if(error.length){
        display.end_result(res,400,{"error_message": "Invalid request","message": `the request contains ${error}`});
        return;
    }

    if(req_data.role == 0){
      
      if(Object.keys(user_data).includes("is_active")){
        display.end_result(res,403,{"message": "sorry you don't have the access to update these details"});
        return;
      }
      
      if(req_data.user_id != id){
        display.end_result(res,403,{"message": "sorry you don't have the access to update other's details"});
        return;
      }
    }
    next();
}

module.exports.delete_user = (req, res, next)=>{

    let id = parseInt(req.params.id);
    const req_data = req.data;
    console.log(req_data.user_id);
    if(req_data.role == 0 && req_data.user_id != id){
        display.end_result(res,403,{"message": "sorry you don't have the access to delete other's details"});
        return;
    }
    next();
}


module.exports.update_user_status = (req, res, next)=>{
  const { error, value } =  user_detail.user_status_update_data_schema.validate(req.body.data, { abortEarly: false });
  
  if(error){
      display.end_result(res,500,{"message": error.details.map(detail => detail.message)});
      return;
  }
  next();
}