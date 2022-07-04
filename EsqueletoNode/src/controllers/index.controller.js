const express = require('express');
const router = express.Router();
const path = require('path');
const { isUndefined } = require('util');
const pool = require('../database');
const {JSONPromediosAl} = require('../lib/jsonFormat');
const {setChild} = require('../lib/helpers');
//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));
exports.root = ((req,res) => {
    
    /* ESTO ES DE NASHER
    setChild(req.user[0]).then((r)=>{
        req.session['childs'] = r;
        res.redirect('/home');
    });
    */
    
    // ESTO ES PARA LOS MENSAJES
    res.render('chat.hbs', {layout: 'mensajeriaPrueba.hbs', user:req.user[0]});
});

exports.renderHome = ((req,res) => { //Actualmente muestra publicaciones nada mas
    const rows = pool.query("SELECT * FROM publicaciones p JOIN usuarios u ON p.autor = u.id", function(err, publicaciones){
        res.render('publicaciones.hbs', {pub: publicaciones, links: 'headerLinks/home', user:req.user[0]});
    });
});
//SELECT `nota`, `Materia` FROM usuarios u JOIN notas n ON u.id = n.id_alum JOIN materias m ON m.ID = n.id_materia WHERE u.id = ? ORDER BY m.Materia ASC;

exports.renderInasistencias = ((req,res) => {
    const rows = pool.query("SELECT * FROM inasistencias WHERE id_us = ?", [req.user[0].id], function(err, inasistencias){
        res.render('micuenta.hbs', {in: inasistencias, title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profile', user:req.user[0]});
        // res.send(req.session.passport);
    }); 
});

exports.renderPromediosAl = ((req,res) => {
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
        res.render('promediosAl.hbs', {ma: formateado['materias'],links: 'headerLinks/boletin', cant: formateado.materias[formateado.max['materia']], title: 'Calificaciones - Bligsed', user:req.user[0]});
    });
}