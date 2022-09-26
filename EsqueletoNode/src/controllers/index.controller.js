const express = require('express');
const router = express.Router();
const path = require('path');
const { isUndefined } = require('util');
const pool = require('../database');
const {JSONPromediosAl, JSONListaDeCursos, JSONListaDeMaterias} = require('../lib/jsonFormat');
const {setChild} = require('../lib/helpers');
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
        res.redirect('/home');
    });
});

exports.renderHome = ((req,res) => { //Actualmente muestra publicaciones nada mas
    if(req.session.currentUser){
        delete req.session.currentUser;
    }
    const rows = pool.query("SELECT * FROM publicaciones p JOIN usuarios u ON p.autor = u.id ORDER BY p.Id DESC", function(err, publicaciones){
        res.render('publicaciones.hbs', {pub: publicaciones, links: 'headerLinks/home', user:{user: req.user[0], childs: req.session.childs}});
    });
});

exports.renderChat = ((req,res) => {
    const rows1 = pool.query("SELECT * FROM chats WHERE id_usuario = ?", req.user[0].id, function(err, chats){
        if (err) throw err;
        if (req.query.id_chat != null) {
            const rows2 = pool.query("SELECT * FROM mensajes WHERE chatroom = ?", [req.query.id_chat], function(err, mensajes){
                if (err) throw err;
                for(let i = 0; i < mensajes.length; i++){
                    mensajes[i].userid = req.user[0].id;
                }
                const rows3 = pool.query("SELECT * FROM chats WHERE id_chat = "+req.query.id_chat+" AND id_usuario = "+req.user[0].id, function(err, selected_chat){
                    if (err) throw err;
                    const rows4 = pool.query("SELECT COUNT(id_chat) as id_chat FROM chats WHERE id_chat="+req.query.id_chat, function(err, count){
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

exports.renderDocumentos = ((req,res)=>{
    // res.render('cursos.hbs', {a, links: 'headerLinks/cursos', user:{user: req.user[0], childs: req.session.childs}});
    res.send("documentosxd");
});


exports.renderCursos = ((req,res)=>{
    if(req.user[0].Tipo_de_usuario == 4){
        const rows = pool.query("SELECT c.ID, c.Nombre_curso as Curso, Mat.ID as IdMateria, Mat.Materia as Materia FROM curso c INNER JOIN (SELECT ID, Materia, IdCurso FROM `materias` WHERE profesor = ?) Mat ON c.ID = Mat.IdCurso GROUP BY Curso ORDER BY Curso ASC", req.user[0].id, function(err, a){
            let list = JSONListaDeCursos(a);
            let listMat = JSONListaDeMaterias(a);
            res.render('cursos.hbs', {tdu: req.user[0].Tipo_de_usuario, list, listMat, links: 'headerLinks/cursos', user:{user: req.user[0], childs: req.session.childs}});
        });
    }else{
        const rows = pool.query("SELECT c.ID, c.Nombre_curso as Curso, Mat.ID as IdMateria, Mat.Materia as Materia FROM curso c INNER JOIN (SELECT ID, Materia, IdCurso FROM `materias`) Mat ON c.ID = Mat.IdCurso GROUP BY Curso ORDER BY Curso ASC", function(err, a){
            let list = JSONListaDeCursos(a);
            let listMat = JSONListaDeMaterias(a);
            res.render('cursos.hbs', {tdu: req.user[0].Tipo_de_usuario, list, listMat, links: 'headerLinks/cursos', user:{user: req.user[0], childs: req.session.childs}});
        });
    }
});
exports.renderTablaCursos = ((req,res)=>{
    const rows = pool.query("SELECT u.id, u.nombre, u.username, u.Numero_de_telefono FROM alumno a JOIN usuarios u ON a.id = u.id WHERE ID_Curso = ? ORDER BY nombre ASC", req.params.id, function(err, a){
        const r = pool.query("SELECT * FROM curso ORDER BY Nombre_curso ASC", function(err, b){
            // res.send(b);
            res.render('tabla_curso_docente.hbs', {a, b, links: 'headerLinks/tabla_curso_docente', user:{user: req.user[0], childs: req.session.childs}});
        // res.send(a);
        });
    });
});

exports.cargarNotasDocente = ((req,res)=>{
    const rows = pool.query("", [], function(err, a){
        
    });
});