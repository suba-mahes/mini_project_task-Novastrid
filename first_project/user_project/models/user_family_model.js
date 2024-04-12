
module.exports = (sequelize,Sequelize) =>{
    const UserFamily = sequelize.define("user_family",{
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
        no_of_sibilings:{
          allowNull: false,
          type:Sequelize.INTEGER
        },
        user_id:{
          allowNull: false,
          type: Sequelize.INTEGER,
        }
      }, 
      {
        timestamps: false,
      }
    );
    return UserFamily;
}