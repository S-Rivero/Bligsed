const express = require('express');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');

router.get('/registro', (req, res) => {
    res.render('auth/registro.hbs');
});

router.post('/registro',  passport.authenticate('local.signup', {
    successRedirect: '/inicio',
    failureRedirect: '/registro',
    failureFlash: true,

}));

router.get('/login', (req, res) => {
    res.render('login.hbs');
});

router.post('/login', passport.authenticate('local.signup', {
    successRedirect: '/inicio',
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = router;