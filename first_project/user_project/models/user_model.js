
module.exports = (sequelize,Sequelize) =>{
    const User = sequelize.define("user",{
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
         }
        }, 
        {
          timestamps: false,
        }
      );
    return User;
}
