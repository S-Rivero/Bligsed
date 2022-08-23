const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../database');
const {JSONPromediosAl} = require('../lib/jsonFormat');
const {esAlumno, setTutor, queTrimestre, setCurso, autorizadoVerPerfil} = require('../lib/helpers');

exports.test = ((req,res)=>{
    res.send(req.params);
});

exports.root = ((req,res) => {
    setCurso(req.user[0].id).then((curso)=>{
        req.session.uid = req.user[0].id;
        req.session.currentUser = req.user[0];
        if(curso[0]){
            req.session.currentUser['curso'] = curso[0].Nombre_curso;
        }else{
            req.session.currentUser['curso'] = req.session.currentUser.Tipo_de_usuario;
        }
        res.redirect('/perfil/datosPersonales');
    });
});

exports.rootId = ((req,res) => {
    let paramsId = req.params.id;
    setCurso(paramsId).then((curso)=>{
        let childsId = req.session.childs.map((res)=>{
            return res.ID;
        });
        if(autorizadoVerPerfil(req.user[0].Tipo_de_usuario, childsId, paramsId)){
            req.session.uid = paramsId;
            pool.query("SELECT * FROM usuarios WHERE id = ?", [paramsId], function(err,a){
                req.session.currentUser = a[0];
                if(curso[0]){
                    req.session.currentUser['curso'] = curso[0].Nombre_curso;
                }else{
                    req.session.currentUser['curso'] = req.session.currentUser.Tipo_de_usuario;
                }
                res.redirect('/perfil/'+paramsId+'/datosPersonales');
            });
        }else{
            res.redirect('/perfil');
        }
    });
});

function datosPersonales(req,res){
    setTutor(req.session.currentUser.id).then((r)=>{ 
        res.render('perfil.hbs', {in: {in: req.session.currentUser, contactos: r[0]}, cu: req.session.currentUser, title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileDatosPersonales', user:{user: req.user[0], childs: req.session.childs}, partial: 'profile/datosPersonales'});
    });  
}
exports.datosPersonales = ((req,res) => {
    datosPersonales(req,res);
});
exports.datosPersonalesId = ((req,res) => {
    datosPersonales(req,res);
});

exports.FichaMedica = ((req,res) => {
    const rows = pool.query("SELECT * FROM fichamedica WHERE id_us = ?", [req.session.uid], function(err, ficha){
        res.render('perfil.hbs', {cu: req.session.currentUser, in: {ina: ficha[0], tdu: req.user[0].Tipo_de_usuario}, title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileFichaMedica', user:{user: req.user[0], childs: req.session.childs}, partial: 'profile/fichaMedica'});
        // res.send(req.session.currentUser);
    });
});

exports.updateFichaMedica = ((req,res) => {
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
        res.redirect("/perfil/fichamedica");
    });
});

exports.inasistencias = ((req,res) => {
    const rows = pool.query("SELECT * FROM inasistencias WHERE id_us = ?", [req.session.uid], function(err, inasistencias){
        res.render('perfil.hbs', {cu: req.session.currentUser, in: inasistencias, title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileInasistencias', user:{user: req.user[0], childs: req.session.childs}, partial: 'profile/inasistencias'});
    });
});

exports.Boletin = ((req,res) => {
    const trimestre = queTrimestre(req.params.t);
    if(trimestre != 0){
        const rows = pool.query("SELECT `nota`, `Materia` FROM usuarios u JOIN notas n ON u.id = n.id_alum JOIN materias m ON m.ID = n.id_materia WHERE u.id = ? AND n.trimestre = ? ORDER BY m.Materia ASC;", [req.session.uid,trimestre], function(err, materias){
            const formateado = JSONPromediosAl(materias);
            res.render('perfil.hbs', {cu: req.session.currentUser, in:{ma: formateado['materias'], cant: formateado.materias[formateado.max['materia']]}, title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileBoletin', user:{user: req.user[0], childs: req.session.childs}, partial: 'profile/boletin'});
        });
    }else{
        res.send("todavia no esta hecho xd");
    }
});
