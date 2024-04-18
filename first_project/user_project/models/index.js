const env = "development";
const config = require("../config/config.json")[env];

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host : config.host,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
    }
});


try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
}
catch (error) {
    console.error('Unable to connect to the database:', error);
}


const db ={};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.user = require("./user_model.js")(sequelize,Sequelize);
db.user_address = require("./user_address_model.js")(sequelize,Sequelize);
db.user_family = require("./user_family_model.js")(sequelize,Sequelize);

db.user.hasOne(db.user_address,{foreignKey: 'user_id', as:'address'});
db.user_address.belongsTo(db.user, { foreignKey: 'user_id' });

db.user.hasOne(db.user_family,{foreignKey: 'user_id', as:'family_details'});
db.user_family.belongsTo(db.user, { foreignKey: 'user_id' });


module.exports = db;
