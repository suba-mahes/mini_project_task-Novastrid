'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcrypt');

const db = require("../models/index");
const user_model = db.user;

const config = require("../config/config.json")

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await user_model.bulkCreate([
      {
        is_active:1,
        role: 1,
        email_id:"admin@gmail.com",
        password: await bcrypt.hash("Admin@123",10),
        first_name: "admin",
        last_name: "admin",
        gender: "female",
        image: config.image_upload_directory+"admin_admin.jpg",
        d_o_b: new Date('1990-01-01')
      },
    ], { returning: true });

    const userIds = users.map(user => user.user_id);

    await queryInterface.bulkInsert('user_addresses', [
      {
        address1: "a1 xyz",
        address2: "aaa",
        city: "mad",
        state: "TN",
        country: "Ind",
        user_id: userIds[0] 
      },
    ]);

    await queryInterface.bulkInsert('user_families', [
      {
        gardian_name: "a",
        mother_name: "b",
        gardian_occupation: "off",
        mother_occupation: "hw",
        no_of_sibilings:2,
        user_id: userIds[0]
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('user_addresses', null, {});
    await queryInterface.bulkDelete('user_families', null, {});
  }
};
