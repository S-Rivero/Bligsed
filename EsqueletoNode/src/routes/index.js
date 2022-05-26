const express = require('express');
const router = express.Router();
const path = require('path');

//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));
router.get('/', (req,res) => {
    res.redirect('/registro');
});

router.get('/home', (req,res) => {
    res.send('Inicio xd');
});


module.exports = router;