const express = require('express');
const router = express.Router();
const passport = require('passport');

exports.renderSignup = (req, res) => {
    res.render('auth/login.hbs', {layout: 'auth'});
};

exports.signUp = passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/registro',
    failureFlash: true
});

exports.renderSignin = (req, res) => {
    res.render('auth/login.hbs', {layout: 'auth'});
};

exports.signIn = passport.authenticate('local.signin', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
});

exports.logout = function (req, res, next) {
    req.logout(function (err) {
        if (err) { 
            return next(err); 
        }
        res.redirect('/login');
    });
};