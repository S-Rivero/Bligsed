const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const pool = require('../database');
const res = require('express/lib/response');


passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    let id = null;
    let newUser = {
        id: id,
        username, //esta guardando un mail no un username
        password
    };
    newUser.password = '123456';
    // Saving in the Database
    const result =  pool.query('INSERT INTO users SET ? ', [newUser], function(error,results,fields){
        if (error) throw error;
        console.log(results); //Pinta por consola los resultados de tu consulta
        newUser.id = results.insertId;
        console.log(newUser);
        return done(null, newUser);
    });
    
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, id);
});