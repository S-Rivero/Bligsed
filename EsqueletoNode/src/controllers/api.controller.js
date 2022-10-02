const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../database');
const {JSONListaAlumnosNotas} = require('../lib/jsonFormat');

exports.idCursoToName = ((req,res) => {
    let id = req.params.id;
    pool.query("SELECT Nombre_curso as C FROM curso WHERE ID = ?", id, function(err, a){
        res.send(a[0]);
    });
});

exports.idMateriaToCurso = ((req,res) => {
    let id = req.params.id;
    pool.query(`
        SELECT Materia as B, Nombre_curso as C
        FROM materias Z
        JOIN curso X
        ON Z.IdCurso = X.ID
        WHERE Z.ID = ?`, id, function(err, a){
            res.send(a[0])
    });
});

exports.ListaAlumnosNotas = ((req,res) => {
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
    ORDER BY Nombre`, [trim,idMat], function(err, a){
        //todas las notas de los alumnos
        pool.query(`SELECT id_alum, nota, numnota
        FROM notas
        WHERE trimestre = ? AND id_materia = ?`, [trim,idMat], function(err, n){
            res.send(JSONListaAlumnosNotas(a,n));
        });
    });
});

