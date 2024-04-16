const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');

const db = require("../models/index.js");
const user = db.user;
const user_address = db.user_address;
const user_family = db.user_family;

var display = require("../controllers/result_display.js");
const config = require("../config/config.json")


module.exports.login = async(req,res) =>{
    try{
        const user_data = req.body;

        const data = await user.findOne({
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
            
            const token = jwt.sign({ email_id:data.email_id, role:data.role, is_active:data.is_active, user_id:data.user_id }, config.secret_key, { expiresIn: '1h' });
            
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

        const data = await user.findAll({
            attributes: { exclude: ['password','role'] },
            where : {
                role : 0,
            },
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
        });
        
        for(val of data){
            val.image =val.image.toString()
            //val.image =val.image.toString('base64')
        }
        
        display.end_result(res,200,data);  
        return;         
    }
    catch(error){
        display.end_result(res,500,{"message": error.message});
    }
};

module.exports.forget_password = async(req,res) =>{
    try{
        const email_id = req.body.email_id;

        ///const token = jwt.sign({ email_id:data.email_id, role:data.role, is_active:data.is_active, user_id:data.user_id }, config.secret_key, { expiresIn: '1h' });

        const token = jwt.sign({ email_id:email_id }, config.secret_key, { expiresIn: '1h' });

        const reset_link = `${req.protocol}://${req.get('host')}/reset-password?token=${token}`;
        console.log(reset_link);

        const transporter = nodemailer.createTransport(config.mail_details);
        const email_template = fs.readFileSync(config.email_template_path, 'utf8');
        const compiled_template = ejs.compile(email_template);
        

        const mailOptions = {
            from: 'insu041831@gmail.com',
            to: email_id,
            subject: 'Mail to for Reseting Password',
            html: compiled_template({"reset_link": reset_link})
        };
    
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                display.end_result(res,500,{"message": error});
            } else {
                const result = info.response.split(' ');
                display.end_result(res,200,{"message": `Email sent is ${result[2]}`,"token_to_reset_password":token });
            }
        });
    //    display.end_result(res,200,{"message": `Email sent is OK`,"token_to_reset_password":token });

    }
    catch(error){
        display.end_result(res,500,{"message": error.message});
    }
};

module.exports.reset_password = async(req,res) =>{
    try{
        const req_data = req.data;
        let password = req.body.password;

        const data = await user.findOne({
            where: {
                email_id : req_data.email_id,
            },
        });
        
        if(data){
            const hashed_password = await bcrypt.hash(password,10);
            password = hashed_password;   

            await data.update({password: password});
            await data.save();

//            const token = jwt.sign({ email_id:data.email_id, role:data.role, user_id:data.user_id }, config.secret_key, { expiresIn: '1h' });

            const login_url = `${req.protocol}://${req.get('host')}/login`;
            
            display.end_result(res,200,{'message':"password is reseted in successfully","login_url": login_url });
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