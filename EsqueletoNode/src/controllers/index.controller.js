const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../database');

//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));
exports.root = ('/', (req,res) => {
    res.redirect('/home');
});

exports.renderHome = ('/home', (req,res) => { //Actualmente muestra publicaciones nada mas
    const rows = pool.query("SELECT * FROM publicaciones", function(err, publicaciones){
        res.render('publicaciones.hbs', {pub: publicaciones});
    });
});

exports.renderInasistencias = ('/inasistencias', (req,res) => {
    const rows = pool.query("SELECT * FROM inasistencias WHERE id_us = ?", [req.user[0].id], function(err, inasistencias){
        res.render('inasistencias.hbs', {in: inasistencias});
    });
});
