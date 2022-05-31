const express = require('express');
const router = express.Router();
const {
    renderSignup,
    signUp,
    renderSignin,
    signIn
} = require('../controllers/auth.controller');


router.get('/registro', renderSignup);

router.post('/registro', signUp);

router.get('/login', renderSignin);

router.post('/login',  signIn);

 
module.exports = router;