const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../database');
const {JSONPromediosAl} = require('../lib/jsonFormat');
const {setChild} = require('../lib/helpers');

exports.root = ((req,res) => {
    res.redirect("/perfil/datosPersonales");
});

exports.datosPersonales = ((req,res) => {
    
    res.render('perfil.hbs', {in: req.user[0], title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileDatosPersonales', user:req.user[0], partial: 'profile/datosPersonales'});
});

exports.FichaMedica = ((req,res) => {
    res.send("/FichaMedica");
});

exports.Boletin = ((req,res) => {
    res.send("/Boletin");
});

exports.inasistencias = ((req,res) => {
    const rows = pool.query("SELECT * FROM inasistencias WHERE id_us = ?", [req.user[0].id], function(err, inasistencias){
        res.render('perfil.hbs', {in: inasistencias, title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileInasistencias', user:req.user[0], partial: 'profile/inasistencias'});
    });
});

exports.mensajes = ((req,res) => {
    res.send("/mensajes");
});

exports.Boletin = ((req,res) => {
    let uid = req.query.uid;

    if(typeof uid == 'undefined'){
        uid = req.user[0].id;
    }
    let tdu = req.user[0].Tipo_de_usuario;
    switch(tdu){
        case 5://No contempla multiples hijos. Esto hay que verlo despues cuando se tenga la interfaz en la que se selecciona el hijo al que ver.
            uid = req.session.childs[0];
            renderQueryNotas(req,res,uid);
            break;
        case 6: //ES ALUMNO 
            uid = req.user[0].id;
            renderQueryNotas(req,res,uid);
            break;
        default:
            res.send("xD");
            break;
    }
});





const renderQueryNotas = function(req,res,uid){
    const rows = pool.query("SELECT `nota`, `Materia` FROM usuarios u JOIN notas n ON u.id = n.id_alum JOIN materias m ON m.ID = n.id_materia WHERE u.id = ? ORDER BY m.Materia ASC;", [uid], function(err, materias){
        const formateado = JSONPromediosAl(materias);
        res.render('perfil.hbs', {in:{ma: formateado['materias'], cant: formateado.materias[formateado.max['materia']]}, title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileBoletin', user:req.user[0], partial: 'profile/boletin'});
        // res.send(formateado);
        //Se pasa IN porque solamente puede recibirse 1 parametro. Los objetos estan encapsulados dentro
    });
}