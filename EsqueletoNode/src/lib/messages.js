//Insert basura
// INSERT INTO `mensajes` (chatroom, id_emisor, `contenido`, fecha, hora) VALUES (1, 6, 'Hola, como estas?', "2022-6-4", "12:30:47"), (1, 3, 'Todo bien, vos?', "2022-6-4", "12:32:47"),(1, 6, 'Todo joya', "2022-6-4", "12:35:47"),(1, 3, 'NASHEEEEE', "2022-6-4", "12:35:17");

const pool = require('../database');
exports.pushMsg = function(req, res){
    
    let sql = "INSERT INTO mensajes (chatroom, id_emisor, contenido, fecha, hora) VALUES ("+req.body.chat+", "+req.body.uid+", '"+req.body.text+"', '"+req.body.date+"', '"+req.body.time+"')";


    pool.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 message uploaded");
    });
    
}

exports.adminChat = function(req, res){
    var sqlQuerys = [
        //Contar los chats existentes para tener el id del siguiente chat (this + 1)
        "SELECT COUNT(DISTINCT id_chat) FROM chats;",
        //Crea chat con los usuarios seleccionados
        "INSERT INTO chats (id_chat, id_usuario, nombre_chat) VALUES ("+count + 1 +", "+req.body.id_usuario[x]+", '"+req.body.nombre_chat+"'), ("+count + 1 +", "+req.body.id_usuario[x]+", '"+req.body.nombre_chat+"');",

        //Aca borra el chat seleccionado
        "DELETE FROM chats WHERE id_chat = "+req.body.id_chat+" AND nombre_chat = '"+req.body.nombre_chat+"';",
        "INSERT INTO chats (id_chat, id_usuario, nombre_chat) VALUES ("+req.body.id_chat+", -1, '"+req.body.nombre_chat+"');",
        // El usuario -1 no existe y por eso lo meto, para que ocupe el id de chat y las cuentas se puedan seguir dando


        //"Abandonar chat"
        "DELETE FROM chats WHERE id_chat = "+req.body.id_chat+" AND id_usuario = "+req.user[0].id+" AND nombre_chat = '"+req.body.nombre_chat+"';",
    ];
    console.log(sqlQuerys);

}

/*
MENSAJES CON IMAGES QUE SAQUE DEL EJEMPLO

<li class="plantilla_mensaje mensaje_receptor"><div class="creador_mensaje">Federico Melograna</div><div class="contenido_mensaje"><img src="/media/momo_sad.jpg" alt=""> Checa este momo we :'v</div></li>
<li class="plantilla_mensaje mensaje_receptor"><div class="creador_mensaje">Martin Touriño</div><div class="contenido_mensaje"><img src="/media/momo_sad2.jpg" alt=""> Que sad prro :'v xdxdxdxd</div></li>
<li class="plantilla_mensaje mensaje_emisor"><div class="contenido_mensaje">Lorem ipsum dolor sit amet coem lorem</div></li>
*/

