'use strict';

/** @type {import('sequelize-cli').Migration} */
const db = require("../models/index");
const user_model = db.user;

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await user_model.bulkCreate([
      {
        first_name: "aaa",
        last_name: "bbb",
        email_id: "aaa@gmail.com",
        gender: "female",
        d_o_b: new Date('1990-01-01')
      }
    ], { returning: true });

    const userIds = users.map(user => user.user_id);

    await queryInterface.bulkInsert('user_addresses', [
      {
        address1: "9A muthu street",
        address2: "mathichiyam",
        city: "madu",
        state: "TN",
        country: "Ind",
        user_id: userIds[0] // Assuming there's only one user created
      }
    ]);

    await queryInterface.bulkInsert('user_families', [
      {
        gardian_name: "inba",
        mother_name: "kane",
        gardian_occupation: "off",
        mother_occupation: "hw",
        user_id: userIds[0] // Assuming there's only one user created
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('user_addresses', null, {});
    await queryInterface.bulkDelete('user_families', null, {});
  }
};
