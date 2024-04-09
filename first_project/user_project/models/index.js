var env = "development";
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

db.auth = require("./auth/auth.js")(sequelize,Sequelize);

db.user = require("./one_to_one/user_model.js")(sequelize,Sequelize);
db.user_address = require("./user_address_model.js")(sequelize,Sequelize);

db.user.hasOne(db.user_address,{foreignKey: 'user_id'});
db.user_address.belongsTo(db.user, { foreignKey: 'user_id' });


db.user_table = require("./one_to_many/user_table_model.js")(sequelize,Sequelize);
db.user_address_table = require("./one_to_many/user_address_table_model.js")(sequelize,Sequelize);

db.user_table.hasMany(db.user_address_table,{foreignKey: 'user_id'});
db.user_address_table.belongsTo(db.user_table, { foreignKey: 'user_id' });


db.actor = require("./many_to_many/actor_model.js")(sequelize,Sequelize);
db.movie = require("./many_to_many/movie_model.js")(sequelize,Sequelize);
db.actor_movie = require("./many_to_many/actor_movie_model.js")(sequelize,Sequelize);


db.actor.belongsToMany(db.movie,{through : db.actor_movie ,foreignKey: 'actor_id' });
db.movie.belongsToMany(db.actor, { through: db.actor_movie ,foreignKey: 'movie_id' });

//migration
db.book = require("./migration/book.js")(sequelize, Sequelize);

module.exports = db;
