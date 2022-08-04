const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const {
    root,
    renderHome,
    renderChat,
} = require('../controllers/index.controller');
const { pushMsg } = require('../lib/messages');

//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));

router.get('/',isLoggedIn, root);

router.get('/home', isLoggedIn, renderHome);

router.post('/msg', pushMsg);

router.get('/chat', renderChat);

module.exports = router;