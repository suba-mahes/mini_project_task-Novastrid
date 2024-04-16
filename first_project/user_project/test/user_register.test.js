// test/users/.test.js
const db = require("../models/index.js");
const FormData = require('form-data');
const fs = require('fs');
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

// const req_data = {
//     "image" : fs.createReadStream('C:\\Users\\MY PC\\Desktop\\inba\\vietnam - flag.png'),
//     "first_name": "suba mahes",
//     "last_name": "inba",
//     "gender": "male",
//     "d_o_b": "2001-01-01",
//     "address": {
//         "address1": "1659 ewsb",
//         "address2": "thb colon,villapuram",
//         "city": "Madurai",
//         "state": "Tamil nadu",
//         "country": "Ind"
//     },
//     "family_details":{
//         "gardian_name": "inba",
//         "mother_name": "kane",
//         "gardian_occupation": "off",
//         "mother_occupation": "hwhouse wife"
//     }
// }


describe('register a user', function() {
    const filePath = 'C:\\Users\\MY PC\\Desktop\\inba\\vietnam - flag.png';
    it('should register a user on post ', function(done) {

        request(app)
            .post(`/users/register`)
            .set('Content-Type', 'multipart/form-data')
            .attach('image', filePath)
            .field('email_id', 'subbaainbbaa@gmail.com')
            .field('password', 'Suba@123')
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
            .field('email_id', 'subaainbbaa@gmail.com')
            .field('password', 'Suba@123')
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
