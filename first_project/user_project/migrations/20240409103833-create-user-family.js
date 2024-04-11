'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_families', 
    { 
      user_family_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
     gardian_name: {
       allowNull: false,
       type: Sequelize.STRING
     },
     mother_name: {
       allowNull: false,
       type: Sequelize.STRING
     },
     gardian_occupation:{
       allowNull: false,
       type:Sequelize.STRING
     },
     mother_occupation:{
      allowNull: false,
      type:Sequelize.STRING
    },
    user_id:{
      type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    }
  );

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_families');
  }
};
