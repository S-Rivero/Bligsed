const config = require('dotenv').config;
config();

module.exports = {
    database: {
      connectionLimit: 15,
      host: "localhost",
      user:  "root",
      password:  "",
      database:  "proyecto",
    },
    port:  4000
}