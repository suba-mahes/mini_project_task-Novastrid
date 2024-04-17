// test/users/.test.js
const db = require("../models/index.js");
const request = require('supertest');
const app = require('../app.js');

before(function(done) {
    db.sequelize.sync().then(() => {
        console.log('Sequelize models synced for testing\n');
        done();
    }).catch(done);
});

beforeEach(function(done){
    console.log("\nlet's start the test : ");
    done();
});

afterEach(function(done){
    console.log("---let's end the test---\n");
    done();
});

let password = "INSU@0418";
let user_token, admin_token;
let id;
const fake_id = 122;

describe('register a user', function() {
    const filePath = 'C:\\Users\\MY PC\\Desktop\\inba\\vietnam - flag.png';
    it('should register a user on post ', function(done) {

        request(app)
            .post(`/users/register`)
            .set('Content-Type', 'multipart/form-data')
            .attach('image', filePath)
            .field('email_id', 'prabakaraninba0@gmail.com')
            .field('password', 'Password@123')
            .field('first_name', 'suba')
            .field('last_name', 'inba')
            .field('gender', 'male')
            .field('d_o_b', '2001-01-01')
            .field('address[address1]', '1659 ewsb')
            .field('address[address2]', 'thb colon,villapuram')
            .field('address[city]', 'Madurai')
            .field('address[state]', 'Tamil nadu')
            .field('address[country]', 'Ind')
            .field('family_details[gardian_name]', 'inba')
            .field('family_details[mother_name]', 'kane')
            .field('family_details[gardian_occupation]', 'off')
            .field('family_details[mother_occupation]', 'hwhouse wife')
            .field('family_details[no_of_sibilings]', 4)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body; 
                id = result.user_id;
                if((!result.user_id || !result.email_id || !result.first_name || !result.last_name || !result.gender || !result.d_o_b || !result.image || !result.address.address1 || !result.address.address2 || !result.address.city || !result.address.state || !result.address.country || !result.family_details.gardian_name || !result.family_details.mother_name || !result.family_details.gardian_occupation || !result.family_details.mother_occupation)){
                    return done(new Error('error'));
                }
                
                done();
            });
    }).timeout(50000); 
    
    it('should register a user which is already registered on post ', function(done) {
        request(app)
            .post(`/users/register`)
            .set('Content-Type', 'multipart/form-data')
            .attach('image', filePath)
            .field('email_id', 'prabakaraninba0@gmail.com')
            .field('password', 'Password@123')
            .field('first_name', 'suba')
            .field('last_name', 'inba')
            .field('gender', 'male')
            .field('d_o_b', '2001-01-01')
            .field('address[address1]', '1659 ewsb')
            .field('address[address2]', 'thb colon,villapuram')
            .field('address[city]', 'Madurai')
            .field('address[state]', 'Tamil nadu')
            .field('address[country]', 'Ind')
            .field('family_details[gardian_name]', 'inba')
            .field('family_details[mother_name]', 'kane')
            .field('family_details[gardian_occupation]', 'off')
            .field('family_details[mother_occupation]', 'hwhouse wife')
            .field('family_details[no_of_sibilings]', 4)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                if (res.body.message !== "Already registerd email_id") {
                    return done(new Error('Already registerd email_id'));
                }
                done();
            });
    }).timeout(50000);
});

describe('users authentication process', function() {
    let token_to_reset_password;

    it('should login a user on post ', function(done) {

        const req_data = {
            "email_id" : "prabakaraninba0@gmail.com",
            "password" : "Password@123"
        }

        request(app)
            .post(`/users/login`)
            .send(req_data)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                if (res.body.message !== "logged in successfully") {
                    return done(new Error('logging is not successfull'));
                }
                user_token = res.body.token
                done();
            });
    }).timeout(50000);
    
    it('To work with forget password', function(done) {

        const req_data = {
            "email_id" : "xyz0@gmail.com",
        }

        request(app)
            .post(`/users/forget-password`)
            .send(req_data)
            .expect(404)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                if (res.body.message !== "no such user is registered") {
                    return done(new Error('error'));
                }

                done();
            });
    }).timeout(50000);

    it('To work with forget password', function(done) {

        const req_data = {
            "email_id" : "prabakaraninba0@gmail.com",
        }

        request(app)
            .post(`/users/forget-password`)
            .send(req_data)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                if (res.body.message !== "Email sent is OK") {
                    return done(new Error('forget password is not successfull'));
                }
                token_to_reset_password = res.body.token_to_reset_password
                done();
            });
    }).timeout(50000);

    it('To work with reset password', function(done) {

        const req_data = {
            "password" : "INSU@0418",
        }

        request(app)
            .post(`/users/reset-password`)
            .send(req_data)
            .set('Authorization', `Bearer ${token_to_reset_password}`)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                if (res.body.message !== "password is reseted in successfully") {
                    return done(new Error('reset password is not successfull'));
                }
                token_to_reset_password = res.body.token_to_reset_password
                done();
            });
    }).timeout(50000);

    it('logining  an user with wrong password ', function(done) {

        const req_data = {
            "email_id" : "prabakaraninba0@gmail.com",
            "password" : "Password@123"
        }

        request(app)
            .post(`/users/login`)
            .send(req_data)
            .expect(401)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                if (res.body.message !== "Invalid password") {
                    return done(new Error('Invalid password'));
                }
                user_token = res.body.token
                done();
            });
    });

});

describe('LOGIN for both USER and ADMIN ', function() {

    it('should login a user on post ', function(done) {

        const req_data = {
            "email_id" : "prabakaraninba0@gmail.com",
            "password" : password
        }

        request(app)
            .post(`/users/login`)
            .send(req_data)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                if (res.body.message !== "logged in successfully") {
                    return done(new Error('logging is not successfull'));
                }
                user_token = res.body.token
                done();
            });
    });

    it('should login a admin on post ', function(done) {

        const req_data = {
            "email_id" : "admin@gmail.com",
            "password" : "Admin@123"
        }

        request(app)
            .post(`/users/login`)
            .send(req_data)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                if (res.body.message !== "logged in successfully") {
                    return done(new Error('logging is not successfull'));
                }
                admin_token = res.body.token
                done();
            });
    });

});

describe('Whole working process on USER SIDE', function() {

    it("welcome page - (401-error token is not provided)", function(done){
        request(app)
            .get('/users/welcome')
            //.set('Authorization', `Bearer ${}`)
            .expect(401)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body; 
                if(result.message !== "Token not provided"){
                    return done(new Error('error'));
                }
                
                done();
            })
    });

    it("welcome page - login as a user (401 error - you do not have access for this page) ", function(done){
        request(app)
            .get('/users/welcome')
            .set('Authorization', `Bearer ${user_token}`)
            .expect(401)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body; 
                if(result.message !== "you do not have access for this page"){
                    return done(new Error('error'));
                }

                done();
            })
        });
    
    it("get-allusers page - (401-error token is not provided)", function(done){
        request(app)
            .get('/users/get-allusers')
            //.set('Authorization', `Bearer ${}`)
            .expect(401)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body; 
                if(result.message !== "Token not provided"){
                    return done(new Error('error'));
                }
                
                done();
            })
    });

    it("get-allusers page - (401-error token is not provided)", function(done){
        request(app)
            .get(`/users/get-user-by-id/${id}`)
            //.set('Authorization', `Bearer ${}`)
            .expect(401)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body; 
                if(result.message !== "Token not provided"){
                    return done(new Error('error'));
                }
                
                done();
            })
    });

    it('should return an array of users (401 error - you do not have access for this page) on GET ', function(done) {
        request(app)
            .get('/users/get-allusers')
            .set('Authorization', `Bearer ${user_token}`)
            .expect(401)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body; 
                if(result.message !== "you do not have access for this page"){
                    return done(new Error('error'));
                }

                done();
            });
    });
    
    it("profile page - after login", function(done){
        request(app)
            .get('/users/profile')
            .set('Authorization', `Bearer ${user_token}`)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }
                
                const result = res.body; 
                if(!result.user_id || !result.email_id || !result.first_name || !result.last_name || !result.gender || !result.d_o_b || !result.image || !result.address.address1 || !result.address.address2 || !result.address.city || !result.address.state || !result.address.country || !result.family_details.gardian_name || !result.family_details.mother_name || !result.family_details.gardian_occupation || !result.family_details.mother_occupation){
                    return done(new Error('error'));
                }
                               
                done();
            })
        });

    it('should return a user (401 error - you do not have access for this page) on GET ', function(done) {
        request(app)
            .get(`/users/get-user-by-id/${id}`)
            .set('Authorization', `Bearer ${user_token}`)
            .expect(401)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body; 
                if(result.message !== "you do not have access for this page"){
                    return done(new Error('error'));
                }

                done();
            });
    });


    //updating 
    it('should update a user on PUT ', function(done) {
        const req_data = {
            "first_name": "suba mahes",
            "last_name": "inba",
            "gender": "male",
            "d_o_b": "2001-01-01",
            "address": {
                "address1": "1659 ewsb",
                "address2": "thb colon,villapuram",
                "city": "Madurai",
                "state": "Tamil nadu",
                "country": "Ind"
            },
            "family_details":{
                "gardian_name": "inba",
                "mother_name": "kane",
                "gardian_occupation": "off",
                "mother_occupation": "hwhouse wife"
            }
        }
        request(app)
            .put(`/users/update-user/${id}`)
            .set('Authorization', `Bearer ${user_token}`)
            .send(req_data)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body.updated_user; 
                if(!result.user_id || !result.email_id || !result.first_name || !result.last_name || !result.gender || !result.d_o_b || !result.image || !result.address.address1 || !result.address.address2 || !result.address.city || !result.address.state || !result.address.country || !result.family_details.gardian_name || !result.family_details.mother_name || !result.family_details.gardian_occupation || !result.family_details.mother_occupation){
                    return done(new Error('updation is not successfull'));
                }

                done();
            });
    });

    //updating  (403 - error sorry you don't have the access to update other's details)
    it('should update a user (403 - error) on PUT ', function(done) {
        const req_data = {
            "first_name": "suba mahes",
            "last_name": "inba",
            "gender": "male",
            "d_o_b": "2001-01-01",
            "address": {
                "address1": "1659 ewsb",
                "address2": "thb colon,villapuram",
                "city": "Madurai",
                "state": "Tamil nadu",
                "country": "Ind"
            },
            "family_details":{
                "gardian_name": "inba",
                "mother_name": "kane",
                "gardian_occupation": "off",
                "mother_occupation": "hwhouse wife"
            }
        }
        request(app)
            .put(`/users/update-user/${fake_id}`)
            .set('Authorization', `Bearer ${user_token}`)
            .send(req_data)
            .expect(403)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body; 
                if(result.message !== "sorry you don't have the access to update other's details"){
                    return done(new Error('error'));
                }
                
                done();
            });
    });


    //updating the user's active status
    it('should update the active status of an user (401 error - you do not have access for this page) on PATCH method ', function(done) {
        const req_data = {
            "is_active": false
        }
        request(app)
            .patch(`/users/update-user-status/${id}`)
            .set('Authorization', `Bearer ${user_token}`)
            .send(req_data)
            .expect(401)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body; 
                if(result.message !== "you do not have access for this page"){
                    return done(new Error('error'));
                }

                done();
            });
    });

    //deleting
    it('should delete the user by id DELETE', function(done) {
        request(app)
            .delete(`/users/delete-user-by-id/${id}`)
            .set('Authorization', `Bearer ${user_token}`)
            .expect(401)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body; 
                if(result.message !== "you do not have access for this page"){
                    return done(new Error('error'));
                }

                done();
            });
    });
});


describe('unit tests with active status of user', function() {
    
    //updating the user's active status
    it('should update the active status of an user on admin side on PATCH method ', function(done) {
        const req_data = {
            "is_active": false
        }
        request(app)
            .patch(`/users/update-user-status/${id}`)
            .set('Authorization', `Bearer ${admin_token}`)
            .send(req_data)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body.updated_user; 
                if(!result.user_id || !result.email_id || !result.first_name || !result.last_name || !result.gender || !result.d_o_b || !result.image || !result.address.address1 || !result.address.address2 || !result.address.city || !result.address.state || !result.address.country || !result.family_details.gardian_name || !result.family_details.mother_name || !result.family_details.gardian_occupation || !result.family_details.mother_occupation){
                    return done(new Error('updation is not successfull'));
                }

                done();
            });
    });

    it('should login a user on post ', function(done) {

        const req_data = {
            "email_id" : "prabakaraninba0@gmail.com",
            "password" : password
        }

        request(app)
            .post(`/users/login`)
            .send(req_data)
            .expect(401)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                if (res.body.message !== "Can not login into a in-active user account") {
                    return done(new Error('error'));
                }
                user_token = res.body.token
                done();
            });
    });

    // //updating  (403 - error sorry you don't have the access to update these details)
    // it('should update a user (403 - error) on PUT ', function(done) {
    //     const req_data = {
    //         "first_name": "suba mahes",
    //         "last_name": "inba",
    //         "gender": "male",
    //         "d_o_b": "2001-01-01",
    //         "address": {
    //             "address1": "1659 ewsb",
    //             "address2": "thb colon,villapuram",
    //             "city": "Madurai",
    //             "state": "Tamil nadu",
    //             "country": "Ind"
    //         },
    //         "family_details":{
    //             "gardian_name": "inba",
    //             "mother_name": "kane",
    //             "gardian_occupation": "off",
    //             "mother_occupation": "hwhouse wife"
    //         }
    //     }
    //     request(app)
    //         .put(`/users/update-user/${id}`)
    //         .set('Authorization', `Bearer ${user_token}`)
    //         .send(req_data)
    //         .expect(403)
    //         .end(function(err, res) {
    //             if(err) return done(res.body || err);

    //             if (!res.body || typeof res.body !== 'object') {
    //                 return done(new Error('Response body is not an object'));
    //             }

    //             const result = res.body; 
    //             if(result.message !== "sorry you don't have the access to update these details"){
    //                 return done(new Error('error'));
    //             }
                
    //             done();
    //         });
    // });
    
});

describe('Whole working process on ADMIN SIDE', function() {

    it("welcome page - (401-error token is not provided)", function(done){
        request(app)
            .get('/users/welcome')
            //.set('Authorization', `Bearer ${}`)
            .expect(401)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body; 
                if(result.message !== "Token not provided"){
                    return done(new Error('error'));
                }
                
                done();
            })
    });

    it("profile page - after login", function(done){
        request(app)
            .get('/users/profile')
            .set('Authorization', `Bearer ${user_token}`)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }
                
                const result = res.body; 
                if(!result.user_id || !result.email_id || !result.first_name || !result.last_name || !result.gender || !result.d_o_b || !result.image || !result.address.address1 || !result.address.address2 || !result.address.city || !result.address.state || !result.address.country || !result.family_details.gardian_name || !result.family_details.mother_name || !result.family_details.gardian_occupation || !result.family_details.mother_occupation){
                    return done(new Error('error'));
                }
                               
                done();
            })
    });

    it("welcome page - login", function(done){
        request(app)
            .get('/users/welcome')
            .set('Authorization', `Bearer ${admin_token}`)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!Array.isArray(res.body)) {
                    return done(new Error('Response body is not an array'));
                }
                
                for(const result of res.body){
                    if(!result.user_id || !result.email_id || !result.first_name || !result.last_name || !result.gender || !result.d_o_b || !result.image || !result.address.address1 || !result.address.address2 || !result.address.city || !result.address.state || !result.address.country || !result.family_details.gardian_name || !result.family_details.mother_name || !result.family_details.gardian_occupation || !result.family_details.mother_occupation){
                        return done(new Error('error'));
                    }
                }               
                done();
            })
        });
    
    it("get-allusers page - (401-error token is not provided)", function(done){
        request(app)
            .get('/users/get-allusers')
            //.set('Authorization', `Bearer ${}`)
            .expect(401)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body; 
                if(result.message !== "Token not provided"){
                    return done(new Error('error'));
                }
                
                done();
            })
    });

    it("get-allusers page - (401-error token is not provided)", function(done){
        request(app)
            .get(`/users/get-user-by-id/${id}`)
            //.set('Authorization', `Bearer ${}`)
            .expect(401)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body; 
                if(result.message !== "Token not provided"){
                    return done(new Error('error'));
                }
                
                done();
            })
    });

    it('should return an array of users on GET ', function(done) {
        request(app)
            .get('/users/get-allusers')
            .set('Authorization', `Bearer ${admin_token}`)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!Array.isArray(res.body)) {
                    return done(new Error('Response body is not an array'));
                }
                for(const result of res.body){
                    if(!result.user_id || !result.email_id || !result.first_name || !result.last_name || !result.gender || !result.d_o_b || !result.image || !result.address.address1 || !result.address.address2 || !result.address.city || !result.address.state || !result.address.country || !result.family_details.gardian_name || !result.family_details.mother_name || !result.family_details.gardian_occupation || !result.family_details.mother_occupation){
                        return done(new Error('something is missing'));
                    }
                }
                done();
            });
    });
    

    it('should return a user on GET ', function(done) {
        request(app)
            .get(`/users/get-user-by-id/${id}`)
            .set('Authorization', `Bearer ${admin_token}`)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                if (res.body.user_id !== id) {
                    return done(new Error('User ID in response does not match requested ID'));
                }

                const result = res.body; 
                if(!result.user_id || !result.email_id || !result.first_name || !result.last_name || !result.gender || !result.d_o_b || !result.image || !result.address.address1 || !result.address.address2 || !result.address.city || !result.address.state || !result.address.country || !result.family_details.gardian_name || !result.family_details.mother_name || !result.family_details.gardian_occupation || !result.family_details.mother_occupation){
                    return done(new Error('something went wrong'));
                }
                done();
            });
    });


    //updating
    it('should update a user on PUT ', function(done) {
        const req_data = {
            "first_name": "suba mahes",
            "last_name": "inba",
            "gender": "male",
            "d_o_b": "2001-01-01",
            "address": {
                "address1": "1659 ewsb",
                "address2": "thb colon,villapuram",
                "city": "Madurai",
                "state": "Tamil nadu",
                "country": "Ind"
            },
            "family_details":{
                "gardian_name": "inba",
                "mother_name": "kane",
                "gardian_occupation": "off",
                "mother_occupation": "hwhouse wife"
            }
        }
        request(app)
            .put(`/users/update-user/${id}`)
            .set('Authorization', `Bearer ${admin_token}`)
            .send(req_data)
            .expect(403)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                if (res.body.message !== "sorry you don't have the access to update user's details") {
                    return done(new Error('error'));
                }

                done();
            });
    });


    //deleting
    it('should delete the user by id DELETE', function(done) {
        request(app)
            .delete(`/users/delete-user-by-id/${id}`)
            .set('Authorization', `Bearer ${admin_token}`)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                if (res.body.message !== "deleted successfully") {
                    return done(new Error('deletion is not successfull'));
                }

                done();
            });
    });

    //deleting (404-error user is not found)
    it('should delete the user by id (404-error user is not found) DELETE', function(done) {
        request(app)
            .delete(`/users/delete-user-by-id/${id}`)
            .set('Authorization', `Bearer ${admin_token}`)
            .expect(400)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                if (res.body.message !== "user is not found") {
                    return done(new Error('deletion is not successfull'));
                }

                done();
            });
    });

    //getting by ID (404-error user is not found)
    it('should return a user (404-error user is not found) on GET ', function(done) {
        request(app)
            .get(`/users/get-user-by-id/${id}`)
            .set('Authorization', `Bearer ${admin_token}`)
            .expect(400)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                if (res.body.message !== "user is not found") {
                    return done(new Error('error'));
                }

                done();
            });
    });
    
    //updating the user's active status (404-error user is not found)
    it('should update the active status of an user (404-error user is not found) on PATCH method ', function(done) {
        const req_data = {
            "is_active": false
        }
        request(app)
            .patch(`/users/update-user-status/${id}`)
            .set('Authorization', `Bearer ${admin_token}`)
            .send(req_data)
            .expect(400)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                if (res.body.message !== "user is not found") {
                    return done(new Error('error'));
                }

                done();
            });
    });

});