
//"INSERT INTO publicaciones (titulo, descripcion, autor, fecha) VALUES ('"+req.body.title+"', '"+req.body.desc+"', '"+req.body.autName+"', '"+req.body.date+"');"
$(document).ready(function(){
  $("form#form_msg").on('submit', function(e){
    e.preventDefault();
    let now = getDate();
    this.date.value = now.date;
    this.time.value = now.time;
    this.text.value = cutSpaces(this.text.value);
    if(this.text.value != ''){
      var formData = new FormData(this);
      $.ajax({
        type: "POST",
        url: '/msg',
        data: formData,
        processData: false,
        contentType: false,
        success: function(r){
        },
        error: function (e) {
          console.log("some error", e);
        }
      }); 
    }
    let f = document.getElementById('form_msg');
    f.text.value = null;
    f.file.value = null;
  });
});

$(document).ready(function(){
  $("form#form_pub").on('submit', function(e){
      e.preventDefault();
      var form = document.getElementById('form_pub');
      if (form.title.value != '' && form.desc.value != '')
      {
        datos = pubFormat(form);
        console.log(datos);
        $.ajax({
            type: 'post',
            url: '/pub',
            data: datos,
            processData: false,
            contentType: 'application/x-www-form-urlencoded',
            beforeSend:function(){
              return confirm("¿Esta seguro de subir la publicación?");
            },
            complete: function () {
              form.title.value = '';
              form.desc.value = '';
            },
        })
      }
  });
});
function cutSpaces(str){
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