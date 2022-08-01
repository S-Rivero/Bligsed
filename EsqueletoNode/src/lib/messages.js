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

