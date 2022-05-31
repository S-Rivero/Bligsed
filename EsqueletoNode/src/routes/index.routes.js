const express = require('express');
const router = express.Router();
const {
    root,
    renderHome,
    renderInasistencias
} = require('../controllers/index.controller');


//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));
router.get('/', root);

router.get('/home', renderHome);

router.get('/inasistencias', renderInasistencias);


module.exports = router;