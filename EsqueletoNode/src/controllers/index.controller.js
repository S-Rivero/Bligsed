const express = require('express');
const router = express.Router();
const path = require('path');
const { isUndefined } = require('util');
const pool = require('../database');
const {JSONPromediosAl} = require('../lib/jsonFormat');
const {setChild} = require('../lib/helpers');


const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, path.join(__dirname, '../public/files'));
    },
    filename: (req,file,cb) => {
        console.log(file);
        cb(null, "BligsedImages_"+Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage:storage});

//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));
exports.root = ((req,res) => {
    setChild(req.user[0]).then((r)=>{
        req.session['childs'] = r;
        // req.session['childs'] = r.map((res)=>{
        //     return res.ID;
        // });
        // req.session['childNames'] = r.map((res)=>{
        //     return res.Nombre;
        // });
        console.table(req.session);
        res.redirect('/home');
    });
});

exports.renderHome = ((req,res) => { //Actualmente muestra publicaciones nada mas
    const rows = pool.query("SELECT * FROM publicaciones p JOIN usuarios u ON p.autor = u.id", function(err, publicaciones){
        res.render('publicaciones.hbs', {pub: publicaciones, links: 'headerLinks/home', user:{user: req.user[0], childs: req.session.childs}});
    });
});

exports.renderChat = ((req,res) => {
    const rows1 = pool.query("SELECT * FROM chats WHERE id_usuario = ?", req.user[0].id, function(err, chats){
        if (err) throw err;
        if (req.query.id != null) {
            const rows2 = pool.query("SELECT * FROM mensajes WHERE chat = ?", [req.query.id], function(err, mensajes){
                if (err) throw err;
                for(let i = 0; i < mensajes.length; i++){
                    mensajes[i].userid = req.user[0].id;
                }
                const rows3 = pool.query("SELECT * FROM chats WHERE id = "+req.query.id+" AND id_usuario = "+req.user[0].id, function(err, selected_chat){
                    if (err) throw err;
                    const rows4 = pool.query("SELECT COUNT(id) as id FROM chats WHERE id="+req.query.id, function(err, count){
                        if (err) throw err;
                        // res.render('mensajes.hbs', {links: 'headerLinks/chats', chats, mensajes, user:req.user[0], selected_chat: selected_chat[0], count: count[0]});
                        res.render('mensajes.hbs', {links: 'headerLinks/chats', chats, mensajes, user:{user: req.user[0], childs: req.session.childs}, selected_chat: selected_chat[0], count: count[0]});
                    });
                });
            });
        }
        else 
            // res.render('mensajes.hbs', {links: 'headerLinks/chats', chats, mensajes: null, user:req.user[0]});
            res.render('mensajes.hbs', {links: 'headerLinks/chats', chats, mensajes: null,user:{user: req.user[0], childs: req.session.childs}});
    });    
});

exports.xample = ((req,res) => {
    req.body.image = req.file.destination;

    console.log("Body: %o",req.body);
    console.log("File: %o",req.file);
    
    const file = req.file;

    if (!file) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    }

    const result = {
        name: req.body.name // adding the name from req.body in the result
    };

    res.redirect('/xample');
});

exports.rxample = ((req,res) => { 
    res.render('pruebaFiles.hbs', {layout: 'xamplely'});
});