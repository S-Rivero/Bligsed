const bodyParser = require('body-parser');
const pool = require('../database');
exports.pushMsg = function(req, res){

    var body = req.body;
    console.log('Este es el post: %o', body);
    /*
    let str = cleanData(data.msg.value);
    console.log(str);
    if (str != '')
    {
        let now = getDate();
        let msg = {
            user_id: data.uid.value,
            user_name: data.uname.value,
            chat: 0,//id del chat document.getElementByClass('chat active');
            text: str,
            date: now.date,
            time: now.time,
        };
        let db = {
            connectionLimit: data.dbc.value,
            host: data.dbh.value,
            user: data.dbu.value,
            password:  data.dbp.value,
            database:  data.dbdb.value,
        }
        console.log(db);
        showMsg(msg.user_name, msg.time, msg.text);
        let sql = "INSERT INTO mensajes (chat, id_emisor, contenido, fecha, hora) VALUES ("+msg.chat+", "+msg.user_id+", '"+msg.text+"', '"+msg.date+"', '"+msg.time+"')";
        console.log(sql);
        
        // pool.query(sql, function (err, result) {
        //     if (err) throw err;
        //     console.log("1 record inserted");
        // });
        
    }
    document.getElementById('msg').value = '';
    return false;

    document.location.href.replace('msg', '');
    */
}

function getDate(){

    let date_ob = new Date();

    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    let final_date = {
        //  YYYY-MM-DD
        date: year + "-" + month + "-" + date,
        //  HH:MM:SS
        time: hours + ":" + minutes + ":" + seconds,
    };
    return final_date;
}

function cleanData(str){

    let k = 0;
    while (k == 0){
        if(str[0] === ' '){
            if(str.length == 1)
                return '';
            else
                str = str.slice(1, str.length);
        }
        else
            k = 1;
    }
    return str;
}

function showMsg(name, time, text){

    let ul = document.getElementById('mensaje_contenedor');
    let li = document.createElement("li");
    let div_name = document.createElement("div");
    let div_time = document.createElement("div");
    let div_text = document.createElement("div");

    li.classList.add("plantilla_mensaje","mensaje_emisor");
    div_name.classList.add("creador_mensaje");
    div_time.classList.add("hora_mensaje");
    div_text.classList.add("contenido_mensaje");

    div_name.textContent = name;
    div_time.textContent = time;
    div_text.textContent = text;

    li.appendChild(div_name);
    li.appendChild(div_time);
    li.appendChild(div_text);
    ul.appendChild(li);

    /*
    <li class="plantilla_mensaje mensaje_emisor">
        <div class="creador_mensaje">Martin Touriño</div>
        <div class="contenido_mensaje">
            <img src="/Alumnos/media/momo_sad2.jpg" alt="">
            Que sad prro :'v xdxdxdxd
        </div>
    </li>
    */
}