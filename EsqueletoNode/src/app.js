const { execArgv } = require('process');
require('colors');
require('dotenv').config();
const path = require('path');
const express = require('express');
const {database, port} = require('./config');
const {create} = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const expressMySQLSession  = require('express-mysql-session');
const flash = require('connect-flash');
const morgan = require('morgan');
require('./lib/passport');


// Initializations
const app = express();
const MySQLStore = expressMySQLSession(session);




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
      helpers: require('./lib/hbshelpers')
    }).engine
  );
  app.set("view engine", ".hbs");
  


//middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false })); //https://stackoverflow.com/questions/9177049/express-js-req-body-undefined
app.use(bodyParser.json());

app.use(session({
  secret: 'bligsedsession',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// Global

app.use((req, res, next) => { 
  console.log('handling request for: ' + req.url);
  next();
});



//routes
app.use(require('./routes'));


//static files
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;