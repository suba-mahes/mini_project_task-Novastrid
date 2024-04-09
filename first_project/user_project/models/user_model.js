
module.exports = (sequelize,Sequelize) =>{
    const User = sequelize.define("user",{
        role_id: {
            allowNull: false,
            type: Sequelize.INTEGER
          },
         first_name: {
           allowNull: false,
           type: Sequelize.STRING
         },
         last_name: {
           allowNull: false,
           type: Sequelize.STRING
         },
         email_id:{
           allowNull: true,
           type:Sequelize.STRING,
           unique: true,
           primaryKey: true
         }
    });
    return User;
}