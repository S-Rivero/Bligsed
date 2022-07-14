const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const {
    root,
    renderHome,
    renderXample,
    renderBody,
} = require('../controllers/index.controller');
const { pushMsg } = require('../lib/messages');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));

router.get('/',isLoggedIn, root);

router.get('/home', isLoggedIn, renderHome);

router.post('/msg', pushMsg);

router.get('/xample', renderXample);
router.post('/xample', renderBody);

module.exports = router;