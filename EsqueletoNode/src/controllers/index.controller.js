const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../database');
const {JSONPromediosAl} = require('../lib/jsonFormat');

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

exports.renderPromediosAl = ((req,res) => {//FALTA HACER EL JOIN DEL CURSO Y ETC
    const rows = pool.query("SELECT `nota`, `Materia` FROM usuarios u JOIN notas n ON u.id = n.id_alum JOIN materias m ON m.ID = n.id_materia WHERE u.id = 1 ORDER BY m.Materia ASC;", function(err, materias){
        const formateado = JSONPromediosAl(materias);
        res.render('cuat1.hbs', {ma: formateado});
    });
});