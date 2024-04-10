const bcrypt = require('bcrypt');

const db = require("../models/index.js");
const user = db.user;
const user_address = db.user_address;
const user_family = db.user_family;


var display = require("../controllers/result_display.js");


exports.register = async(req, res) => {
  try{
    const user_data = req.body;

    const hashed_password = await bcrypt.hash(user_data.password,10);
    user_data.password = hashed_password;
    user_data.role = 0;
    user_data.is_active = 1

    const check_data = await user.findOne({
        where: {
          email_id : user_data.email_id,
        },
    });
  
    if(check_data){
        display.end_result(res,200,{'message':"Already registerd email_id"});
        return;
    }

    const data = await user.create(user_data,
      {
        include: [
          {
            model: user_address, 
            as: 'address',
            required: true
          },
          {
            model: user_family,
            as: 'family_details', 
            required: true
          }
        ],
      }
    );

    const responseData = { ...data.get({ plain: true }) };
    const { password, role, ...new_data } = responseData;
    if(new_data){
        display.end_result(res,200,new_data);
      }
    else{
        display.end_result(res,404,{"message":"registeration failed"});
      }
  }
  catch(err){
    display.end_result(res,err.status  || 500,{"message": err.message || "Some error occurred while creating the user."})
  }
};


exports.findAll = async(req,res) => {
  try{
    const data = await user.findAll({include: user_address});
    if(data){
      display.end_result(res,200,data);  
    }
    else{
      display.end_result(res,200,{'user': data, 'message': 'table is empty'});
      return;
    }
  }
  catch(err){
    display.end_result(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving users."})
    return;
  }
};

exports.findID = async(req,res) => {
  try{
    let id = parseInt(req.params.id); 

    if(!id){
      display.end_result(res,404,{"message":'parameter is empty'});  
      return;
    }

    const data = await user.findOne({
      where: {
        user_id : id,
      },
      include : user_address
    });

    if(data){
      display.end_result(res,200,data);  
      return;
    }
    else{
        display.end_result(res,404,{"message":'user is not found'});  
        return;
    }
  }
  catch(err){
    display.end_result(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving users."})
  }
};


exports.update = async(req,res) =>{
  try{
    let id = parseInt(req.params.id);
    
    const user_data = req.body;

    const data = await user.findByPk(id);
    
    if(data){

      //user_data.updatedAt = new Date().toJSON().slice(0, 10);
      await data.update(user_data);

      if(!req.body.address){
        const result = await user.findByPk(id,{ include : user_address });
        display.end_result(res,200,{"message": "Updated sucessfully","updated_user":result});
        return;
      }

      const user_address_data = req.body.address;
      user_address_data.updatedAt = new Date().toJSON().slice(0, 10);

      const address = await user_address.findOne({ where: { user_id: id } });

      if(address){
        await address.update(user_address_data);
      }
      else{
        display.end_result(res,400,{"message": "user address not found"});
        return;
      }
      const result = await user.findByPk(id,{ include : user_address });
      display.end_result(res,200,{"message": "Updated sucessfully","updated_user":result});
    }
    else{
      display.end_result(res,400,{"message": "user not found"});
    }
  }
  catch(err){
    display.end_result(res,err.status  || 500,{"message": err.message || "Some error occurred while updating the user."})
  }
};

exports.deleteByID = async(req,res) =>{
  try{
    let id = parseInt(req.params.id);
    
    if(!id){
      display.end_result(res,404,{"message":'parameter is empty'});  
      return;
    }

    data = await user.findByPk(id)
    if(data){
      const address = await user_address.findOne({ where: { user_id: id } });
      if(address){
        await address.destroy();
      }    
      await data.destroy();
      display.end_result(res,200,{"message": "deleted successfully"});
      return;
    }
    else{
      display.end_result(res,404,{"message": "user not found"});
      return
    }
  }
  catch(err){
        display.end_result(res,err.status  || 500,{"message": err.message || "Some error occurred while deleting the user."})
  }
};

// module.exports.register = async(req,res) =>{
//   try{
//       const user_data = req.body;
//       const hashed_password = await bcrypt.hash(user_data.password,10);
//       user_data.password = hashed_password;

//       const data = await auth.findOne({
//           where: {
//             email_id : user_data.email_id,
//           },
//       });
    
//       if(data){
//           display.end_result(res,200,{'message':"Already registerd email_id"});
//           return;
//       }
      
//       const auth_data = await auth.create({...user_data});

//       if(auth_data){
          
//           const token = jwt.sign({ auth_id: auth_data.auth_id,email_id :auth_data.email_id }, secret_key, { expiresIn: '1h' });

//           display.end_result(res,200,{'message':"registered successfully" , 'token':token});
//       }
//       else{
//           display.end_result(res,404,{"message":"registeration failed"});
//       }
//   }
//   catch(error){
//       display.end_result(res,500,{"message": error.message})
//   }
// };
