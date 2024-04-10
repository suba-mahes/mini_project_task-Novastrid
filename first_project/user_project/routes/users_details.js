var express = require('express');
const users_detail = require('../controllers/user_details.js');
var auth = require('../controllers/auth.js');

var auth_validation = require('../middlewares/auth.js')
var validation = require('../middlewares/validation_user_create.js');

var router = express.Router();

router.post('/login',auth_validation.login, auth.login);
router.get('/welcome', auth_validation.authenticate_token, auth.welcome);

// router.post('/register', auth_validation.reqister, auth.register);
// router.get('/get-allusers',auth_validation.authenticate_token,users_detail.findAll);
// router.get('/get-user-by-id/:id',auth_validation.authenticate_token,users_detail.findID);
// router.post('/insert-user', validation.validation_user_detail, users_detail.create);
// router.put('/update-user/:id',auth_validation.authenticate_token, users_detail.update);
// router.delete('/delete-user-by-id/:id',auth_validation.authenticate_token,users_detail.deleteByID);


module.exports = router;
