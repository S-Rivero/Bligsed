const pool = require('../database');


exports.pushMsg = function(req, res){
    let sql = "INSERT INTO mensajes (chatroom, id_emisor, contenido, fecha, hora) VALUES ("+req.body.chat+", "+req.body.uid+", '"+req.body.text+"', '"+req.body.date+"', '"+req.body.time+"');";
    pool.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 message uploaded");
        notif();
    });
}

exports.elimChat = function(req, res){
    let str = "DELETE FROM chats WHERE id_chat = "+req.body.id_chat+" AND nombre_chat = '"+req.body.nombre_chat+"';";
    const elim = pool.query(str, function(err, result){
        if (err) throw err;
        //Ahora crea el chat con usuario -1 para que quede la ID registrada
        let str = "INSERT INTO chats (id_chat, id_usuario, nombre_chat) VALUES ("+req.body.id_chat+", -1, '"+req.body.nombre_chat+"');";
        const elim = pool.query(str, function(err, result){
            if (err) throw err;
            console.log("Has eliminado el chat exitosamente");
        });
    });
}

exports.abanChat = function(req, res){
    var str = "DELETE FROM chats WHERE id_chat = "+req.body.id_chat+" AND id_usuario = "+req.user[0].id+" AND nombre_chat = '"+req.body.nombre_chat+"';";
    const crea = pool.query(str, function(err, result){
        if (err) throw err;
        console.log("Has abandonado el chat exitosamente");
    });
}

exports.creaChat = function(req, res){
    const count = pool.query("SELECT COUNT(DISTINCT id_chat) FROM chats;", function(err, count){
        if (err) throw err;

        var str = "INSERT INTO chats (id_chat, id_usuario, nombre_chat) VALUES";
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


//"INSERT INTO publicaciones (titulo, descripcion, autor, fecha) VALUES ('"+req.body.title+"', '"+req.body.desc+"', '"+req.body.autName+"', '"+req.body.date+"');"

/*
MENSAJES CON IMAGES QUE SAQUE DEL EJEMPLO

<li class="plantilla_mensaje mensaje_receptor"><div class="creador_mensaje">Federico Melograna</div><div class="contenido_mensaje"><img src="/media/momo_sad.jpg" alt=""> Checa este momo we :'v</div></li>
<li class="plantilla_mensaje mensaje_receptor"><div class="creador_mensaje">Martin Touriño</div><div class="contenido_mensaje"><img src="/media/momo_sad2.jpg" alt=""> Que sad prro :'v xdxdxdxd</div></li>
<li class="plantilla_mensaje mensaje_emisor"><div class="contenido_mensaje">Lorem ipsum dolor sit amet coem lorem</div></li>
*/