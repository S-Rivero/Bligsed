const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../database');
const {JSONPromediosAl, notasFinalesFormat} = require('../lib/jsonFormat');
const {esAlumno, setTutor, queTrimestre, setCurso, autorizadoVerPerfil} = require('../lib/helpers');

exports.test = ((req,res)=>{
    res.send(req.params);
});

exports.root = ((req,res) => {
    res.redirect('/perfil/datosPersonales');
});

exports.rootId = ((req,res) => {
    let paramsId = req.params.id;
    setCurso(paramsId).then((curso)=>{
        let childsId;
        if(req.session.childs){
            childsId = req.session.childs.map((res)=>{
                return res.ID;
            });
        }else{
            childsId = [];
        }
        if(autorizadoVerPerfil(req.user[0].Tipo_de_usuario, childsId, paramsId)){
            req.session.uid = paramsId;
            // pool.query("SELECT id, Nombre, Tipo_de_usuario FROM usuarios WHERE id = ?", [paramsId], function(err,a){
            pool.query("SELECT id, Nombre, Tipo_de_usuario, DNI, username, Numero_de_telefono, domicilio, Fecha_de_nacimiento FROM usuarios WHERE id = ?", [paramsId], function(err,a){
                req.session.currentUser = a[0];
                if(curso[0]){
                    req.session['curso'] = curso[0].Nombre_curso;
                }else{
                    req.session['curso'] = req.session.currentUser.Tipo_de_usuario;
                }
                res.redirect('/perfil/'+paramsId+'/datosPersonales');
            });
        }else{
            res.redirect('/perfil');
        }
    });
});

function datosPersonales(req,res, cu){
    cu['curso'] = req.session.curso;
    setTutor(cu.id).then((r)=>{ 
        res.render('perfil.hbs', {in: {in: cu, contactos: r[0]}, cu, title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileDatosPersonales', user:{user: req.user[0], childs: req.session.childs}, partial: 'profile/datosPersonales'});
        // res.send(cu);
    });  
}
exports.datosPersonales = ((req,res) => {
    datosPersonales(req,res, req.user[0]);
});
exports.datosPersonalesId = ((req,res) => {
    datosPersonales(req,res, req.session.currentUser);
});
//Sidebar: User ([hijos], user.nombre, user.Tipo_de_usuario)
//Head: Links
//Title: title
//Partial: partial

//Profile: cu (El perfil que estoy viendo xd)
//In: partial data
function FichaMedica(req, res, cu){
    cu['curso'] = req.session.curso;
    const rows = pool.query("SELECT * FROM fichamedica WHERE id_us = ?", [cu.id], function(err, ficha){
        res.render('perfil.hbs', {cu, in: {ina: ficha[0], tdu: req.user[0].Tipo_de_usuario}, title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileFichaMedica', user:{user: req.user[0], childs: req.session.childs}, partial: 'profile/fichaMedica'});
        // res.send(req.session.currentUser);
    });
}
exports.FichaMedica = ((req,res) => {
    FichaMedica(req, res, req.user[0]);
});

exports.FichaMedicaId = ((req,res) => {
    FichaMedica(req, res, req.session.currentUser);
});

exports.updateFichaMedica = ((req,res) => { //USA CURRENT USER. NADIE PUEDE PERSONALIZAR SU PROPIA FICHA MEDICA ASI QUE NO ES PROBLEMA
    const {
        Obra_social,
        N_de_afiliado_obra_social,
        Enfermedad,
        Internacion,
        Alergia,
        manifestalergia,
        Tratamiento_medico,
        edad_quirurjico,
        Quirurjico,
        Discapacidad_fisica,
        problemas_salud,
        select_vacunacion,
        Altura,
        Peso,
        Hospital,
        localidad,
        N_telehospit,
        medico_cabeceraln,
        medico_cabecerafn,
        Domiciliomed,
        Familiar_responsableln,
        Familiar_responsablefn,
        Telefono_familiar
    } = req.body;

    const rows = pool.query('UPDATE fichamedica SET `Enfermedad` = "'+Enfermedad+'", `Internacion` = "'+Internacion+'", `Alergia` = "'+Alergia+'", `Tratamiento_medico` = "'+Tratamiento_medico+'", `Quirurjico` = "'+Quirurjico+'", `Vacunacion` = "'+select_vacunacion+'", `Altura` = "'+Altura+'", `Peso` = "'+Peso+'", `Hospital` = "'+Hospital+'", `Obra_social` = "'+Obra_social+'", `N_de_afiliado_obra_social` = "'+N_de_afiliado_obra_social+'", `Medico_cabeceraln` = "'+medico_cabeceraln+'", `Medico_cabecerafn` = "'+medico_cabecerafn+'", `Domiciliomed` = "'+Domiciliomed+'", `manifestalergia` = "'+manifestalergia+'", `edad_quirurjico` = "'+edad_quirurjico+'", `Discapacidad_fisica` = "'+Discapacidad_fisica+'", `problemas_salud` = "'+problemas_salud+'", `localidad` = "'+localidad+'", `N_telehospit` = '+N_telehospit+', `Familiar_responsableln` = "'+Familiar_responsableln+'", `Familiar_responsablefn` = "'+Familiar_responsablefn+'", `Telefono_familiar` = '+Telefono_familiar+', `Telefono_medico` = 2133352223  WHERE DNI = ?', [req.session.currentUser.DNI], function(err, mogus){
        res.redirect("/perfil/"+req.session.currentUser.id+"/fichamedica");
    });
});

function inasistencias(req, res, cu){
    cu['curso'] = req.session.curso;
    const rows = pool.query("SELECT * FROM inasistencias WHERE id_us = ? ORDER BY fecha DESC; SELECT sum(cantidad) as a FROM inasistencias WHERE id_us = ?", [cu.id,cu.id], function(err, inasistencias){
        let newObj = {in0: inasistencias[0], in1: inasistencias[1][0]['a']};
        res.render('perfil.hbs', {cu, in:{in: newObj, tdu: req.user[0].Tipo_de_usuario}, title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileInasistencias', user:{user: req.user[0], childs: req.session.childs}, partial: 'profile/inasistencias'});
    });
};

exports.inasistencias = ((req,res) => {
    inasistencias(req, res,  req.user[0]);
});

exports.inasistenciasId = ((req,res) => {
    inasistencias(req, res, req.session.currentUser);
});



function boletin(req, res, cu){
    cu['curso'] = req.session.curso;
    const trimestre = queTrimestre(req.params.t);
    if(trimestre != 0){
        const rows = pool.query(`
            SELECT A.id_materia, B.Materia, A.nota, A.numnota
            FROM materias B
            JOIN(	SELECT id_materia, nota, numnota
                    FROM notas
                    WHERE 
                        id_alum = ? AND
                        trimestre = ?) A
            ON A.id_materia = B.ID;
        `, [cu.id,trimestre], function(err, materias){
            const formateado = JSONPromediosAl(materias);
            
            let max = formateado.reduce((max, e)=>
                e.notas.length > max ? e.notas.length : max
            ,0)
            res.render('perfil.hbs', {cu, in: {ma: formateado, cant: max}, title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileBoletin', user:{user: req.user[0], childs: req.session.childs}, partial: 'profile/boletin'});

   
        });
    }else{
        pool.query(`
            SELECT A.id_materia, B.Materia, A.valor, A.trimestre
            FROM materias B
            JOIN(	SELECT id_materia, valor, trimestre
                    FROM finales
                    WHERE 
                        id_alumno = ?) A
            ON A.id_materia = B.ID
            ORDER BY B.Materia, A.trimestre;
        `, [cu.id], function(err, materias){
            let formateado = notasFinalesFormat(materias);
            // res.send(formateado);
            res.render('perfil.hbs', {cu, in: formateado, title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileBoletin', user:{user: req.user[0], childs: req.session.childs}, partial: 'profile/boletinFinal'});

   
        });
    }
};

exports.Boletin = ((req,res) => {
    boletin(req, res, req.user[0]);
});

exports.BoletinId = ((req,res) => {
    boletin(req, res, req.session.currentUser);
});

/*
[
  {
    "materia": "Lengua",
    "notas": [
      {
        "valor": 10,
        "trimestre": 1
      }
    ]
  },
  {
    "materia": "Matematicas",
    "notas": [
      {
        "valor": 7,
        "trimestre": 1
      },
      {
        "valor": 0,
        "trimestre": 2
      },
      {
        "valor": 0,
        "trimestre": 3
      }
    ]
  }
]
*/