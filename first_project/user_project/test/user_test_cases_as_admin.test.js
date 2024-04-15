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


describe('login as admin and whole working process', function() {
    let user_token;
    let id = 7;

    it('logining  a admin with wrong password ', function(done) {

        const req_data = {
            "email_id" : "admin@gmail.com",
            "password" : "insu@123"
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
                user_token = res.body.token
                done();
            });
    });

    it("welcome page - login", function(done){
        request(app)
            .get('/users/welcome')
            .set('Authorization', `Bearer ${user_token}`)
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
            .set('Authorization', `Bearer ${user_token}`)
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
            .set('Authorization', `Bearer ${user_token}`)
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

    //updating the user's active status
    it('should update the active status of an user on PATCH method ', function(done) {
        const req_data = {
            "is_active": false
        }
        request(app)
            .patch(`/users/update-user-status/${id}`)
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

    //deleting
    it('should delete the user by id DELETE', function(done) {
        request(app)
            .delete(`/users/delete-user-by-id/${id}`)
            .set('Authorization', `Bearer ${user_token}`)
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
            .set('Authorization', `Bearer ${user_token}`)
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
            .set('Authorization', `Bearer ${user_token}`)
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
    
    //updating - 404
    it('should update a user (404-error user is not found) on PUT ', function(done) {
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
            .set('Authorization', `Bearer ${user_token}`)
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
