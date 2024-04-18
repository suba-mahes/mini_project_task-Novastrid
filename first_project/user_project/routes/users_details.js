var express = require('express');
const users_detail = require('../controllers/user_details.js');
var auth = require('../controllers/auth.js');

var auth_validation = require('../middlewares/auth.js');
var upload = require("../middlewares/multer_middleware.js");
var user_details_middleware = require("../middlewares/user_details.js")

var router = express.Router();

router.post('/login',auth_validation.login, auth.login);
router.get('/welcome', auth_validation.authenticate_token, user_details_middleware.role_check, auth.welcome);


router.get('/profile', auth_validation.authenticate_token, users_detail.profile);


router.post('/forget-password',auth_validation.forget_password, auth.forget_password);
router.post('/reset-password', auth_validation.reset_password, auth_validation.authenticate_token, auth.reset_password);


router.post('/register', upload.single('image'), auth_validation.reqister, users_detail.register);


router.get('/get-allusers',auth_validation.authenticate_token, user_details_middleware.role_check, users_detail.findAll);
router.get('/get-user-by-id/:id',auth_validation.authenticate_token, user_details_middleware.id_params_check,user_details_middleware.role_check, users_detail.findID);


router.put('/update-user/:id', auth_validation.authenticate_token, user_details_middleware.id_params_check, user_details_middleware.update_user, users_detail.updateByID);


router.put('/update-user-profile', auth_validation.authenticate_token, user_details_middleware.user_role_check, user_details_middleware.update_request_validation, users_detail.updateProfile);
router.put('/update-admin-profile', auth_validation.authenticate_token, user_details_middleware.role_check, user_details_middleware.update_request_validation, users_detail.updateProfile);


router.put('/update-user-profile-image', auth_validation.authenticate_token, user_details_middleware.user_role_check, upload.single('image'), users_detail.updateProfileImage);


router.delete('/delete-user-by-id/:id',auth_validation.authenticate_token,user_details_middleware.id_params_check, user_details_middleware.role_check , users_detail.deleteByID);


router.patch('/update-user-status/:id', auth_validation.authenticate_token, user_details_middleware.id_params_check,user_details_middleware.role_check, user_details_middleware.update_user_status, users_detail.updateStatus);

module.exports = router;
