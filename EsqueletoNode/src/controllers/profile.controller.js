const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../database');
const {JSONPromediosAl} = require('../lib/jsonFormat');
const {esAlumno, setTutor, queTrimestre} = require('../lib/helpers');

exports.root = ((req,res) => {
    res.redirect("/perfil/datosPersonales");
});

exports.datosPersonales = ((req,res) => {
    let contacto = esAlumno(req.user[0].Tipo_de_usuario);
    let contactos = setTutor(req.user[0].id).then((r)=>{
        res.render('perfil.hbs', {in: req.user[0], title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileDatosPersonales', user:req.user[0], partial: 'profile/datosPersonales', contacto, contactos: r[0]});
    });
});


exports.FichaMedica = ((req,res) => {
    const rows = pool.query("SELECT * FROM fichamedica WHERE DNI = ?", [req.user[0].DNI], function(err, ficha){
        res.render('perfil.hbs', {in: ficha, title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileFichaMedica', user:req.user[0], partial: 'profile/fichaMedica', contacto: 'profile/void'});
    });
});

exports.inasistencias = ((req,res) => {
    const rows = pool.query("SELECT * FROM inasistencias WHERE id_us = ?", [req.user[0].id], function(err, inasistencias){
        res.render('perfil.hbs', {in: inasistencias, title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileInasistencias', user:req.user[0], partial: 'profile/inasistencias', contacto: 'profile/void'});
    });
});

exports.mensajes = ((req,res) => {
    res.redirect("/");
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
    
    const trimestre = queTrimestre(req.params.t);
    if(trimestre != 0){
        const rows = pool.query("SELECT `nota`, `Materia` FROM usuarios u JOIN notas n ON u.id = n.id_alum JOIN materias m ON m.ID = n.id_materia WHERE u.id = ? AND n.trimestre = ? ORDER BY m.Materia ASC;", [uid,trimestre], function(err, materias){
            const formateado = JSONPromediosAl(materias);
            res.render('perfil.hbs', {in:{ma: formateado['materias'], cant: formateado.materias[formateado.max['materia']]}, title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileBoletin', user:req.user[0], partial: 'profile/boletin', contacto: 'profile/void'});
        });
    }else{
        res.send("todavia no esta hecho xd");
    }
}