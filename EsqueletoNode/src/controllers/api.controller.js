const { reset } = require('colors');
const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../database');
const { JSONListaAlumnosNotas } = require('../lib/jsonFormat');
const { RandomString, encryptPassword } = require('../lib/helpers');


exports.idCursoToName = ((req, res) => {
    let id = req.params.id;
    pool.query("SELECT Nombre_curso as C FROM curso WHERE ID = ?", id, function (err, a) {
        res.send(a[0]);
    });
});

exports.idMateriaToCurso = ((req, res) => {
    let id = req.params.id;
    pool.query(`
        SELECT Materia as B, Nombre_curso as C
        FROM materias Z
        JOIN curso X
        ON Z.IdCurso = X.ID
        WHERE Z.ID = ?`, id, function (err, a) {
        res.send(a[0])
    });
});

exports.ListaAlumnosNotas = ((req, res) => {
    let idMat = req.params.id;
    let trim = req.params.t;

    //todos los alumnos de la materia
    pool.query(`SELECT id_alum, Nombre
    FROM usuarios U
    JOIN (	SELECT id_alum
            FROM notas
            WHERE trimestre = ? AND id_materia = ?) N
    ON U.id = N.id_alum
    GROUP BY id_alum
    ORDER BY Nombre`, [trim, idMat], function (err, a) {
        //todas las notas de los alumnos
        pool.query(`SELECT id_alum, nota, numnota
        FROM notas
        WHERE trimestre = ? AND id_materia = ?`, [trim, idMat], function (err, n) {
            res.send(JSONListaAlumnosNotas(a, n));
        });
    });
});


exports.eliminarInasistencias = ((req, res) => {
    let id = req.params.id;
    pool.query(`DELETE FROM inasistencias WHERE id = ?`, id, function (err, n) {
        if (err) {
            res.send({ 'res': 'error', err });
        } else {
            res.send({ 'res': 'eliminar', n });
        }
    });
});

exports.actualizarInasistencias = ((req, res) => {
    let { id, date, checkbox, select } = req.params;
    let tiposInasistencia = {
        '0': {
            "cantidad": 0,
            "motivo": "Ausente no computable"
        },
        '1': {
            "cantidad": 1,
            "motivo": "Ausente TM (Jornada simple)"
        },
        '2': {
            "cantidad": 1,
            "motivo": "Ausente TT (Jornada simple)"
        },
        '3': {
            "cantidad": 0.5,
            "motivo": "Ausente TM"
        },
        '4': {
            "cantidad": 0.5,
            "motivo": "Ausente TT"
        },
        '5': {
            "cantidad": 0.25,
            "motivo": "Tarde TM"
        },
        '6': {
            "cantidad": 0.25,
            "motivo": "Tarde TT"
        }
    }
    let { cantidad, motivo } = tiposInasistencia[select];
    let tipo = checkbox == 'true' ? 1 : 0;
    pool.query(`    UPDATE inasistencias
                    SET     tipo = ?,
                            motivo = ?,
                            cantidad = ?,
                            fecha = ?
                    WHERE id = ?`, [tipo, motivo, cantidad, date, parseInt(id)], function (err, n) {
        if (err) {
            res.send({ 'res': 'error', err });
        } else {
            res.send({ 'res': 'update', n });
        }
    });
});


exports.checkUser = ((req, res) => {
    let username = req.body.username;
    pool.query(`
        SELECT id, Nombre, Tipo_de_usuario, Sexo, DNI, username, Numero_de_telefono, domicilio, Fecha_de_nacimiento FROM usuarios WHERE username = ?
    `, username, function (err, a) {
        if (err) {
            res.send({ err });
        } else {
            res.send({ "res": a[0] });
        }
    });
});


exports.buscarCuenta = (async (req, res) => {
    //username or id
    let { username } = req.params;
    pool.query("SELECT usuarios.*, curso.ID as idCurso, curso.Nombre_curso as Nombre_curso, B.username as padremail FROM usuarios LEFT JOIN alumno ON usuarios.id = alumno.id LEFT JOIN usuarios B ON Padre = B.id LEFT JOIN curso ON curso.ID = alumno.ID_Curso WHERE usuarios.username = ?;", [username], function (err, a) {
        if (a[0]) {
            res.send(a[0]);
        } else {
            res.send({ "res": "nao nao" });
        }
    })
});

const nodemailer = require("nodemailer");

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

exports.actualizarUsuario = (async (req, res) => {
    if (req.body.btn == "Guardar") {
        let { nombre, username, DNI, Sexo, telefono, nacimiento, domicilio, id, oldUsername, pass, tdu } = req.body;

        if (oldUsername != username) {
            pool.query("SELECT username FROM usuarios WHERE username = ?", username, async function (err, z) {
                if (!z[0]) {
                    try {
                        let passNoHash = RandomString(8);
                        pass = await encryptPassword(passNoHash);
                        transporter.sendMail({
                            from: 'bligsededatingcorporation@hotmail.com', // sender address
                            to: username, // list of receivers
                            subject: "Actualizacion en tu usuario", // Subject line
                            html: `<b>Nuevo usuario: ${username} Contraseña: ${passNoHash}</b>`, // html body
                        });
                    } catch (err) {
                        res.redirect('/buscarCuenta/' + id);
                        return;
                    }

                } else {
                    username = oldUsername;
                }
                pool.query(`
                    UPDATE usuarios SET password = ?, Nombre = ?, username = ?, DNI = ?, Sexo = ?, Numero_de_telefono = ?, Fecha_de_nacimiento = ? , domicilio = ?
                    WHERE id = ?;
                    `, [pass, nombre, username, DNI, Sexo, telefono, nacimiento, domicilio, id], function (err, a) {
                    res.redirect('/buscarCuenta');
                })
            });
        }else{
            pool.query(`
                    UPDATE usuarios SET password = ?, Nombre = ?, username = ?, DNI = ?, Sexo = ?, Numero_de_telefono = ?, Fecha_de_nacimiento = ? , domicilio = ?
                    WHERE id = ?;
                    `,[pass, nombre, username, DNI, Sexo, telefono, nacimiento, domicilio, id], function(err,a){
                        res.redirect('/buscarCuenta');
                    })
        }

    } else {
        let { id } = req.body;
        pool.query(`
            DELETE FROM usuarios WHERE id = ?
        `, id, function (err, a) {
            res.redirect('/buscarCuenta');
        });
    }
});

exports.actualizarAlumno = (async (req, res) => {
    let { curso, tutor, btn } = req.body;
    if (btn == "Actualizar Curso") {
        pool.query(`SELECT ID from CURSO WHERE Nombre_curso = ?`, curso, function (err, a) {
            console.log(a);
            if (a[0]) {
                pool.query(`UPDATE alumno SET ID_Curso = ?`, a[0].ID, function (err, b) {
                    res.redirect('/buscarCuenta');
                });
            } else {
                res.redirect('/buscarCuenta');
            }
        });
    }else{
        pool.query(`SELECT id from usuarios WHERE username = ? AND Tipo_de_usuario = 5`,tutor,function(err,a){
            if(a){
                pool.query(`UPDATE alumno SET Padre = ?`,a[0].id,function(err,b){
                    res.redirect('/buscarCuenta');
                });
            } else {
                res.redirect('/buscarCuenta');
            }
        });
    }
});


exports.eliminarCursos = ((req, res) => {
    let cursos = Object.keys(req.body);
    let newCursos = cursos.map(e => parseInt(e));
    pool.query(`DELETE FROM curso WHERE ID IN (?);`, [newCursos], function (err, a) {
        res.redirect('/editarCurso');
    });
    
});

exports.listarDocentes = ((req, res) => {
    pool.query('SELECT id, nombre FROM usuarios WHERE Tipo_de_usuario = 4 ORDER BY nombre',
        function (err, a) {
            res.send(a);
        });
});

exports.listarCursos = ((req, res) => {
    pool.query('SELECT * FROM curso ORDER BY Nombre_curso', function (err, a) {
        res.send(a);
    });
});

exports.actualizarMateria = ((req, res) => {
    let { id, materia, curso, profesor, type } = req.body;

    if(type == "Guardar"){
        pool.query('UPDATE materias SET Materia = ?, IdCurso = ?, profesor = ? WHERE ID = ?',
        [materia, curso, profesor, id], function (err, a) {
            res.redirect('../editarMateria/' + id);
        });
    }else{
        pool.query(`DELETE FROM materias WHERE ID = ?`, id, function(err,a){
            res.redirect('../editarMateria');
        });
    }
});

/*
SELECT A.ID, U.Nombre
FROM alumno A
JOIN (	SELECT IdCurso 
            FROM `materias` 
            WHERE ID = 1) Z
ON Z.IdCurso = A.ID_Curso
JOIN usuarios U 
ON A.ID = U.ID ;
*/




exports.insertNotasVacias = ((req, res) => {
    let { idMat, trim } = req.params;
    pool.query(`
        SELECT A.ID, U.Nombre
        FROM alumno A
        JOIN (	SELECT IdCurso 
                FROM materias 
                WHERE ID = ?) Z
        ON Z.IdCurso = A.ID_Curso
        JOIN usuarios U 
        ON A.ID = U.ID ;
    `, idMat, function (err, a) {
        res.send(a);
    });
})