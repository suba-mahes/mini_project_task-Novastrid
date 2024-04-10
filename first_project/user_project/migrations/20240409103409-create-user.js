'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', 
    { 
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
     first_name: {
       allowNull: false,
       type: Sequelize.STRING
     },
     last_name: {
       allowNull: true,
       type: Sequelize.STRING
     },
     email_id:{
       allowNull: false,
       type:Sequelize.STRING,
       unique: true
     },
     gender:{
      allowNull: false,
      type:Sequelize.STRING,
     },
     d_o_b:{
      allowNull: false,
      type: Sequelize.DATE
     },
    }
  );

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
