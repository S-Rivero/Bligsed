const pool = require('../../database')
function pushMsg (data){

    document.getElementById('msg').value = '';   
    data = cleanData(data);
    if (data != '')
    {
        let now = getDate();
        var message = {
            user_id: 0,//session id (sacar el nombre del usuario emisor),
            user_name: "Juan Pepito",//session con lo de arriba
            chat: 0,//id del chat,
            msg: data,
            date: now.date,
            time: now.time,
        };
        
        var ul = document.getElementById('contenedor-mensajes');
        var li = document.createElement("li");
        li.innerHTML = data;
        //li.appendChild(document.createTextNode(data));
        ul.appendChild(li);

        var sql = "INSERT INTO mensajes (chat, id_emisor, contenido, fecha, hora) VALUES ("+message.chat+", "+message.user_id+", '"+message.msg+"', '"+message.date+"', '"+message.time+"')";
        console.log(sql);
        /*pool.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });*/
    }
}

function getDate(){
    let date_ob = new Date();
    // current date

    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    // current hours
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();
    // current seconds
    let seconds = date_ob.getSeconds();

    let final_date = {
        //date in YYYY-MM-DD format
        date: year + "-" + month + "-" + date,
        //time in HH:MM:SS format
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