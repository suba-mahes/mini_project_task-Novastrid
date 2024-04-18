module.exports = (sequelize, Sequelize) => {
  const UserAddress = sequelize.define(
    "user_address",
    {
      user_address_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      address1: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      address2: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      city: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      state: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      country: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    },
    {
      timestamps: false,
    }
  );
  return UserAddress;
};
