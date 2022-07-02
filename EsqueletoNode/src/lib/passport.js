const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const pool = require('../database');
const res = require('express/lib/response');
const {encryptPassword, matchPassword} = require('./helpers');

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
    
    newUser.password = await encryptPassword(password);
    const resUser =  pool.query('SELECT * FROM usuarios WHERE username = ?', [newUser.username], function(error,res,fields){
        if(!res[0]){
            const result =  pool.query('INSERT INTO usuarios SET ? ', [newUser], function(error,results,fields){
                if (error) throw error;
                newUser.id = results.insertId;
                return done(null, newUser);
            });
        }else{
            done();
        }
    });
    
}));


passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = pool.query( "SELECT * FROM usuarios WHERE username = ?", [username], async function(error,results,fields){
      
      if (results.length > 0) {
        const user = results[0];
        const validPassword = await matchPassword(
          password,
          user.password
        );
        if (validPassword) {
          done(null, user);
        } else {
          done(null, false);
        }
      } else {
          return done(null, false);
      }
    });
}
)
);




passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.promise().query('SELECT * FROM usuarios WHERE id = ?', [id]);
    done(null, rows[0]);
});