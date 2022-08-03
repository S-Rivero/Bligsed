const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../database');
const {JSONPromediosAl} = require('../lib/jsonFormat');
const {esAlumno, setTutor, queTrimestre} = require('../lib/helpers');

exports.root = ((req,res) => {
    // delete req.session.uid;
    let tdu = req.user[0].Tipo_de_usuario;
    
    if(req.params.id){
        
        req.session.uid = req.params.id;
        console.log("HAY PARAM");
    }
    else{

        req.session.uid = req.user[0].id;
        console.log("NO HAY PARAM");
    }

    res.redirect('/perfil/datosPersonales');
});

exports.datosPersonales = ((req,res) => {
    let contacto = esAlumno(req.user[0].Tipo_de_usuario);
    let contactos = setTutor(req.user[0].id).then((r)=>{
        res.render('perfil.hbs', {in: req.user[0], title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileDatosPersonales', user:{user: req.user[0], childs: req.session.childs}, partial: 'profile/datosPersonales', contacto, contactos: r[0]});
    });
});


exports.FichaMedica = ((req,res) => {
    const rows = pool.query("SELECT * FROM fichamedica WHERE id_us = ?", [req.session.uid], function(err, ficha){
        res.render('perfil.hbs', {in: ficha, title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileFichaMedica', user:{user: req.user[0], childs: req.session.childs}, partial: 'profile/fichaMedica', contacto: 'profile/void'});
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

    const rows = pool.query('UPDATE fichamedica SET `Enfermedad` = "'+Enfermedad+'", `Internacion` = "'+Internacion+'", `Alergia` = "'+Alergia+'", `Tratamiento_medico` = "'+Tratamiento_medico+'", `Quirurjico` = "'+Quirurjico+'", `Vacunacion` = "'+select_vacunacion+'", `Altura` = "'+Altura+'", `Peso` = "'+Peso+'", `Hospital` = "'+Hospital+'", `Obra_social` = "'+Obra_social+'", `N_de_afiliado_obra_social` = "'+N_de_afiliado_obra_social+'", `Medico_cabeceraln` = "'+medico_cabeceraln+'", `Medico_cabecerafn` = "'+medico_cabecerafn+'", `Domiciliomed` = "'+Domiciliomed+'", `manifestalergia` = "'+manifestalergia+'", `edad_quirurjico` = "'+edad_quirurjico+'", `Discapacidad_fisica` = "'+Discapacidad_fisica+'", `problemas_salud` = "'+problemas_salud+'", `localidad` = "'+localidad+'", `N_telehospit` = '+N_telehospit+', `Familiar_responsableln` = "'+Familiar_responsableln+'", `Familiar_responsablefn` = "'+Familiar_responsablefn+'", `Telefono_familiar` = '+Telefono_familiar+', `Telefono_medico` = 2133352223  WHERE DNI = ?', [req.user[0].DNI], function(err, mogus){
        res.redirect("/perfil/fichamedica");
    });
});

exports.inasistencias = ((req,res) => {
    const rows = pool.query("SELECT * FROM inasistencias WHERE id_us = ?", [req.session.uid], function(err, inasistencias){
        res.render('perfil.hbs', {in: inasistencias, title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileInasistencias', user:{user: req.user[0], childs: req.session.childs}, partial: 'profile/inasistencias', contacto: 'profile/void'});
    });
});

exports.mensajes = ((req,res) => {
    res.redirect("/");
});

exports.Boletin = ((req,res) => {
    const trimestre = queTrimestre(req.params.t);
    if(trimestre != 0){
        const rows = pool.query("SELECT `nota`, `Materia` FROM usuarios u JOIN notas n ON u.id = n.id_alum JOIN materias m ON m.ID = n.id_materia WHERE u.id = ? AND n.trimestre = ? ORDER BY m.Materia ASC;", [req.session.uid,trimestre], function(err, materias){
            const formateado = JSONPromediosAl(materias);
            res.render('perfil.hbs', {in:{ma: formateado['materias'], cant: formateado.materias[formateado.max['materia']]}, title: 'Mi Cuenta - Bligsed', links: 'headerLinks/profileBoletin', user:{user: req.user[0], childs: req.session.childs}, partial: 'profile/boletin', contacto: 'profile/void'});
        });
    }else{
        res.send("todavia no esta hecho xd");
    }
});
