const express = require('express');
const router = express.Router();
const path = require('path');
const { isUndefined } = require('util');
const pool = require('../database');
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
    const rows = pool.query("SELECT * FROM mensajes WHERE chatroom = 1", function(err, mensajes){
        for(let i = 0; i < mensajes.length; i++){
          mensajes[i].userid = req.user[0].id;
        }

        //ESTO ES DE NASHER, ES COPY PASTE DE LO DE ARRIBA PARA NO CAMBIAR LAS RUTAS. NO BORRAR ESTE NI EL DE ARRIBA. DESPUES EN UN FUTURO SE BORRA TODO ESTO Y QUEDA SOLO EL DE ARRIBA 
        setChild(req.user[0]).then((r)=>{
            req.session['childs'] = r;
        });
        res.render('chat.hbs', {layout: 'mensajeriaPrueba.hbs', message: mensajes, user:req.user[0]});
    });
});
exports.renderHome = ((req,res) => { //Actualmente muestra publicaciones nada mas
    const rows = pool.query("SELECT * FROM publicaciones p JOIN usuarios u ON p.autor = u.id", function(err, publicaciones){
        res.render('publicaciones.hbs', {pub: publicaciones, links: 'headerLinks/home', user:req.user[0]});
    });
});

exports.renderChat = ((req,res) => {
    const rows = pool.query("SELECT * FROM mensajes WHERE chatroom = ?", [req.body.chat_id], function(err, mensajes){
        for(let i = 0; i < mensajes.length; i++){
            mensajes[i].userid = req.user[0].id;
        }
        res.render('chat.hbs', {layout: 'mensajeriaPrueba.hbs', message: mensajes, user:req.user[0]});
    });
});