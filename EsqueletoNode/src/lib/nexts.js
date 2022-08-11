const pool = require('../database');

exports.usedRoot = (req, res, next) => {
    // if()
    if(req.session.currentUser && req.session.currentUser.Tipo_de_usuario == 6){
        return next();
    }else{
        res.redirect("/perfil");
    }
};

exports.usedRootDp = (req, res, next) => {
    // if()
    if(req.session.currentUser){
        return next();
    }else{
        res.redirect("/perfil");
    }
};

exports.who = (req,res,next) =>{
    //if(!(req.session.currentUser.id == req.user[0].id)){
        if(req.params.id){
            console.log("\nAlumno");
            req.session.uid = req.params.id;
            pool.query("SELECT * FROM usuarios WHERE id = ?", [req.params.id], function(err,a){
                req.session.currentUser = a[0];
                next();
            });
        }
        else{
            console.log("\nMiPerfil");
            req.session.uid = req.user[0].id;
            req.session.currentUser = req.user[0];
            next();
        }
    //}else{
     //   next();
    //}
}