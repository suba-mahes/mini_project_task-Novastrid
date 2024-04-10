
module.exports = (sequelize,Sequelize) =>{
    const Auth = sequelize.define("auth",{
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
      email_id:{
        allowNull: true,
        type:Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
    }, 
    {
      timestamps: false,
    }
  );
    return Auth;
}
