const express = require('express');
const router = express.Router();
const path = require('path');
const { isUndefined } = require('util');
const pool = require('../database');
const {JSONPromediosAl, JSONListaDeCursos, JSONListaDeMaterias, JSONListaAlumnosNotas, JSONrenderCargarInasistencias, JSONcargarInasistencias} = require('../lib/jsonFormat');
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
        // res.redirect('/cargarNotas/1/1');
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
        const rows = pool.query("SELECT ID, Nombre_curso as Curso FROM curso GROUP BY Curso ORDER BY Curso ASC", function(err, a){
            let list = JSONListaDeCursos(a);
            res.render('cursos.hbs', {tdu: req.user[0].Tipo_de_usuario, list, links: 'headerLinks/cursos', user:{user: req.user[0], childs: req.session.childs}});
        });
    }
    // [{"materia":"Quimica","cursos":[{"cuso":"1A","idMateria":5}]},{"materia":"Naturales","cursos":[{"cuso":"6D","idMateria":4}]},{"materia":"Matematicas","cursos":[{"cuso":"7C","idMateria":1}]}]
});
exports.renderTablaCursos = ((req,res)=>{
    pool.query("SELECT ID FROM curso WHERE ID = ?", req.params.id, function(err, test){
        if(!(test[0])){
            res.redirect('/Cursos');
        }else{   
            const rows = pool.query(`
                SELECT p.nombre as nombre_tutor, A.id, A.nombre, A.username, A.Numero_de_telefono, A.Padre
                FROM usuarios p
                JOIN	(SELECT u.id, u.nombre, u.username, u.Numero_de_telefono, a.Padre 
                        FROM alumno a 
                        JOIN usuarios u 
                        ON a.id = u.id 
                        WHERE ID_Curso = ? ORDER BY nombre ASC) A
                ON A.Padre = P.id;
            `, req.params.id, function(err, a){
                const r = pool.query("SELECT * FROM curso ORDER BY Nombre_curso ASC", function(err, b){
                    res.render('tabla_curso.hbs', {a, b, tdu: req.user[0].Tipo_de_usuario, links: 'headerLinks/tabla_curso_docente', user:{user: req.user[0], childs: req.session.childs}});
                    // res.send(a);
                });
            });
        }
    });
});

exports.cargarNotasDocente = ((req,res)=>{
    //Solamente el docente titular puede acceder a la modificaicon de notas
    let idMat = req.params.id;
    let trim = req.params.t;
    
    pool.query(`
        SELECT IdCurso, Nombre_curso, Materia, A.ID
        FROM materias A
        JOIN curso B
        ON A.IdCurso = B.ID
        WHERE profesor = ?;
    `, [req.user[0].id], function(err, a){
        if(!(a[0])){
            res.redirect('/');
        }else{ 
            res.render('cargarNotas.hbs', {a, links: 'headerLinks/cargarNotas', user:{user: req.user[0], childs: req.session.childs}});
        }
    });
});

exports.POSTcargarNotasDocente = ((req,res) => {

    let {id, t} = req.params;
    let body = req.body;
    
     for(let k in body){
        if(k != "final" && k != "alumno"){
            let numnota = k.substring(5);
            if(typeof body[k] == 'object'){
                body[k].forEach((e,i) => {
                    pool.query(`
                        UPDATE notas 
                        SET nota = ?
                        WHERE trimestre = ? 
                            AND id_materia = ? 
                            AND numnota = ? 
                            AND id_alum = ? 
                            `
                            ,[e,t,id, numnota, body.alumno[i], e], function(err, a){
                                
                        });
                });
            }else{
                pool.query(`
                    UPDATE notas 
                    SET nota = ?
                    WHERE trimestre = ? 
                        AND id_materia = ? 
                        AND numnota = ? 
                        AND id_alum = ? 
                        `
                        ,[body[k],t,id, numnota, body.alumno, body[k]], function(err, a){
                            
                    });
            }     
        }
    }
    if(body.button == "Eliminar Nota"){
            pool.query(`
            DELETE FROM notas WHERE
            id_materia = ? AND
            trimestre = ? AND
            numnota = (
                SELECT MAX(numnota)
                FROM notas
                WHERE id_materia = ? AND trimestre = ? AND numnota != 1)
                `
                ,[id, t, id, t], function(err, a){
                    
        });
    }else if(body.button == "Agregar Nota"){
        pool.query(`SELECT MAX(numnota) as a
                    FROM notas
                    WHERE id_materia = ? AND trimestre = ?`
                    ,[id, t], function(err, a){

            body.alumno.forEach(e => {
                pool.query(`
                INSERT INTO notas
                (id_alum, id_materia, trimestre, numnota)
                VALUES
                (?,?,?,?)
                    `
                    ,[e, id, t, a[0]['a'] + 1], function(err, a){
                        
                });
            });
        });
    }else{

    }
    setTimeout(function(){
        res.redirect(`/cargarNotas/${id}/${t}`);
    }, 2000);  
});


exports.renderCargarInasistencias = ((req,res) => {
    let a = JSONrenderCargarInasistencias(req.body)
  
    res.render('cargarInasistencias.hbs', {a, links: 'headerLinks/cargarNotas', user:{user: req.user[0], childs: req.session.childs}});

});

exports.PostCargarInasistencias = ((req,res) => {
   
    let inas = JSONcargarInasistencias(req.user[0].id,req.body);
    pool.query(`
        INSERT INTO inasistencias
                (tipo, motivo, cantidad, fecha, id_us, id_creador)
        VALUES  ?`
        ,[inas], function(err, a){
            if(err)
                res.send(err)
            else
                res.redirect('perfil/p/6');
        });
});