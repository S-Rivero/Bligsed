const pool = require('../database');
const {setCurso} = require('./helpers');

exports.setSessionCurso = (req, res, next) => {
    setCurso(req.user[0].id).then((curso)=>{
        if(curso[0]){
            req.session['curso'] = curso[0].Nombre_curso;
        }else{
            req.session['curso'] = req.user[0].Tipo_de_usuario;
        }
        return next();
    });
};
exports.esAlumno = (req, res, next) => {
    if(req.session.curso && req.user[0].Tipo_de_usuario == 6){
        return next();
    }else{
        res.redirect("/perfil/datosPersonales");
    }
};

// exports.usedRootDp = (req, res, next) => {
//     if(req.session.currentUser){
//         return next();
//     }else{
//         res.redirect("/perfil");
//     }
// };

exports.usedRootId = (req, res, next) => {
    if(req.session.currentUser && req.session.currentUser.Tipo_de_usuario == 6){
        return next();
    }else{
        res.redirect("/perfil/p/"+req.params.id);
    }
};

exports.usedRootDpId = (req, res, next) => {
    if(req.session.currentUser){
        return next();
    }else{
        res.redirect("/perfil/p/"+req.params.id);
    }
};

exports.paramEqualsSession = (req,res, next) => {
    if(req.session.currentUser.id == req.params.id){
        return next();
    }else{
        res.redirect("/perfil/p/"+req.params.id);
    }
}   

exports.authLevelCursos = (req,res,next) => {
    if(req.user[0].Tipo_de_usuario < 4){
        return next() //todos los permisos
    }else if(req.user[0].Tipo_de_usuario === 4){
        return next();
    }else{
        res.redirect("/home");
    }
}

exports.authLevelTablaCursos = (req,res,next) => {
    if(req.user[0].Tipo_de_usuario < 4){
        return next() //todos los permisos
    }else if(req.user[0].Tipo_de_usuario === 4){
        return next();//permisos limitados
    }else{
        res.redirect("/home");
    }
}

exports.authLevelCargarNotas = (req,res,next) => {
if(req.user[0].Tipo_de_usuario === 4){
        return next();
    }else{
        res.redirect("/home");
    }
}


exports.authLevelCargarInasistencias = (req,res,next) => {
    if(req.user[0].Tipo_de_usuario === 3){
        return next();
    }else{
        res.redirect("/home");
    }
}