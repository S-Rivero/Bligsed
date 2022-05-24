const { execArgv } = require('process');
require('colors');
require('dotenv').config();
const path = require('path');
const mysql = require('mysql');
const express = require('express');
const {database, port} = require('./config');
const {create} = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const flash = require('connect-flash');
const morgan = require('morgan');



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
app.use(session({
  secret: 'bligsedsession',
  resave: true,
  saveUninitialized: true,
  store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false })); //https://stackoverflow.com/questions/9177049/express-js-req-body-undefined
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());


// Global

app.use((req, res, next) => { 
  next();
});

//routes
app.use(require('./routes'));
app.use(require('./routes/authentication.js'));
// app.use(require('./routes'));



//static files
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;