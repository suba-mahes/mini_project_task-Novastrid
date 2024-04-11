var express = require('express');
const users_detail = require('../controllers/user_details.js');
var auth = require('../controllers/auth.js');

var auth_validation = require('../middlewares/auth.js');
var upload = require("../middlewares/multer_middleware.js");
var user_details_middlewaer = require("../middlewares/user_details.js")

var router = express.Router();

router.post('/login',auth_validation.login, auth.login);
router.get('/welcome', auth_validation.authenticate_token, user_details_middlewaer.role_check, auth.welcome);

router.post('/register', auth_validation.reqister, upload.single('image'), users_detail.register);
router.get('/get-allusers',auth_validation.authenticate_token, user_details_middlewaer.role_check, users_detail.findAll);
router.get('/get-user-by-id/:id',auth_validation.authenticate_token, user_details_middlewaer.id_params_check,user_details_middlewaer.role_check, users_detail.findID);


router.put('/update-user/:id', auth_validation.authenticate_token, user_details_middlewaer.id_params_check, user_details_middlewaer.update_user, users_detail.update);
router.delete('/delete-user-by-id/:id',auth_validation.authenticate_token,user_details_middlewaer.id_params_check, user_details_middlewaer.delete_user , users_detail.deleteByID);


module.exports = router;
