// test/users/.test.js
const db = require("../models/index.js");

//const {expect} = require('expect');
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


describe('unit tests with active status of user', function() {
    let user_token, admin_token;
    let id = 14;

    it('should login a admin on post ', function(done) {

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

    it('should return a user by ID in admin side on GET ', function(done) {
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

    it('should login a admin on post ', function(done) {

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
            .put(`/users/update-user/${id}`)
            .set('Authorization', `Bearer ${user_token}`)
            .send(req_data)
            .expect(403)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body; 
                if(result.message !== "sorry you don't have the access to update these details"){
                    return done(new Error('error'));
                }
                
                done();
            });
    });

    //deleting (403 - error sorry you don't have the access to delete other's details)
    it('should delete the user (403 - error) by id DELETE', function(done) {
        request(app)
            .delete(`/users/delete-user-by-id/${id}`)
            .set('Authorization', `Bearer ${user_token}`)
            .expect(403)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body; 
                if(result.message !== "sorry you don't have the access to delete these details"){
                    return done(new Error('error'));
                }

                done();
            });
    });
    
});
