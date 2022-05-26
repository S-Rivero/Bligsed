const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../database');
const bodyParser = require('body-parser');

//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));
router.get('/', (req,res) => {
    res.redirect('/home');
});

router.get('/home', (req,res) => {
    const rows = pool.query("SELECT * FROM publicaciones", function(err, publicaciones){
        console.log(publicaciones);
        res.render('publicaciones.hbs', {pub: publicaciones});
    });
});

router.get('/inasistencias', (req,res) => {
    const rows = pool.query("SELECT * FROM inasistencias WHERE id_us = ?", [req.user[0].id], function(err, inasistencias){
        console.log(inasistencias);
        res.render('inasistencias.hbs', {in: inasistencias});
    });
});


module.exports = router;