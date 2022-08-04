const express = require('express');
const router = express.Router();
const path = require('path');
const { isUndefined } = require('util');
const pool = require('../database');
const {JSONPromediosAl} = require('../lib/jsonFormat');
const {setChild} = require('../lib/helpers');
//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));
exports.root = ((req,res) => {
    setChild(req.user[0]).then((r)=>{
        req.session['childs'] = r;
        res.redirect('/home');
    });
});

exports.renderHome = ((req,res) => { //Actualmente muestra publicaciones nada mas
    const rows = pool.query("SELECT * FROM publicaciones p JOIN usuarios u ON p.autor = u.id", function(err, publicaciones){
        res.render('publicaciones.hbs', {pub: publicaciones, links: 'headerLinks/home', user:req.user[0]});
    });
});

exports.renderChat = ((req,res) => {
    const rows1 = pool.query("SELECT * FROM chats WHERE id_usuario = ?", req.user[0].id, function(err, chats){
        if (req.query.id_chat != null) {
            const rows2 = pool.query("SELECT * FROM mensajes WHERE chatroom = ?", [req.query.id_chat], function(err, mensajes){
                for(let i = 0; i < mensajes.length; i++){
                    mensajes[i].userid = req.user[0].id;
                }
                const rows3 = pool.query("SELECT * FROM chats WHERE id_chat = "+req.query.id_chat+" AND id_usuario = "+req.user[0].id, function(err, selected_chat){
                    const rows4 = pool.query("SELECT COUNT(id_chat) as id_chat FROM chats WHERE id_chat="+req.query.id_chat, function(err, count){
                        res.render('mensajes.hbs', {layout: 'chatLY.hbs', chats, mensajes, user:req.user[0], selected_chat, count});
                    });
                });
            });
        }
        else 
            res.render('mensajes.hbs', {layout: 'chatLY.hbs', chats, mensajes: null, user:req.user[0]});
    });    
});