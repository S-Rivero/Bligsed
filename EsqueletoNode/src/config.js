const config = require('dotenv').config;
config();

module.exports = {
    database: {
      connectionLimit: 10,
      host: process.env.DATABASE_HOST || "localhost",
      user: process.env.DATABASE_USER || "root",
      password: process.env.DATABASE_PASSWORD || "",
      database: process.env.DATABASE_NAME || "bligsed",
    },
    port: process.env.PORT || 4000
}