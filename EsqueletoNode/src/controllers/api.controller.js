const { reset } = require('colors');
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


exports.eliminarInasistencias = ((req, res) => {
    let id = req.params.id;
    pool.query(`DELETE FROM inasistencias WHERE id = ?`,id, function(err, n){
        if(err){
            res.send({'res': 'error', err});
        }else{
            res.send({'res': 'eliminar', n});
        }
    });
});

exports.actualizarInasistencias = ((req, res) => {
    let {id, date, checkbox, select} = req.params;
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
    let {cantidad, motivo} = tiposInasistencia[select];
    let tipo = checkbox == 'true' ? 1:0;
    pool.query(`    UPDATE inasistencias
                    SET     tipo = ?,
                            motivo = ?,
                            cantidad = ?,
                            fecha = ?
                    WHERE id = ?`,[tipo, motivo, cantidad, date, parseInt(id)], function(err, n){
        if(err){
            res.send({'res': 'error', err});
        }else{
            res.send({'res': 'update', n});
        }
    });
});