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
    return pool.promise().query("SELECT Nombre_curso FROM `curso` JOIN alumno a ON a.ID_Curso = curso.ID WHERE a.ID = ?", [idUs]);
}

exports.setChild = function(user){
    return new Promise((res,rej)=>{
        if(user.Tipo_de_usuario == 5){
            let uchilds = findChild(user.id).then((r)=>{
                let childs = [];
                r[0].forEach(c => {
                    childs.push(c);
                });
                res(childs);
            });     
        }else{
            res();
        }
    })    
}

let findTutor = function(idUs){
    // return pool.promise().query("SELECT nombre,username,Numero_de_telefono,DNI FROM usuarios WHERE id = (SELECT Padre FROM alumno WHERE id = ?)", [idUs]);
    // return pool.promise().query("SELECT u.nombre,u.username,u.Numero_de_telefono,u.DNI FROM usuarios u JOIN alumno a WHERE a.ID = ? AND u.id = a.Padre", [idUs]);
    return pool.promise().query("SELECT u.nombre,u.username,u.Numero_de_telefono,u.DNI FROM usuarios u JOIN alumno a ON u.id = a.Padre WHERE a.ID = ?", [idUs]);
}

exports.setTutor = function(idUs){
    return new Promise((res,rej)=>{
        findTutor(idUs).then((r)=>{
            res(r);
        });
    })    
}

exports.esAlumno = function(tdu) {
    if(tdu === 6) {
      return 'profile/datosContacto';
    }
    return 'profile/void';
}

exports.queTrimestre = function(n){
    return (n>=0&&n<=3)?n:1;
    
}


let findCurso = function(idUs){
    return pool.promise().query("SELECT Nombre_curso FROM `curso` JOIN alumno a WHERE a.ID = ?", [idUs]);
}

exports.setCurso = function(idUs){
    return new Promise((res,rej)=>{
        findCurso(idUs).then((r)=>{
            res(r[0]);
        });
    }) 
}

exports.autorizadoVerPerfil = function(tipo, childsId, id){
    return [0,1,2,3,4].includes(tipo) || childsId.includes(parseInt(id));
}


exports.RandomString = function(length){
    let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}';
    let randArr = [];
    let charactersLength = characters.length - 1;
    for (let i = 0; i < length; i++) {
        randArr.push(characters[Math.floor(Math.random() * charactersLength)]);
    }
    return randArr.join('');
}
