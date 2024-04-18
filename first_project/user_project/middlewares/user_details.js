const user_detail = require('../validation/user_detail_schema.js')
const delete_image = require("../middlewares/delete_image_file.js")

const validation = require('../validation/validation_for_update.js')
const display = require("../controllers/result_display.js");

module.exports.role_check = (req, res, next)=>{
    const req_data = req.data;
    if(req_data.role != 1){
        display.end_result(res,401,{"message": "you do not have access for this page"});  
        return;  
    }
    next();
}

module.exports.user_role_check = async(req, res, next)=>{
  const req_data = req.data;
  
  if(req_data.role != 0){
    if (req.file && req.file.path) {
      try {
        console.log("hai")
        await delete_image.delete(req.file.path,res);
      }
  
      catch(error){
        display.end_result(res,err.status  || 500,{"message": error.message || "Some error occurred."});
      }
    }
    display.end_result(res,401,{"message": "you do not have access for this page"});  
    return;
  }
  next();
}

module.exports.id_params_check = (req, res, next)=>{
    let id = parseInt(req.params.id);
    if(!id){
      display.end_result(res,403,{"message":'parameter is empty'});  
      return;
    }
    next();
}

module.exports.update_request_validation = (req, res, next)=>{
  const error =  validation.update_validation(req.body);
  
  if(error.length){
      display.end_result(res,400,{"error_message": "Invalid request","message": `the request contains ${error}`});
      return;
  }
  next();
}

module.exports.update_user = (req, res, next)=>{
    let id = parseInt(req.params.id);
    const req_data = req.data;
 
    if(req_data.role == 0){ 

      const error =  validation.update_validation(req.body);

      if(error.length){
          display.end_result(res,400,{"error_message": "Invalid request","message": `the request contains ${error}`});
          return;
      }

      if(req_data.user_id != id){
        display.end_result(res,403,{"message": "sorry you don't have the access to update other's details"});
        return;
      }
    }
    else{
      display.end_result(res,403,{"message": "sorry you don't have the access to update user's details"});
      return;
    }
    next();
}



module.exports.update_user_status = (req, res, next)=>{
  const { error, value } =  user_detail.user_status_update_data_schema.validate(req.body, { abortEarly: false });
  
  if(error){
      display.end_result(res,500,{"message": error.details.map(detail => detail.message)});
      return;
  }
  next();
}