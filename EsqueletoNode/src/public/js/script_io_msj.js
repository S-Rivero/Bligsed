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

// ******************************************************************
// ************** Carga Inicial de chats pertenecientes *************
// ******************************************************************

window.onload = (e) => {
   socket.emit('loadPage', user, arr => {
      if (arr == [])
         console.log('No se encontraron chats');
      else {
         arr.forEach(elem => {
            ulChats.insertAdjacentHTML('beforeend', `<li class="clearfix cont" onclick="switchChat(this)"><img src="/media/user2.png" alt="avatar"><div class="about"><div class="name">${elem.name}</div><div class="hid">${elem.id}</div></div></li>`);
         });
      }
      delete arr;
   });
};

// ******************************************************************
// ********************** Cambio de Rooms (Chats) *******************
// ******************************************************************

function switchChat(elem) {
   let room = {
      id: elem.children[1].children[1].innerHTML,
      name: elem.children[1].children[0].innerHTML,
   }
   if (actual_room != room) {
      actual_room = room;
      document.getElementById('div_chat_container').classList.remove('hid');
      ul.innerHTML = "";
      socket.emit('switchRoom', actual_room.id, arr => {
         arr.forEach(elem => { printMessage(elem) });
      });
      window.scrollTo(0, document.body.scrollHeight);
      document.getElementById('chatName').innerHTML = actual_room.name;
   }
}

socket.on('updateMembers', num => {
   // Aca se actualiza el valor de los participantes conectados en el room
   if (num == 1)
      document.getElementById('members').innerHTML = 'Actualmente solo tu estas conectado';
   else
      document.getElementById('members').innerHTML = num + ' usuarios en linea';
});

// ******************************************************************
// *********************** Subida de un mensaje *********************
// ******************************************************************

fMsg.addEventListener("submit", (e) => {
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

// ******************************************************************
// *********************** Recibe mensaje nuevo *********************
// ******************************************************************

socket.on('newMessage', arr => {
   printMessage(arr);
   window.scrollTo(0, document.body.scrollHeight);
});

socket.on('redundance', e => { console.log(e) });

//************************************************************************\\
//******************************ACA SIGO TESTEANDO************************\\
//************************************************************************\\

// ******************************************************************
// *********************** Crear un Grupo ***************************
// ******************************************************************

document.getElementById('crearGrupo').addEventListener("click", (e) => {
   e.preventDefault();
   console.log('crear_Grupo');
   // Mostrar un modal con un form para crearlo
});
document.getElementById('fcGrupo').addEventListener("submit", (e) => {
   e.preventDefault();
   console.log('fcGrupo');
   let f = document.getElementById('fcGrupo')
   socket.emit('crearGrupo', {
      name: f.name.value,
      this_user: user.id,
      // other_users: [...f.users.value]
      other_users: [2, 3, 4, 5, 6, 8, 10, 15, 564]
   }, res => {
      if (res)
         window.location.reload();
   });
   delete f;
});

// ******************************************************************
// *********************** Salir de Grupo ***************************
// ******************************************************************

document.getElementById('abanGrupo').addEventListener("click", (e) => {
   e.preventDefault();
   if (confirm(`¿Esta seguro de abandonar el grupo "${actual_room.name}"?`))
      socket.emit('abanRoom', user.id, res => {
         if (res) window.location.reload();
      });
});

document.getElementById('añadirMiembro').addEventListener("click", (e) => {
   e.preventDefault();
   console.log('añadir_Miembro');
});

/*
   //No se que es esto  ---------- Requiere de jQuery / Ajax

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