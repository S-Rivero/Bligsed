exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    else
        res.redirect("/login");
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated())
        return next();
    else
        res.redirect("/home");
};

exports.usedRoot = (req, res, next) => {
    // if()
    if(req.session.currentUser && req.session.currentUser.Tipo_de_usuario == 6){
        return next();
    }else{
        res.redirect("/perfil");
    }
    
    //     return next();
    // else
    //     res.redirect("/perfil");
};

exports.usedRootDp = (req, res, next) => {
    // if()
    if(req.session.currentUser){
        return next();
    }else{
        res.redirect("/perfil");
    }
    
    //     return next();
    // else
    //     res.redirect("/perfil");
};
