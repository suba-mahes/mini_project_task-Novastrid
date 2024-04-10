var express = require('express');
const users_detail = require('../controllers/user_details.js');
var auth = require('../controller/auth.js');

var auth_validation = require('../middlewares/auth.js')
var validation = require('../middlewares/validation_user_create.js');
var validation_update = require('../middlewares/validation_user_update.js');

var router = express.Router();

router.post('/login',auth_validation.login, auth.login);
router.post('/register', auth_validation.reqister, auth.register);
router.get('/welcome', auth_validation.authenticate_token, auth.welcome);

router.get('/get-allusers',users_detail.findAll);
router.get('/get-user-by-id/:id',users_detail.findID);
router.post('/insert-user', validation.validation_user_detail, users_detail.create);
router.put('/update-user/:id',validation_update.validation_user_detail, users_detail.update);
router.delete('/delete-user-by-id/:id',users_detail.deleteByID);


module.exports = router;
