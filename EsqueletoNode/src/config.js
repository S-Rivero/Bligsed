const config = require('dotenv').config;
config();

module.exports = {
    database: {
      connectionLimit: 15,
      host: "localhost",
      user:  "root",
      password:  "",
      database:  "database_mensajeria",
    },
    port:  4000
}