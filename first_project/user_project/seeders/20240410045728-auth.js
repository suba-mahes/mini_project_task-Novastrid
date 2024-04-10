'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('auths', [
      {
        role: 1,
        email_id:"admin@gmail.com",
        password: await bcrypt.hash("Admin@123",10)
      },
      {
        role: 0,
        email_id:"aaa@gmail.com",
        password: await bcrypt.hash("Password@123",10)
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('auths', null, {});
  }
};