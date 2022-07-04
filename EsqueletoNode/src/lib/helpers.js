const bcrypt = require('bcryptjs');
const pool = require('../database');
const bodyParser = require('body-parser');
const colors = require('colors');

const promisePool = pool.promise();

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}


exports.encryptPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

exports.matchPassword = async function(password, savedPassword){
    return await bcrypt.compare(password, savedPassword);
}

// exports.findChild = function(idPadre, next){
//     const r = pool.query("SELECT a.ID FROM alumno a JOIN usuarios u ON a.Padre = u.id WHERE u.id = ?", [idPadre], function(err, i){ 
//         return next(null,i);
//     });
// }

let findChild = function(idPadre){
    return pool.promise().query("SELECT a.ID FROM alumno a JOIN usuarios u ON a.Padre = u.id WHERE u.id = ?", [idPadre]);
}

exports.setChild = function(user){
    return new Promise((res,rej)=>{
        if(user.Tipo_de_usuario == 5){
            let uchilds = findChild(user.id).then((r)=>{
                let childs = [];
                r[0].forEach(c => {
                    childs.push(c.ID);
                });
                res(childs);
            });     
        }else{
            res();
        }
    })
    
}


