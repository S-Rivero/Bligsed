const express = require('express');
const router = express.Router();
const path = require('path');
const { isUndefined } = require('util');
const pool = require('../database');
const { database } = require('../config');
const {JSONPromediosAl} = require('../lib/jsonFormat');
const {setChild} = require('../lib/helpers');
//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));
exports.root = ((req,res) => {
    
    // ESTO ES DE NASHER
    // setChild(req.user[0]).then((r)=>{
    //     req.session['childs'] = r;
    //     res.redirect('/home');
    // });
    
    // ESTO ES PARA LOS MENSAJES
    res.render('chat.hbs', {layout: 'mensajeriaPrueba.hbs', user:req.user[0], db: database});
});

exports.renderHome = ((req,res) => { //Actualmente muestra publicaciones nada mas
    const rows = pool.query("SELECT * FROM publicaciones p JOIN usuarios u ON p.autor = u.id", function(err, publicaciones){
        res.render('publicaciones.hbs', {pub: publicaciones, links: 'headerLinks/home', user:req.user[0]});
    });
});

exports.renderMsg = (req, res) => {
    //res.render('chat.hbs', {layout: 'mensajeriaPrueba.hbs', user:req.user[0], db: database});
    console.log("FUNCAAAAAAAAAAAA");
    res.send(req.user);
    //ACA TENGO QUE PONER UNA FUNCION PARA LOS EACH DE LOS MENSAJES, 1 PARA LOS PUSH Y OTRA PARA LOS GET
}