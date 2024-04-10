const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require("../model/index.js");
const auth = db.auth;
const user = db.user;
const user_address = db.user_address;
const user_family = db.user_family;

var display = require("../result_display.js");
var secret_key = require("../config/config_auth.js");

module.exports.login = async(req,res) =>{
    try{
        const user_data = req.body;

        const data = await auth.findOne({
            where: {
                email_id : user_data.email_id,
            },
            });
        
        if(data){
            const passwordMatch = await bcrypt.compare(user_data.password, data.password);
            
            if (!passwordMatch) {
                display.end_result(res,401,{"message":'Invalid password'});  
                return;
            }
            
            const token = jwt.sign({ auth_id: data.auth_id, email_id:data.email_id, role:data.role }, secret_key, { expiresIn: '1h' });
            
            display.end_result(res,200,{'message':"logged in successfully" ,'token':token});
        }
        else{
            display.end_result(res,404,{"message":'user is not found'});  
            return
        }
    }
    catch(error){
        display.end_result(res,500,{"message": error.message});
    }
};

module.exports.welcome = async(req,res) =>{
    try{
        const req_data = req.data;

        if(req_data.role == 1){
            const data = await user.findAll({include: [
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
              ]
            });
            display.end_result(res,200,data);  
            return;
        }
        else{
            display.end_result(res,200,{"message": "you do not have access for this page"});  
            return;
        }          
    }
    catch(error){
        display.end_result(res,500,{"message": error.message});
    }
};