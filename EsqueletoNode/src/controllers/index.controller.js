const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../database');

//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));
exports.root = ((req,res) => {
    res.redirect('/home');
});

exports.renderHome = ((req,res) => { //Actualmente muestra publicaciones nada mas
    const rows = pool.query("SELECT * FROM publicaciones", function(err, publicaciones){
        res.render('publicaciones.hbs', {pub: publicaciones});
    });
});

exports.renderInasistencias = ((req,res) => {
    const rows = pool.query("SELECT * FROM inasistencias WHERE id_us = ?", [req.user[0].id], function(err, inasistencias){
        res.render('inasistencias.hbs', {in: inasistencias});
    });
});

exports.renderPromediosAl = ((req,res) => {//Muestra los promedios por cuatrimestre y final de cada materia.
    const rows = pool.query("SELECT * FROM materias WHERE IdCurso = 1", function(err, materias){ //Agregar un join para obtener el curso del usuario actual
        // res.render('promediosAl.hbs', {ma: materias});
        res.render('cuat1.hbs', {ma: materias});
    });
});