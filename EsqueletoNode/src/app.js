const { execArgv } = require('process');
require('colors');
require('dotenv').config();
const path = require('path');
const mysql = require('mysql');
const express = require('express');
const {database, port} = require('./config');
const {create} = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');

// Global

// app.use((req, res, next) => {
    
//     next();
// });

// Initializations
const app = express();
require('./lib/passport');


//settings
app.set('port', port);
app.set('views', path.join(__dirname, '/views'));
app.engine(
    ".hbs",
    create({
      defaultLayout: "main",
      layoutsDir: path.join(app.get("views"), "layouts"),
      partialsDir: path.join(app.get("views"), "partials"),
      extname: ".hbs",
    //   helpers: require("./lib/..."),
    }).engine
  );
  app.set("view engine", ".hbs");
  


//middlewares
app.use(passport.initialize());
app.use(passport.sesion());

//routes
app.use(require('./routes/'));



//static files
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;