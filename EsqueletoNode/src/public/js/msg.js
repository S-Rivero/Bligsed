$(document).ready(function(){
    $("form#form_data").on('submit', function(e){
        e.preventDefault();
        var form = document.getElementById('form_data');
        
        datos = msgCompressing(form);

        $.ajax({
            type: 'post',
            url: '/msg',
            data: datos,
            processData: false,
            contentType: 'application/x-www-form-urlencoded'
        })

        form.msg_in.value = '';
    });
});

function msgCompressing(data){
  let str = cleanData(data.msg_in.value);
  if (str != '')
  {
      let now = getDate();
      let o = {
          uid: data.uid.value,
          uname: data.uname.value,
          chat: data.cid.value,
          text: str,
          date: now.date,
          time: now.time,
      };
      showMsg(o.uname, o.time, o.text);
      var string = 'uid='+o.uid+'&u_name='+o.uname+'&chat='+o.chat+'&text='+o.text+'&date='+o.date+'&time='+o.time;
      //name=John&age=12
  }
  else 
    console.log('En una futura instancia deberia matar el post');

  return string;
}

function getDate(){
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = (date_ob.getHours()<10?'0':'') + date_ob.getHours();
  let minutes = (date_ob.getMinutes()<10?'0':'') + date_ob.getMinutes();
  let seconds = (date_ob.getSeconds()<10?'0':'') + date_ob.getSeconds();
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
}