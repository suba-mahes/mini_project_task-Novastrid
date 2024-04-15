// test/users.test.js
const db = require("../model/index.js");

const {expect} = require('expect');
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
describe('register a user which is already registered', function() {
    let user_token;

    it('should register a user which is already registered on post ', function(done) {

        const req_data = {
            "name" : "insu",
            "email_id" : "insub@gmail.com",
            "password" : "passSDd123"
        }

        request(app)
            .post(`/users/register`)
            .send(req_data)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                if (res.body.message !== "Already registerd email_id") {
                    return done(new Error('registeration is not successfull'));
                }
                done();
            });
    });
    
    it("welcome page (403-error)", function(done){
        request(app)
            .get('/users/welcome')
            .set('Authorization', `Bearer ${user_token}`)
            .expect(403)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body; 
                if(result.message !== "Token is not valid"){
                    return done(new Error('error'));
                }
                
                done();
            })
    })
});

describe('register a user', function() {
    let user_token;

    it('should register a user on post ', function(done) {

        const req_data = {
            "name" : "insu",
            "email_id" : "inbaloveeesuba@gmail.com",
            "password" : "passSDd123"
        }

        request(app)
            .post(`/users/register`)
            .send(req_data)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                if (res.body.message !== "registered successfully") {
                    return done(new Error('registeration is not successfull'));
                }
                else{
                        user_token = res.body.token;
                }
                done();
            });
    });

    it("welcome page", function(done){
        request(app)
            .get('/users/welcome')
            .set('Authorization', `Bearer ${user_token}`)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body; 
                if((!result.user_id || !result.first_name || !result.last_name || !result.email_id)  && (!result.name || !result.message)){
                    return done(new Error('error'));
                }
                
                done();
            })
    })
});

describe('login a user', function() {
    let user_token;

    it('should login a user on post ', function(done) {

        const req_data = {
            "email_id" : "insub@gmail.com",
            "password" : "passSDd123"
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

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                const result = res.body; 
                if((!result.user_id || !result.first_name || !result.last_name || !result.email_id)  && (!result.name || !result.message)){
                    return done(new Error('error'));
                }
                
                done();
            })
    })

    it("welcome page - (401-error)", function(done){
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
    })
});

describe('user get all Tests', function() {
    it('should return an array of users on GET ', function(done) {
        request(app)
            .get('/users/get-allusers')
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!Array.isArray(res.body)) {
                    return done(new Error('Response body is not an array'));
                }
                for(const result of res.body){
                    if(!result.user_id || !result.first_name || !result.last_name || !result.email_id  || !result.address1 || !result.address2 || !result.city || !result.state || !result.country){
                        return done(new Error('Response body is not an array'));
                    }
                }
                done();
            });
    });

});


describe('user get by id Tests', function() {
    it('should return a user on GET ', function(done) {
        const id = 1;
        request(app)
            .get(`/users/get-user-by-id/${id}`)
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
                if(!result.user_id || !result.first_name || !result.last_name || !result.email_id  || !result.address1 || !result.address2 || !result.city || !result.state || !result.country){
                    return done(new Error('Response body is not an array'));
                }
                done();
            });
    });

});

describe('create a user', function() {
    it('should create a user on post ', function(done) {

        const req_data = {
            "first_name": "asa",
            "last_name": "zzz",
            "email_id": "sgf@gmail.com",
            "address1": "1659 ewsb",
            "address2": "tnhb s,villapuram",
            "city": "Madurai",
            "state": "Tamil nadu",
            "country": "India"
        }
        request(app)
            .post(`/users/insert-user`)
            .send(req_data)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                if (res.body.message !== "inserted successfully") {
                    return done(new Error('insertion is not successfull'));
                }

                done();
            });
    });

});

describe('delete get by id Tests', function() {
    it('should delete the user by id DELETE', function(done) {
        const id = 22;
        request(app)
            .delete(`/users/delete-user-by-id/${id}`)
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

});

describe('update a user', function() {
    it('should update a user on put ', function(done) {
        const id = 1;
        const req_data = {
            "first_name": "hai",
            "last_name": "zzz",
            "email_id": "aa@gmail.com",
            "address1": "1659 ewsb",
            "address2": "tnhb colon,villapuram",
            "city": "Madurai",
            "state": "f nadu",
            "country": "India"
        }
        request(app)
            .put(`/users/update-user/${id}`)
            .send(req_data)
            .expect(200)
            .end(function(err, res) {
                if(err) return done(res.body || err);

                if (!res.body || typeof res.body !== 'object') {
                    return done(new Error('Response body is not an object'));
                }

                if (res.body.message !== "updated successfully") {
                    return done(new Error('updation is not successfull'));
                }

                done();
            });
    });

});