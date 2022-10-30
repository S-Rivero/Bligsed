const express = require('express');
const router = express.Router();
const path = require('path');
const { isUndefined } = require('util');
const pool = require('../database');
const { JSONPromediosAl, JSONListaDeCursos, JSONListaDeMaterias, JSONListaAlumnosNotas, JSONrenderCargarInasistencias, JSONcargarInasistencias } = require('../lib/jsonFormat');
const { setChild, RandomString, encryptPassword } = require('../lib/helpers');
//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));
exports.root = ((req, res) => {
    setChild(req.user[0]).then((r) => {
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

exports.renderHome = ((req, res) => { //Actualmente muestra publicaciones nada mas
    if (req.session.currentUser) {
        delete req.session.currentUser;
    }
    res.render('publicaciones.hbs', { links: 'headerLinks/home', user: { user: req.user[0], childs: req.session.childs } });
});

exports.renderChat = ((req, res) => {
    res.render('mensajes.hbs', { links: 'headerLinks/chats', user: { user: req.user[0], childs: req.session.childs } });
});

exports.renderDocumentos = ((req, res) => {
    // res.render('cursos.hbs', {a, links: 'headerLinks/cursos', user:{user: req.user[0], childs: req.session.childs}});
    res.send("documentosxd");
});


exports.renderCursos = ((req, res) => {
    if (req.user[0].Tipo_de_usuario == 4) {
        const rows = pool.query("SELECT c.ID, c.Nombre_curso as Curso, Mat.ID as IdMateria, Mat.Materia as Materia FROM curso c INNER JOIN (SELECT ID, Materia, IdCurso FROM `materias` WHERE profesor = ?) Mat ON c.ID = Mat.IdCurso GROUP BY Curso ORDER BY Curso ASC", req.user[0].id, function (err, a) {
            let list = JSONListaDeCursos(a);
            let listMat = JSONListaDeMaterias(a);
            res.render('cursos.hbs', { tdu: req.user[0].Tipo_de_usuario, list, listMat, links: 'headerLinks/cursos', user: { user: req.user[0], childs: req.session.childs } });
        });
    } else {
        const rows = pool.query("SELECT ID, Nombre_curso as Curso FROM curso GROUP BY Curso ORDER BY Curso ASC", function (err, a) {
            let list = JSONListaDeCursos(a);
            res.render('cursos.hbs', { tdu: req.user[0].Tipo_de_usuario, list, links: 'headerLinks/cursos', user: { user: req.user[0], childs: req.session.childs } });
        });
    }
    // [{"materia":"Quimica","cursos":[{"cuso":"1A","idMateria":5}]},{"materia":"Naturales","cursos":[{"cuso":"6D","idMateria":4}]},{"materia":"Matematicas","cursos":[{"cuso":"7C","idMateria":1}]}]
});
exports.renderTablaCursos = ((req, res) => {
    pool.query("SELECT ID FROM curso WHERE ID = ?", req.params.id, function (err, test) {
        if (!(test[0])) {
            res.redirect('/Cursos');
        } else {
            const rows = pool.query(`
                SELECT p.nombre as nombre_tutor, A.id, A.nombre, A.username, A.Numero_de_telefono, A.Padre
                FROM usuarios p
                JOIN	(SELECT u.id, u.nombre, u.username, u.Numero_de_telefono, a.Padre 
                        FROM alumno a 
                        JOIN usuarios u 
                        ON a.id = u.id 
                        WHERE ID_Curso = ? ORDER BY nombre ASC) A
                ON A.Padre = P.id;
            `, req.params.id, function (err, a) {
                const r = pool.query("SELECT * FROM curso ORDER BY Nombre_curso ASC", function (err, b) {
                    res.render('tabla_curso.hbs', { a, b, tdu: req.user[0].Tipo_de_usuario, links: 'headerLinks/tabla_curso_docente', user: { user: req.user[0], childs: req.session.childs } });
                    // res.send(a);
                });
            });
        }
    });
});

exports.renderTablaTodos = ((req, res) => {
    const rows = pool.query(`
        SELECT nombre, username, id, Numero_de_telefono, Tipo_de_usuario FROM usuarios ORDER BY nombre, username;
    `, function (err, a) {
        res.render('tabla_todos.hbs', { a, tdu: req.user[0].Tipo_de_usuario, links: 'headerLinks/tabla_curso_docente', user: { user: req.user[0], childs: req.session.childs } });
    });
});

exports.cargarNotasDocente = ((req, res) => {
    //Solamente el docente titular puede acceder a la modificaicon de notas
    let idMat = req.params.id;
    let trim = req.params.t;

    pool.query(`
        SELECT IdCurso, Nombre_curso, Materia, A.ID
        FROM materias A
        JOIN curso B
        ON A.IdCurso = B.ID
        WHERE profesor = ?;
    `, [req.user[0].id], function (err, y) {
        if (!(y.some(e => e.ID == idMat))) {
            res.redirect('/');
        } else {
            pool.query(`
            SELECT A.ID, U.Nombre
            FROM alumno A
            JOIN (	SELECT IdCurso 
                    FROM materias 
                    WHERE ID = ?) Z
            ON Z.IdCurso = A.ID_Curso
            JOIN usuarios U 
            ON A.ID = U.ID;
    
            SELECT A.ID, N.nota, N.numnota
            FROM alumno A
            JOIN (	SELECT IdCurso 
                  FROM materias 
                  WHERE ID = ?) Z
            ON Z.IdCurso = A.ID_Curso
            LEFT JOIN(	SELECT nota, id_alum, numnota
                          FROM notas
                        WHERE trimestre = ? AND id_materia = ?) N
            ON N.id_alum = A.ID
            ORDER BY A.ID, N.numnota;
    
            SELECT max(N.numnota) as maxNumNota
            FROM alumno A
            JOIN (	SELECT IdCurso 
                  FROM materias 
                  WHERE ID = ?) Z
            ON Z.IdCurso = A.ID_Curso
            LEFT JOIN(	SELECT nota, id_alum, numnota
                          FROM notas
                        WHERE trimestre = ? AND id_materia = ?) N
            ON N.id_alum = A.ID
            ORDER BY A.ID, N.numnota;

            SELECT A.ID, N.valor
            FROM alumno A
            JOIN (	SELECT IdCurso 
                  FROM materias 
                  WHERE ID = ?) Z
            ON Z.IdCurso = A.ID_Curso
            JOIN    (	SELECT valor, id_alumno
                          FROM finales
                        WHERE trimestre = ? AND id_materia = ?) N
            ON N.id_alumno = A.ID
            ORDER BY A.ID;
    
        `, [idMat, idMat, trim, idMat, idMat, trim, idMat, idMat, trim, idMat], function (err, a) {
                let [listaAlumnos, notas, maxNumNota, notasFinales] = a;
                let max = maxNumNota[0]['maxNumNota'];
                let toInsert = [];
                let toInsertFinales = [];

                if (max) {
                    listaAlumnos.forEach(e => {
                        for (let i = 1; i < max + 1; i++) {
                            if (!(notas.some(x => x.numnota == i && x.ID == e.ID))) {
                                toInsert.push({
                                    id_alum: e.ID,
                                    id_materia: idMat,
                                    nota: 0,
                                    trimestre: trim,
                                    numnota: i
                                });
                            }
                        }
                        if (!(notasFinales.some(x => x.ID == e.ID))) {
                            toInsertFinales.push({
                                id_alum: e.ID,
                                id_materia: idMat,
                                valor: 0,
                                trimestre: trim
                            });
                        }
                    });
                } else {
                    listaAlumnos.forEach(e => {
                        toInsert.push({
                            id_alum: e.ID,
                            id_materia: idMat,
                            nota: 0,
                            trimestre: trim,
                            numnota: 1
                        });

                        if (!(notasFinales.some(x => x.ID == e.ID))) {
                            toInsertFinales.push({
                                id_alum: e.ID,
                                id_materia: idMat,
                                valor: 0,
                                trimestre: trim
                            });
                        }
                    })
                }
                let insert = prepareInsert(toInsert);
                let InsertFinales = prepareInsertFinales(toInsertFinales);
                pool.query(insert, function (err, d) {
                    pool.query(InsertFinales, function (err, s) {
                        res.render('cargarNotas.hbs', { y, links: 'headerLinks/cargarNotas', user: { user: req.user[0], childs: req.session.childs } });
                    })
                })
            });
        }
    });
});

exports.cargarNotasDocenteFinal = ((req, res) => {
    let idMat = req.params.id;
    let trim = 0;

    pool.query(`
        SELECT IdCurso, Nombre_curso, Materia, A.ID
        FROM materias A
        JOIN curso B
        ON A.IdCurso = B.ID
        WHERE profesor = ?;
    `, [req.user[0].id], function (err, y) {
        if (!(y.some(e => e.ID == idMat))) {
            res.redirect('/');
        } else {
            pool.query(`
                SELECT A.ID, U.Nombre
                FROM alumno A
                JOIN (	SELECT IdCurso 
                        FROM materias 
                        WHERE ID = ?) Z
                ON Z.IdCurso = A.ID_Curso
                JOIN usuarios U 
                ON A.ID = U.ID;
                
                SELECT A.ID, N.valor, N.trimestre
                FROM alumno A
                JOIN (	SELECT IdCurso 
                    FROM materias 
                    WHERE ID = ?) Z
                ON Z.IdCurso = A.ID_Curso
                JOIN    (	SELECT valor, id_alumno, trimestre
                            FROM finales
                            WHERE id_materia = ?) N
                ON N.id_alumno = A.ID
                ORDER BY A.ID;
            `, [idMat, idMat, idMat], function(err,a){
                let [listaAlumnos, notasFinales] = a;
                let toInsertFinales = [];
                listaAlumnos.forEach(e => {
                    for (let i = 0; i < 4; i++) {
                        if (!(notasFinales.some(x => x.ID == e.ID && x.trimestre == i))) {
                            toInsertFinales.push({
                                id_alum: e.ID,
                                id_materia: idMat,
                                valor: 0,
                                trimestre: i
                            });
                        }
                    }
                });
                let InsertFinales = prepareInsertFinales(toInsertFinales);
                pool.query(InsertFinales, function (err, s) {
                    res.render('cargarNotasFinal.hbs', { y, links: 'headerLinks/cargarNotas', user: { user: req.user[0], childs: req.session.childs } });
                });
            });
        }
    });
});

function prepareInsert(arr) {
    return `
    INSERT INTO notas (id_alum, id_materia, nota, trimestre, numnota) 
    VALUES 
    ` + arr.map(e => {
        return '(' + e.id_alum + ',' + e.id_materia + ',' + e.nota + ',' + e.trimestre + ',' + e.numnota + ')'
    }).join(',');
}

function prepareInsertFinales(arr) {

    return `
    INSERT INTO finales (id_alumno, id_materia, valor, trimestre) 
    VALUES 
    ` + arr.map(e => {
        return '(' + e.id_alum + ',' + e.id_materia + ',' + e.valor + ',' + e.trimestre + ')'
    }).join(',');
}


exports.POSTcargarNotasDocenteFinal = ((req, res) => {
    let { id } = req.params;
    let body = req.body;
    for (let k in body) {
        if (k != "button" && k != "alumno") {
            if (typeof body[k] == 'object') {
                body[k].forEach((e, i) => {
                    pool.query(`
                        UPDATE finales
                        SET valor = ?
                        WHERE trimestre = ? 
                            AND id_materia = ? 
                            AND id_alumno = ? 
                            `
                        , [e, k, id, body.alumno[i]], function (err, a) {

                        });
                });
            } else {
                pool.query(`
                    UPDATE finales
                    SET valor = ?
                    WHERE trimestre = ? 
                        AND id_materia = ? 
                        AND id_alumno = ? 
                        `
                    , [e, k, id, body.alumno], function (err, a) {

                    });
            }
        }
    }
    setTimeout(function () {
        res.redirect(`/cargarNotas/${id}/0`);
    }, 2000);
});


exports.POSTcargarNotasDocente = ((req, res) => {

    let { id, t } = req.params;
    let body = req.body;

    for (let k in body) {
        if (k != "final" && k != "alumno") {
            let numnota = k.substring(5);
            if (typeof body[k] == 'object') {
                body[k].forEach((e, i) => {
                    pool.query(`
                        UPDATE notas 
                        SET nota = ?
                        WHERE trimestre = ? 
                            AND id_materia = ? 
                            AND numnota = ? 
                            AND id_alum = ? 
                            `
                        , [e, t, id, numnota, body.alumno[i], e], function (err, a) {

                        });
                });
            } else {
                pool.query(`
                    UPDATE notas 
                    SET nota = ?
                    WHERE trimestre = ? 
                        AND id_materia = ? 
                        AND numnota = ? 
                        AND id_alum = ? 
                        `
                    , [body[k], t, id, numnota, body.alumno, body[k]], function (err, a) {

                    });
            }
        } else if (k == "final") {
            let notasFinales = body[k];
            if (notasFinales[1]) {
                notasFinales.forEach((e, i) => {
                    pool.query(`
                            UPDATE finales 
                            SET valor = ? 
                            WHERE   id_materia = ? AND 
                                    id_alumno = ? AND
                                    trimestre = ?;
    
                                `
                        , [e, id, body.alumno[i], t], function (err, a) {

                        });
                })
            } else {
                pool.query(`
                UPDATE finales 
                SET valor = ? 
                WHERE   id_materia = ? AND 
                        id_alumno = ? AND
                        trimestre = ?;

                    `
                    , [notasFinales, id, body.alumno, t], function (err, a) {

                    });
            }
        }
        /*
        UPDATE finales SET valor = 1 WHERE id_materia = 1, id_alumno = 6, trimestre = 1;
        */
    }
    if (body.button == "Eliminar Nota") {
        pool.query(`
            DELETE FROM notas WHERE
            id_materia = ? AND
            trimestre = ? AND
            numnota = (
                SELECT MAX(numnota)
                FROM notas
                WHERE id_materia = ? AND trimestre = ? AND numnota != 1)
                `
            , [id, t, id, t], function (err, a) {

            });
    } else if (body.button == "Agregar Nota") {
        let bodyAlumno = body.alumno;
        pool.query(`SELECT MAX(numnota) as a
                    FROM notas
                    WHERE id_materia = ? AND trimestre = ?`
            , [id, t], function (err, a) {
                if (typeof bodyAlumno != "string") {
                    bodyAlumno.forEach(e => {
                        pool.query(`
                    INSERT INTO notas
                    (id_alum, id_materia, trimestre, numnota)
                    VALUES
                    (?,?,?,?)
                        `
                            , [e, id, t, a[0]['a'] + 1], function (err, a) {

                            });
                    });
                } else {
                    pool.query(`
                        INSERT INTO notas
                        (id_alum, id_materia, trimestre, numnota)
                        VALUES
                        (?,?,?,?)
                            `
                        , [bodyAlumno, id, t, a[0]['a'] + 1], function (err, a) {

                        });
                }
            });
    } else {

    }
    setTimeout(function () {
        res.redirect(`/cargarNotas/${id}/${t}`);
    }, 2000);
});


exports.renderCargarInasistencias = ((req, res) => {
    if (req.body.idSeleccionados) {
        let a = JSONrenderCargarInasistencias(req.body)
        res.render('cargarInasistencias.hbs', { a, links: 'headerLinks/cargarNotas', user: { user: req.user[0], childs: req.session.childs } });
    } else {
        res.redirect('/Cursos');
    }

});

exports.PostCargarInasistencias = ((req, res) => {

    let inas = JSONcargarInasistencias(req.user[0].id, req.body);
    pool.query(`
        INSERT INTO inasistencias
                (tipo, motivo, cantidad, fecha, id_us, id_creador)
        VALUES  ?`
        , [inas], function (err, a) {
            if (err)
                res.send(err)
            else
                res.redirect('/Cursos');
        });
});


exports.homeCrearCuentas = ((req, res) => {
    res.render('homeCrearCuentas.hbs', { links: 'headerLinks/homeCrearCuentas', user: { user: req.user[0], childs: req.session.childs } });
});

const nodemailer = require("nodemailer");
const e = require('connect-flash');

var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    port: 25, // port for secure SMTP
    secureConnection: false,
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: 'bligsededatingcorporation@hotmail.com',
        pass: 'pipaBenedetto09'
    }
});




exports.crearCuentas = (async (req, res) => {
    let tipoCuenta = req.params.tipo;
    if (tipoCuenta == 6) {
        pool.query("SELECT * FROM `curso` ORDER BY Nombre_curso", function (err, a) {
            res.render('crearCuentas.hbs', { cursos: a, tipoCuenta, links: 'headerLinks/crearCuentas', user: { user: req.user[0], childs: req.session.childs } });
            // res.send(a);
        })
    } else {
        res.render('crearCuentas.hbs', { tipoCuenta, links: 'headerLinks/crearCuentas', user: { user: req.user[0], childs: req.session.childs } });
    }
});

exports.insertCuentas = (async (req, res) => {

    let tdu = req.params.tipo;
    let btn = req.body.btn;
    let redirect = btn != "Completar" ? "../crear_cuentas/" + tdu : "../crear_cuentas";
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
    if (tdu != 6) {

        pool.query(
            `INSERT INTO usuarios
            (Tipo_de_usuario, username, Nombre, DNI, Sexo, Fecha_de_nacimiento, Numero_de_telefono, domicilio, password) VALUES
            (?,?,?,?,?,?,?,?,?);`
            , [tdu, username, Nombre, DNI, Sexo, Fecha_de_nacimiento, Numero_de_telefono, domicilio, hashPass], function (err, a) {
                transporter.sendMail({
                    from: 'bligsededatingcorporation@hotmail.com', // sender address
                    to: username, // list of receivers
                    subject: "Bienvenido a Bligsed", // Subject line
                    html: `<b>Usuario: ${username} Contraseña: ${passNoHash}</b>`, // html body
                });
                res.redirect(redirect);
            });
    } else {
        let idTutor = req.body.idTutor;
        let idCurso = req.body.idCurso;
        if (idTutor) { //No hace falta insertar el tutor xq ya existe
            pool.query(
                `INSERT INTO usuarios
                (Tipo_de_usuario, username, Nombre, DNI, Sexo, Fecha_de_nacimiento, Numero_de_telefono, domicilio, password) VALUES
                (?,?,?,?,?,?,?,?,?);`
                , [tdu, username, Nombre, DNI, Sexo, Fecha_de_nacimiento, Numero_de_telefono, domicilio, hashPass], function (err, a) {
                    let insertId = a.insertId;
                    pool.query(`
                    UPDATE alumno SET Padre = ?, ID_Curso = ? WHERE ID = ?;
                `, [idTutor, idCurso, insertId], function (err, b) {
                        transporter.sendMail({
                            from: 'bligsededatingcorporation@hotmail.com', // sender address
                            to: username, // list of receivers
                            subject: "Bienvenido a Bligsed", // Subject line
                            html: `<b>Usuario: ${username} Contraseña: ${passNoHash}</b>`, // html body
                        });
                        res.redirect(redirect);
                    });
                });
        } else {//Hay que crear el usuario padre tb xd
            let { tutorusername, tutorNombre, tutorDNI, tutorSexo, tutorFecha_de_nacimiento, tutorNumero_de_telefono, tutordomicilio } = req.body;
            let passNoHashTutor = RandomString(8);
            let hashPassTutor = await encryptPassword(passNoHashTutor);
            pool.query(
                `INSERT INTO usuarios
                (Tipo_de_usuario, username, Nombre, DNI, Sexo, Fecha_de_nacimiento, Numero_de_telefono, domicilio, password) VALUES
                (?,?,?,?,?,?,?,?,?);`
                , [5, tutorusername, tutorNombre, tutorDNI, tutorSexo, tutorFecha_de_nacimiento, tutorNumero_de_telefono, tutordomicilio, hashPassTutor], async function (err, z) {
                    await transporter.sendMail({
                        from: 'bligsededatingcorporation@hotmail.com', // sender address
                        to: tutorusername, // list of receivers
                        subject: "Bienvenido a Bligsed", // Subject line
                        html: `<b>Usuario: ${tutorusername} Contraseña: ${passNoHashTutor}</b>`, // html body
                    });
                    var tutorId = z.insertId;
                    pool.query(
                        `INSERT INTO usuarios
                        (Tipo_de_usuario, username, Nombre, DNI, Sexo, Fecha_de_nacimiento, Numero_de_telefono, domicilio, password) VALUES
                        (?,?,?,?,?,?,?,?,?);`
                        , [tdu, username, Nombre, DNI, Sexo, Fecha_de_nacimiento, Numero_de_telefono, domicilio, hashPass], function (err, a) {
                            let insertId = a.insertId;
                            pool.query(`
                            UPDATE alumno SET Padre = ?, ID_Curso = ? WHERE ID = ?;
                            `, [tutorId, idCurso, insertId], function (err, b) {
                                transporter.sendMail({
                                    from: 'bligsededatingcorporation@hotmail.com', // sender address
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


exports.buscarCuenta = ((req, res) => {
    res.render('buscarCuenta.hbs', { links: 'headerLinks/buscarCuenta', user: { user: req.user[0], childs: req.session.childs } });
});

exports.buscarCuentaId = ((req, res) => {
    let id = req.params.id;
    let username = "";
    pool.query(`SELECT username FROM usuarios WHERE id = ?`, id, function (err, a) {
        if (a[0]) {
            username = a[0].username;
        }
        res.render('buscarCuenta.hbs', { username: username, links: 'headerLinks/buscarCuenta', user: { user: req.user[0], childs: req.session.childs } });
    });
});
//res.render('tabla_curso.hbs', {a, b, tdu: req.user[0].Tipo_de_usuario, links: 'headerLinks/tabla_curso_docente', user:{user: req.user[0], childs: req.session.childs}});



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

exports.crearCurso = (async (req, res) => {
    // res.render('homeCrearMaterias.hbs', {links: 'headerLinks/homeCrearCuentas', user:{user: req.user[0], childs: req.session.childs}});
    pool.query(`
    SELECT Nombre_curso as name FROM curso;`
        , (err, cursos) => {
            res.render('crearCurso.hbs', { links: 'headerLinks/crearMaterias', user: { user: req.user[0], childs: req.session.childs }, cursos });
        });
});
exports.insertCurso = (async (req, res) => {
    pool.query(
        "INSERT INTO `curso`(`Nombre_curso`) VALUES ('" + req.body.c + "');"
        , (err, e) => {
            if (err) console.log(err); else console.log('Se creo el curso ' + req.body.c);
        });
});

exports.crearMaterias = (async (req, res) => {
    // res.render('homeCrearMaterias.hbs', {links: 'headerLinks/homeCrearCuentas', user:{user: req.user[0], childs: req.session.childs}});
    pool.query(`
    SELECT ID as id, Nombre_curso as name FROM curso ORDER BY Nombre_curso ASC;`
        , (err, cursos) => {
            pool.query(`
        SELECT id, Nombre as name, username as email FROM usuarios WHERE Tipo_de_usuario = 4 ORDER BY Nombre ASC;`
                , (err, doc) => {
                    res.render('crearMaterias.hbs', { links: 'headerLinks/crearMaterias', user: { user: req.user[0], childs: req.session.childs }, docs: doc, cursos });
                });
        });
});
exports.insertMaterias = (async (req, res) => {
    req.body.doc = parseInt(req.body.doc);
    req.body.curso = parseInt(req.body.curso);
    pool.query(
        "INSERT INTO `materias`(`Materia`, `IdCurso`, `profesor`) VALUES ('" + req.body.name + "', " + req.body.curso + ", " + req.body.doc + ");"
        , (err, e) => {
            if (err) console.log(err); else console.log('Se creo la materia ' + req.body.name);
        });
});


exports.crear = ((req, res) => {
    res.render('crear.hbs', { links: 'headerLinks/crear', user: { user: req.user[0], childs: req.session.childs } });
});

exports.editar = ((req, res) => {
    res.render('editar.hbs', { links: 'headerLinks/crear', user: { user: req.user[0], childs: req.session.childs } });
});

exports.editarCurso = ((req, res) => {
    pool.query('SELECT * FROM curso ORDER BY Nombre_curso', function (err, a) {
        res.render('editarCurso.hbs', { a, links: 'headerLinks/cargarNotas', user: { user: req.user[0], childs: req.session.childs } });
    })
});


exports.editarMateria = ((req, res) => {
    pool.query(`
        SELECT m.ID, c.Nombre_curso, m.Materia, m.IdCurso, u.nombre, m.profesor from materias m
        JOIN usuarios u  
        ON u.id = m.profesor
        JOIN curso c
        ON c.ID = m.IdCurso
        ORDER BY c.Nombre_curso, m.Materia
        ;
    `, function (err, a) {
        // res.send(a);
        res.render('editarMateria.hbs', { a, links: 'headerLinks/cargarNotas', user: { user: req.user[0], childs: req.session.childs } });
    });
});

exports.editarMateriaId = ((req, res) => {
    pool.query(`
        SELECT m.ID, c.Nombre_curso, m.Materia, m.IdCurso, u.nombre, m.profesor from materias m
        JOIN usuarios u  
        ON u.id = m.profesor
        JOIN curso c
        ON c.ID = m.IdCurso
        WHERE m.ID = ?
        ORDER BY c.Nombre_curso, m.Materia
        ;
    `, req.params.id, function (err, a) {
        res.render('editarMateriaId.hbs', { a: a[0], links: 'headerLinks/cargarNotas', user: { user: req.user[0], childs: req.session.childs } });
    });

});