const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const {
    root,
    renderHome
} = require('../controllers/index.controller');
const {sendMsg} = require('../lib/msg');

//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));

router.get('/',isLoggedIn, root);

router.get('/home', isLoggedIn, renderHome);



module.exports = router;