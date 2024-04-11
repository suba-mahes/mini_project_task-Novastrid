'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_addresses', 
    { 
      user_address_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      address1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      address2: {
        allowNull: false,
        type: Sequelize.STRING
      },
      city:{
        allowNull: true,
        type:Sequelize.STRING
      },
      state:{
        allowNull: true,
        type:Sequelize.STRING
      },
      country:{
        allowNull: true,
        type:Sequelize.STRING
      },
      user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
    }
  );

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_addresses');
  }
};
