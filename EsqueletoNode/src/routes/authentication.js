const express = require('express');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');

router.get('/registro', (req, res) => {
    res.render('auth/registro.hbs');
});

router.post('/registro',  passport.authenticate('local.signup', {
    successRedirect: '/home',
    failureRedirect: '/registro',
    failureFlash: true
}));

router.get('/login', (req, res) => {
    res.render('auth/login.hbs');
});

router.post('/login',  passport.authenticate('local.signin', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}));

 
module.exports = router;