// Initializations
const fMsg = document.getElementById("formMsg");
const ulChats = document.getElementById("ulChats");
const ul = document.getElementById("ulMsg");
const user = {
   id: document.getElementById('user').children[0].innerText,
   name: document.getElementById('user').children[1].innerText
};
var socket = io.connect();
var actual_room = null;


// *********************************** Essentials ***********************************

window.onload = (e) => {
   socket.emit('loadPage', user, arr => {
      if (arr == null)
         ulChats.insertAdjacentHTML('beforeend', `<li class="clearfix cont"<img src="/media/user2.png" alt="avatar"><div class="about"><div class="name">No se encontraron chats</div></div></li>`);
      else {
         arr.forEach(elem => {
            if(/\n/.test(elem.name)){
               elem.name = elem.name.split('\n');
               if(elem.name[0] == user.name)
                  elem.name = elem.name[1];
               else
                  elem.name = elem.name[0];
               ulChats.insertAdjacentHTML('beforeend', `<li class="clearfix cont" onclick="switchChat(this)"><img src="/media/user2.png" alt="avatar"><div class="about"><div class="name">${elem.name}</div><div class="hid">${elem.id}</div><div class="hid">true</div></div></li>`);
            }
            else
               ulChats.insertAdjacentHTML('beforeend', `<li class="clearfix cont" onclick="switchChat(this)"><img src="/media/user2.png" alt="avatar"><div class="about"><div class="name">${elem.name}</div><div class="hid">${elem.id}</div><div class="hid">false</div></div></li>`);
         });
      }
      delete arr;
   });
};

function switchChat(elem) {
   let room = {
      id: elem.children[1].children[1].innerHTML,
      name: elem.children[1].children[0].innerHTML,
      priv: elem.children[1].children[2].innerHTML,
   }
   if (actual_room != room) {
      actual_room = room;

      /*  Estoy viendo como ocultar el form
      if(actual_room.priv == 'true')
         document.getElementById('añadirMiembro').classList.add("hid");
      else
         document.getElementById('añadirMiembro').classList.remove("hid");
      console.log(document.getElementById('añadirMiembro').classList.value);
      console.log(document.getElementById('añadirMiembro').classList.values());
      */

      document.getElementById('divChatContainer').classList.remove('hid');
      ul.innerHTML = "";
      socket.emit('switchRoom', actual_room.id, arr => {
         arr.forEach(elem => { printMessage(elem) });
      });
      window.scrollTo(0, document.body.scrollHeight);
      document.getElementById('chatName').innerHTML = actual_room.name;
   }
}

socket.on('updateMembers', num => {
   if (num == 1)
      document.getElementById('members').innerHTML = 'Actualmente solo tu estas conectado';
   else
      document.getElementById('members').innerHTML = num + ' usuarios en linea';
});

// *********************************** Chat Management ***********************************

document.getElementById('crearGrupo').addEventListener("click", (e) => {
   e.preventDefault();
   console.log('crear_Grupo');
   // Mostrar un modal con un form para crearlo
});

document.getElementById('fGrupo').addEventListener("submit", (e) => {
   e.preventDefault();
   createChat(false, e.target.name.value);
});
document.getElementById('f2P2').addEventListener("submit", (e) => {
   e.preventDefault();
   createChat(true, {name: e.target.name.value, id: e.target.id.value});
});

function createChat(priv, f){
   if(priv){
      o = {
         name: f.name,
         id: f.id,
         priv: true
      }
   }
   else {
      o = {
         name: f
      }
   }
   socket.emit('crearGrupo', o, user, res => {if (res)window.location.reload();} );
}

document.getElementById('abanGrupo').addEventListener("click", (e) => {
   e.preventDefault();
   if (confirm(`¿Esta seguro de abandonar el grupo "${actual_room.name}"?`))
      socket.emit('abanGrupo', user.id, res => {
         if (res) window.location.reload();
      });
});

document.getElementById('añadirMiembro').addEventListener("click", (e) => {
   e.preventDefault();
   console.log('añadir_Miembro');
});


// *********************************** Messages ***********************************

fMsg.addEventListener("submit", e => {
   e.preventDefault();
   let now = getDate(),
      o = {
         content: fMsg.text.value,
         user: user.name,
         date: now.date,
         time: now.time,
      };

   if (fMsg.file.files[0]) {
      o.file = fMsg.file.files[0];
      o.fileType = fMsg.file.files[0].type;
      o.fileName = fMsg.file.files[0].name;
      fMsg.file.files[0] = '';
   }
   else
      o.file = '0';

   socket.emit('sendMessage', o);
   fMsg.text.value = '';
});

socket.on('newMessage', arr => {
   printMessage(arr);
   window.scrollTo(0, document.body.scrollHeight);
});



/*
   //No se que es esto  ---------- Requiere de jQuery / Ajax
   // Creo que es un eventLIstener de cuando aprete Enter, sirve para enviar el mensaje aunque no tenga el input seleccionado


   // on load of page
   $(function(){

      // when the client hits ENTER on their keyboard
      $('#data').keypress(function(e) {
         if(e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
         }
      });
   });
*/

// *********************************** Auxiliar Functions ***********************************

function getDate() {
   let date_ob = new Date();
   let date = ("0" + date_ob.getDate()).slice(-2);
   let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
   let year = date_ob.getFullYear();
   let hours = (date_ob.getHours() < 10 ? '0' : '') + date_ob.getHours();
   let minutes = (date_ob.getMinutes() < 10 ? '0' : '') + date_ob.getMinutes();
   let final_date = {
      //  YYYY-MM-DD
      date: date + "/" + month + "/" + year,
      //  HH:MM:SS
      time: hours + ":" + minutes,
   };
   return final_date;
}

function printMessage(arr) {

   let str = '';
   if (arr[1] == user.name)
      str =
         `
      <li class="clearfix">
         <div class="message-data text-right">
            <span class="message-data-time">Yo, ${arr[3]}, ${arr[2]}</span>
         </div>
         <div class="message other-message float-right">
      `;
   else
      str =
         `
      <li class="clearfix">
         <div class="message-data">
            <span class="message-data-time">${arr[1]}, ${arr[3]}, ${arr[2]}</span>
         </div>
         <div class="message my-message">
      `;

   if (arr[4] == '0')
      str += `${arr[0]}</div>
         </li>`;
   else {
      switch (checkMime(arr[5])) {
         case 0:
            str += `
            <a href="/media/docs/${arr[4]}" download>${arr[4]}</a>
            </br>
            ${arr[0]}</div>
            </li>`;
            break;
         case 1:
            str += `
            <img style="max-height: 480px; max-width:720px;" src="/media/images/${arr[4]}" alt="No se ha encontrado el archivo">
            </br>
            ${arr[0]}</div>
         </li>`;
            break;
         case 2:
            str += `
            <audio controls>
               <source src="/media/audios/${arr[4]}" type="audio/mpeg">
               <source src="/media/audios/${arr[4]}" type="audio/wav">
               Tu navegador no es compatible con el formato de audio
            </audio>
            </br>
            ${arr[0]}</div>
         </li>`;
            break;
         case 3:
            str += `
            <video style="max-height: 480px; max-width:720px;" controls>
               <source src="/media/videos/${arr[4]}" type="video/mp4">
               <source src="/media/videos/${arr[4]}" type="video/webm">
               Tu navegador no es compatible con el formato de audio
            </video>
            </br>
            ${arr[0]}</div>
         </li>`;
            break;
      }
   }
   ul.insertAdjacentHTML('beforeend', str);
   delete str;
}

function checkMime(mime) {
   switch (mime) {
      case '.png':
      case '.jpg':
      case '.jpeg':
      case '.gif':
         return 1;
      case '.mp3':
      case '.wav':
         return 2;
      case '.mp4':
      case '.webm':
         return 3;
      default:
         return 0;
   }
}