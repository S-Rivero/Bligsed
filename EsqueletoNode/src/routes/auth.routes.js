const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const {
    renderSignup,
    signUp,
    renderSignin,
    signIn,
    logout
} = require('../controllers/auth.controller');


router.get('/registro', isNotLoggedIn, renderSignup);

router.post('/registro', isNotLoggedIn, signUp);

router.get('/login', isNotLoggedIn, renderSignin);

router.post('/login',  isNotLoggedIn, signIn);

router.get('/logout', isLoggedIn, logout);

router.post('/logout', isLoggedIn, logout);//Esto hay que chequearlo

 
module.exports = router;