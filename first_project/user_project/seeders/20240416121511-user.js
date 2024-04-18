'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcrypt');

const db = require("../models/index");
const user_model = db.user;

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await user_model.bulkCreate([
      {
        is_active:1,
        role: 0,
        email_id:"aaa@gmail.com",
        password: await bcrypt.hash("Password@123",10),
        first_name: "aaa",
        last_name: "bbb",
        gender: "female",
        image: config.image_upload_directory+"Marina_aaa.jpg",
        d_o_b: new Date('2001-01-01')
      },
    ], { returning: true });

    const userIds = users.map(user => user.user_id);

    await queryInterface.bulkInsert('user_addresses', [
      {
        address1: "9A muthu street",
        address2: "mathichiyam",
        city: "madu",
        state: "TN",
        country: "Ind",
        user_id: userIds[0] 
      }
    ]);

    await queryInterface.bulkInsert('user_families', [
      {
        gardian_name: "inba",
        mother_name: "kane",
        gardian_occupation: "off",
        mother_occupation: "hw",
        no_of_sibilings:1,
        user_id: userIds[0]
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('user_addresses', null, {});
    await queryInterface.bulkDelete('user_families', null, {});
  }
};
