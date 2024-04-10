const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require("../../model/index.js");
const auth = db.auth;
const user = db.user;

var display = require("../result_display.js");
var secret_key = require("../../config/config_auth.js");

module.exports.register = async(req,res) =>{
    try{
        const user_data = req.body;
        const hashed_password = await bcrypt.hash(user_data.password,10);
        user_data.password = hashed_password;

        const data = await auth.findOne({
            where: {
              email_id : user_data.email_id,
            },
        });
      
        if(data){
            display.end_result(res,200,{'message':"Already registerd email_id"});
            return;
        }
        
        const auth_data = await auth.create({...user_data});

        if(auth_data){
            
            const token = jwt.sign({ auth_id: auth_data.auth_id,email_id :auth_data.email_id }, secret_key, { expiresIn: '1h' });

            display.end_result(res,200,{'message':"registered successfully" , 'token':token});
        }
        else{
            display.end_result(res,404,{"message":"registeration failed"});
        }
    }
    catch(error){
        display.end_result(res,500,{"message": error.message})
    }
};


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
            
            const token = jwt.sign({ auth_id: data.auth_id, email_id:data.email_id }, secret_key, { expiresIn: '1h' });
            
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
        const email_id = req.email_id;

        const data = await user.findOne({
            where: {
                email_id : email_id,
            },
        });
        if(data){
            display.end_result(res,200,data);  
            return;
        }
        else{
            const data = await auth.findOne({
                where: {
                    email_id : email_id,
                },
            });
            
            if(data){
                display.end_result(res,200,{"name":data.name,"message":data.name+' Please fill up other details'});  
                return
            }
            else{
                display.end_result(res,404,{"message":'user is not found'});  
                return
            }
        }          
    }
    catch(error){
        display.end_result(res,500,{"message": error.message});
    }
};