'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('auths', 
    { 
      auth_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      role: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      is_active: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      email_id:{
        allowNull: true,
        type:Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
    }
  );

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('auths');
  }
};
