
module.exports = (sequelize,Sequelize) =>{
    const User = sequelize.define("user",{
        user_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          is_active: {
            allowNull: false,
            type: Sequelize.BOOLEAN
          },
          role: {
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
         first_name: {
           allowNull: false,
           type: Sequelize.STRING
         },
         last_name: {
           allowNull: true,
           type: Sequelize.STRING
         },
         gender:{
          allowNull: false,
          type:Sequelize.STRING,
         },
         d_o_b:{
          allowNull: false,
          type: Sequelize.DATE
         },
         image: {
          type: Sequelize.BLOB,
          allowNull: false
      }
        }, 
        {
          timestamps: false,
        }
      );
    return User;
}
