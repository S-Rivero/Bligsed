const express = require('express');
const router = express.Router();
const path = require('path');
const { isUndefined } = require('util');
const pool = require('../database');
const {JSONPromediosAl, JSONListaDeCursos, JSONListaDeMaterias, JSONListaAlumnosNotas, JSONrenderCargarInasistencias, JSONcargarInasistencias} = require('../lib/jsonFormat');
const {setChild, RandomString, encryptPassword} = require('../lib/helpers');
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
    res.render('publicaciones.hbs', {links: 'headerLinks/home', user:{user: req.user[0], childs: req.session.childs}});
});

exports.renderChat = ((req,res) => {
    res.render('mensajes.hbs', {links: 'headerLinks/chats', user:{user: req.user[0], childs: req.session.childs}});
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
    if(req.body.idSeleccionados){
        let a = JSONrenderCargarInasistencias(req.body)
        res.render('cargarInasistencias.hbs', {a, links: 'headerLinks/cargarNotas', user:{user: req.user[0], childs: req.session.childs}});
    }else{
        res.redirect('/Cursos');
    }

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
                res.redirect('/Cursos');
        });
});


exports.homeCrearCuentas = ((req, res) => {
    res.render('homeCrearCuentas.hbs', {links: 'headerLinks/homeCrearCuentas', user:{user: req.user[0], childs: req.session.childs}});
});

const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    port: 25, // port for secure SMTP
    secureConnection: false,
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: 'bligsed@hotmail.com',
        pass: 'pipaBenedetto09'
    }
});




exports.crearCuentas = (async (req, res) => {
    let tipoCuenta = req.params.tipo;
    if(tipoCuenta == 6){
        pool.query("SELECT * FROM `curso` ORDER BY Nombre_curso", function(err,a){
            res.render('crearCuentas.hbs', {cursos: a, tipoCuenta, links: 'headerLinks/crearCuentas', user:{user: req.user[0], childs: req.session.childs}});
            // res.send(a);
        })
    }else{
        res.render('crearCuentas.hbs', {tipoCuenta, links: 'headerLinks/crearCuentas', user:{user: req.user[0], childs: req.session.childs}});
    }
});

exports.insertCuentas = (async(req, res) => {

    let tdu = req.params.tipo;
    let btn = req.body.btn;
    let redirect = btn != "Completar" ? "../crear_cuentas/"+tdu : "../crear_cuentas";
    let arr = [];
    let {
        username,
        Nombre,
        DNI,
        Sexo,
        Fecha_de_nacimiento,
        Numero_de_telefono,
        domicilio
    } = req.body;
    let passNoHash = RandomString(8);
    let hashPass = await encryptPassword(passNoHash);
    if(tdu != 6){
        
        pool.query(
            `INSERT INTO usuarios
            (Tipo_de_usuario, username, Nombre, DNI, Sexo, Fecha_de_nacimiento, Numero_de_telefono, domicilio, password) VALUES
            (?,?,?,?,?,?,?,?,?);`
            ,[tdu, username,Nombre,DNI,Sexo,Fecha_de_nacimiento,Numero_de_telefono,domicilio, hashPass],function(err, a){
                transporter.sendMail({
                    from: 'bligsed@hotmail.com', // sender address
                    to: username, // list of receivers
                    subject: "Bienvenido a Bligsed", // Subject line
                    html: `<b>Usuario: ${username} Contraseña: ${passNoHash}</b>`, // html body
                  });
                res.redirect(redirect);  
        });
    }else{
        let idTutor = req.body.idTutor;
        let idCurso = req.body.idCurso;
        if(idTutor){ //No hace falta insertar el tutor xq ya existe
            pool.query(
                `INSERT INTO usuarios
                (Tipo_de_usuario, username, Nombre, DNI, Sexo, Fecha_de_nacimiento, Numero_de_telefono, domicilio, password) VALUES
                (?,?,?,?,?,?,?,?,?);`
                ,[tdu, username,Nombre,DNI,Sexo,Fecha_de_nacimiento,Numero_de_telefono,domicilio, hashPass],function(err, a){
                let insertId = a.insertId;
                pool.query(`
                    UPDATE alumno SET Padre = ?, ID_Curso = ? WHERE ID = ?;
                `,[idTutor, idCurso, insertId], function(err, b){
                    transporter.sendMail({
                        from: 'bligsed@hotmail.com', // sender address
                        to: username, // list of receivers
                        subject: "Bienvenido a Bligsed", // Subject line
                        html: `<b>Usuario: ${username} Contraseña: ${passNoHash}</b>`, // html body
                      });
                    res.redirect(redirect);
                });   
            });
        }else{//Hay que crear el usuario padre tb xd
            let {tutorusername, tutorNombre, tutorDNI, tutorSexo, tutorFecha_de_nacimiento, tutorNumero_de_telefono, tutordomicilio} = req.body;
            let passNoHashTutor = RandomString(8);
            let hashPassTutor = await encryptPassword(passNoHashTutor);
            pool.query(
                `INSERT INTO usuarios
                (Tipo_de_usuario, username, Nombre, DNI, Sexo, Fecha_de_nacimiento, Numero_de_telefono, domicilio, password) VALUES
                (?,?,?,?,?,?,?,?,?);`
                ,[5,tutorusername, tutorNombre, tutorDNI, tutorSexo, tutorFecha_de_nacimiento, tutorNumero_de_telefono, tutordomicilio, hashPassTutor], async function(err, z){
                    await transporter.sendMail({
                        from: 'bligsed@hotmail.com', // sender address
                        to: tutorusername, // list of receivers
                        subject: "Bienvenido a Bligsed", // Subject line
                        html: `<b>Usuario: ${tutorusername} Contraseña: ${passNoHashTutor}</b>`, // html body
                      });
                    var tutorId = z.insertId;
                    pool.query(
                        `INSERT INTO usuarios
                        (Tipo_de_usuario, username, Nombre, DNI, Sexo, Fecha_de_nacimiento, Numero_de_telefono, domicilio, password) VALUES
                        (?,?,?,?,?,?,?,?,?);`
                        ,[tdu, username,Nombre,DNI,Sexo,Fecha_de_nacimiento,Numero_de_telefono,domicilio, hashPass],function(err, a){
                        let insertId = a.insertId;
                        pool.query(`
                            UPDATE alumno SET Padre = ?, ID_Curso = ? WHERE ID = ?;
                            `,[tutorId, idCurso, insertId], function(err, b){
                            transporter.sendMail({
                                from: 'bligsed@hotmail.com', // sender address
                                to: username, // list of receivers
                                subject: "Bienvenido a Bligsed", // Subject line
                                html: `<b>Usuario: ${username} Contraseña: ${passNoHash}</b>`, // html body
                              });
                            res.redirect(redirect);
                        });   
                    });
            });
        }
    }
      
});


/*
username",
"nombre",
"dni",
"M",
"2022-10-08",
"01163651299",
"domicilio"
tdu
*/

exports.crearMaterias = (async (req, res) => {
    // res.render('homeCrearMaterias.hbs', {links: 'headerLinks/homeCrearCuentas', user:{user: req.user[0], childs: req.session.childs}});
    pool.query(`
    SELECT ID as id, Nombre_curso as name FROM curso;` 
    , function(err, cursos){
        pool.query(`
        SELECT id, Nombre as name, username as email FROM usuarios WHERE Tipo_de_usuario = 4;` 
        , function(err, doc){
            res.render('crearMaterias.hbs', {links: 'headerLinks/crearMaterias', user:{user: req.user[0], childs: req.session.childs}, docs: doc, cursos });
        });   
    });
});
exports.insertMaterias = (async(req, res) => {
    req.body.doc = parseInt(req.body.doc);
    req.body.curso = parseInt(req.body.curso);
    console.log(req.body)
    pool.query(
        "INSERT INTO `materias`(`Materia`, `IdCurso`, `profesor`) VALUES ('"+req.body.name+"', "+req.body.curso+", "+req.body.doc+");"
        ,(err, e) => {
            if(err) console.log(err); else console.log('Funco');
    });
});