const pool = require('../database');
const path = require('path');
const multer = require('multer');
const { captureRejectionSymbol } = require('events');
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        switch(checkMime(file.mimetype)){
            case 0:
                cb(null, path.join(__dirname, '../public/files'));
                break;
            case 1:
                cb(null, path.join(__dirname, '../public/media/images'));
                break;
            case 2:
                cb(null, path.join(__dirname, '../public/media/audios'));
                break;
            case 3:
                cb(null, path.join(__dirname, '../public/media/videos'));
                break;
        }
    },
    filename: (req,file,cb) => {
        console.log(file);
        switch(checkMime(file.mimetype)){
            case 0:
                cb(null, "BligsedDocs_"+Date.now() + path.extname(file.originalname));
                break;
            case 1:
                cb(null, "BligsedImages_"+Date.now() + path.extname(file.originalname));
                break;
            case 2:
                cb(null, "BligsedAudios_"+Date.now() + path.extname(file.originalname));
                break;
            case 3:
                cb(null, "BligsedVideos_"+Date.now() + path.extname(file.originalname));
                break;
        }
    }
});
exports.upload = multer({storage:storage, limits: {fileSize: 50*1024*1024 }});

exports.pushMsg = function(req, res){
    console.log("Body: %o",req.body);
    var sql
    var file = req.files[0];
    if(file){
        let ruta = file.destination.slice(-6) +'/'+ file.filename.replaceAll('\\', '/');
        sql = "INSERT INTO mensajes (chat, user, text, date, time, file, mime) VALUES ("+req.body.chat+", "+req.body.user+", '"+req.body.text+"', '"+req.body.date+"', '"+req.body.time+"', '"+ruta+"', '"+file.mimetype+"');";
    }
    else
        sql = "INSERT INTO mensajes (chat, user, text, date, time, file, mime) VALUES ("+req.body.chat+", "+req.body.user+", '"+req.body.text+"', '"+req.body.date+"', '"+req.body.time+"', null, null);";

    pool.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 message uploaded");
        //notif();
    });
}
    /*
exports.pushMsg = function(req, res){
}
*/
exports.elimChat = function(req, res){
    let str = "DELETE FROM chats WHERE id = "+req.body.id+" AND nombre_chat = '"+req.body.nombre_chat+"';";
    const elim = pool.query(str, function(err, result){
        if (err) throw err;
        //Ahora crea el chat con usuario -1 para que quede la ID registrada
        let str = "INSERT INTO chats (id, id_usuario, nombre_chat) VALUES ("+req.body.id+", -1, '"+req.body.nombre_chat+"');";
        const elim = pool.query(str, function(err, result){
            if (err) throw err;
            console.log("Has eliminado el chat exitosamente");
        });
    });
}
exports.abanChat = function(req, res){
    var str = "DELETE FROM chats WHERE id = "+req.body.id+" AND id_usuario = "+req.user[0].id+" AND nombre_chat = '"+req.body.nombre_chat+"';";
    const crea = pool.query(str, function(err, result){
        if (err) throw err;
        console.log("Has abandonado el chat exitosamente");
    });
}
exports.creaChat = function(req, res){
    const count = pool.query("SELECT COUNT(DISTINCT id) FROM chats;", function(err, count){
        if (err) throw err;

        var str = "INSERT INTO chats (id, id_usuario, nombre_chat) VALUES";
        for (let i = 0; i < req.body.id_usuario.length; i++) {
            if (i == req.body.id_usuario.length - 1)
                str.concat(str," ("+count + 1 +", "+req.body.id_usuario[i]+", '"+req.body.nombre_chat+"');");
            else
                str.concat(str," ("+count + 1 +", "+req.body.id_usuario[i]+", '"+req.body.nombre_chat+"'),");
        }
        const crea = pool.query(str, function(err, result){
            if (err) throw err;
            console.log("El chat ha sido creado con "+req.body.id_usuario.length+" participantes");
        });
    });
}
exports.pushPub = function(req, res){
    let sql = "INSERT INTO publicaciones (titulo, descripcion, autor, fecha) VALUES ('"+req.body.title+"', '"+req.body.desc+"', '"+req.body.autName+"', '"+req.body.date+"');";
    pool.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Pub subida");
    });
}
function notif (req,res){
    fetch('https://api.mynotifier.app', {
        method: 'POST',
            headers: {
            'Content-Type': 'application/json', // To let the server know that we're sending JSON data
        },
        body: JSON.stringify({
            apiKey: 'xxxx-xxxx-xxxx-xxxx', // A unique key you get when signing up
            message: "New payment!", // The message you want to send to yourself/team
            description: "A payment off $99 has been made", // A more descriptive message. It's optional
            type: "success", // info, error, warning or success
            project: "xxxxxx" // If you have more projects on your account then you can specify the project. This is optional.
        }),
    });
}
function checkMime(mime){
    switch (mime) {
        case 'image/png':
        case 'image/jpeg':
        case 'image/gif':
        case 'image/svg+xml':
        case 'image/bmp':
        case 'image/cis-cod':
        case 'image/ief':
        case 'image/pipeg':
        case 'image/tiff':
        case 'image/x-cmu-raster':
        case 'image/x-cmx':
        case 'image/x-icon':
        case 'image/x-portable-anymap':
        case 'image/x-portable-bitmap':
        case 'image/x-portable-graymap':
        case 'image/x-portable-pixmap':
        case "image/x-rgb":
        case 'image/x-xbitmap':
        case 'image/x-xpixmap':
        case 'image/x-xwindowdump':
            return 1;
            break;
        case 'audio/basic':
        case 'auido/L24':
        case 'audio/mid':
        case 'audio/mpeg':
        case 'audio/mp4':
        case 'audio/x-aiff':
        case 'audio/x-mpegurl':
        case 'audio/vnd.rn-realaudio':
        case 'audio/ogg':
        case 'audio/vorbis':
        case 'audio/vnd.wav':
            return 2;
            break;
        case 'video/mpeg':
        case 'video/mp4':
        case 'video/quicktime':
        case 'video/x-la-asf':
        case 'video/x-ms-asf':
        case 'video/x-msvideo':
        case 'video/x-sgi-movie':
            return 3;
            break;
        default:
            return 0;
            break;
    }
}