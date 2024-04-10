'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('auths', [
      {
        role: 1,
        email_id:"admin@gmail.com",
        password: "Admin@123"
      },
      {
        role: 0,
        email_id:"aaa@gmail.com",
        password: "Password@123"
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('auths', null, {});
  }
};
