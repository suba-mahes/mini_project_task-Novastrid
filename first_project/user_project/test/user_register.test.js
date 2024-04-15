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

describe('register a user which is already registered', function() {

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

                const result = res.body; 
                if((!result.user_id || !result.is_active || !result.email_id || !result.first_name || !result.last_name || !result.gender || !result.d_o_b || !result.image || !result.address.address1 || !result.address.address2 || !result.address.city || !result.address.state || !result.address.country || !result.family_details.gardian_name || !result.family_details.mother_name || !result.family_details.gardian_occupation || !result.family_details.mother_occupation || !result.family_details.no_of_siblings)){
                    return done(new Error('error'));
                }
                
                done();
            });
    });
    
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
                    return done(new Error('Already registerd email_id'));
                }
                done();
            });
    });
});
