const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const {
    root,
    renderHome,
    renderInasistencias
} = require('../controllers/index.controller');


//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));
router.get('/', root);

router.get('/home', isLoggedIn, renderHome);

router.get('/inasistencias', isLoggedIn, renderInasistencias);


module.exports = router;