// Initializations
const fMsg = document.getElementById("formMsg");
const ulChats = document.getElementById("ulChats");
const ul = document.getElementById("ulMsg");
const user = {
  // id: document.getElementById("user").children[0].innerText,
  username: document.getElementById("user").children[0].value,
  name: document.getElementById("user").children[1].value,
};
var socket = io.connect();
var actual_room = null;

// *********************************** Essentials ***********************************

window.onload = (e) => {
  socket.emit("loadPage", user, (arr) => {
    if (arr == null)
      ulChats.insertAdjacentHTML(
        "beforeend",
        `<li id="chatNotFound" class="clearfix cont"<img src="/media/user2.png" alt="avatar"><div class="about"><div class="name">No se encontraron chats</div></div></li>`
      );
    else {
      arr.forEach((elem) => {
        if (/\n/.test(elem.name)) {
          elem.name = elem.name.split("\n")
            .map((e) => e.replace("\r", ""));
          if (elem.name[1] == user.username) {
            elem.username = elem.name[3];
            elem.name = elem.name[2];
          } else {
            elem.username = elem.name[1];
            elem.name = elem.name[0];
          }
          ulChats.insertAdjacentHTML(
            "beforeend",
            `<li class="clearfix cont" id="${elem.id}" onclick="switchChat(this)"><img src="/media/user2.png" alt="avatar"><div class="about"><div class="name">${elem.name}</div><input type="hidden" value="true"><input type="hidden" value="${elem.username}"></div></li>`
          );
        } else
          ulChats.insertAdjacentHTML(
            "beforeend",
            `<li class="clearfix cont" id="${elem.id}" onclick="switchChat(this)"><img src="/media/user2.png" alt="avatar"><div class="about"><div class="name">${elem.name}</div><input type="hidden" value="false"></div></li>`
          );
      });
    }
    delete arr;
  });
};

function switchChat(elem) {
  let room = {
    id: elem.id,
    name: elem.children[1].children[0].innerHTML,
    priv: elem.children[1].children[1].value,
  };
  if (room.priv == 'true')
    room.username = elem.children[1].children[2].value;
  if (actual_room != room) {
    if (actual_room)
      document.getElementById(actual_room.id).classList.remove("active");
    elem.classList.add("active");

    actual_room = room;

    if (actual_room.priv == "true")
      document.getElementById("añadirMiembro").classList.add("hid");
    else document.getElementById("añadirMiembro").classList.remove("hid");

    ul.innerHTML = "";
    socket.emit("switchRoom", actual_room.id, (arr) => {
      arr.forEach((elem) => {
        printMessage(elem);
      });
    });
    window.scrollTo(0, document.body.scrollHeight);
    document.getElementById("chatName").innerHTML = actual_room.name;
    elem.classList.add("active");
  }
}

socket.on("updateMembers", (num) => {
  if (num == 1)
    document.getElementById("members").innerHTML =
      "Actualmente solo tu estas conectado";
  else
    document.getElementById("members").innerHTML = num + " usuarios en linea";
});

// *********************************** Chat Management ***********************************

document.getElementById("crearGrupo").addEventListener("click", (e) => {
  e.preventDefault();
  console.log("crear_Grupo");
  // Mostrar un modal con un form para crearlo
});

document.getElementById("fGrupo").addEventListener("submit", (e) => {
  e.preventDefault();
  createChat(false, e.target.name.value);
});
document.getElementById("f2P2").addEventListener("submit", (e) => {
  e.preventDefault();
  createChat(true, e.target.username.value);
});

function createChat(priv, f) {
  let x = true;
  if (priv) {
    o = {
      username: f,
      priv: true,
    };
    x = checkChatExist(o.username);
  } else {
    o = {
      name: f,
    };
  }
  if(o.username != user.username){
    x
      ? socket.emit("crearGrupo", o, user, (res) => {
        switch (res) {
          case 0:
            window.location.reload();
            break;
          case 1:
            alert('No se encontró al usuario seleccionado');
            break;
          default:
            alert('Vino al default');
            break;
        }
      })
      : alert("El chat seleccionado ya existe");
  } 
  else 
    alert('No puedes crear un chat con tu propio usuario');
}

function checkChatExist(username) {
  if(ulChats.children[0].id != 'chatNotFound')
    for (let i = 0; i < ulChats.children.length; i++) {
      if (ulChats.children[i].children[1].children[1].value == 'true')
        if (ulChats.children[i].children[1].children[2].value == username)
          return false;
    }
  return true;
  //priv: elem.children[1].children[1].value,
  //room.username = elem.children[1].children[2].value;
}

document.getElementById("abanGrupo").addEventListener("click", (e) => {
  e.preventDefault();
  if (confirm(`¿Esta seguro de abandonar el grupo "${actual_room.name}"?`))
    socket.emit("abanGrupo", user.username, (res) => {
      if (res) {
        alert('Has salido del grupo exitosamente');
        window.location.reload();
      }
      else
        alert('Ha ocurrido un error y no pudiste salir del grupo');
    });
});

document.getElementById("añadirMiembro").addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit(
    "añadirMiembro",
    e.target.username.value,
    actual_room.id,
    (res) => {
      switch (res){
        case 0:
          alert('Se añadio a ' + e.target.username.value + ' exitosamente a ' + actual_room.name);
          document.getElementById("añadirMiembro").username.value = "";
          break;
        case 1:
          alert('No se encontro el usuario ingresado');
          break;
        case 2: 
          alert('El usuario ya pertenece al grupo');
          break;
          default: break;
      }
    }
  );
});

// *********************************** Messages ***********************************

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
    fMsg.file.files[0] = "";
  } else o.file = "0";

  socket.emit("sendMessage", o);
  fMsg.text.value = "";
  fMsg.file.value = "";
});

socket.on("newMessage", (arr) => {
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
  let hours = (date_ob.getHours() < 10 ? "0" : "") + date_ob.getHours();
  let minutes = (date_ob.getMinutes() < 10 ? "0" : "") + date_ob.getMinutes();
  let final_date = {
    //  YYYY-MM-DD
    date: date + "/" + month + "/" + year,
    //  HH:MM:SS
    time: hours + ":" + minutes,
  };
  return final_date;
}

function printMessage(arr) {
  let li = document.createElement("li"),
    divName = document.createElement("div"),
    spanName = document.createElement("span"),
    divMsg = document.createElement("div"),
    spanMsg = document.createElement("span");

  li.className = "clearfix";
  spanName.className = "message-data-time";
  if (arr[1] == user.name) {
    divName.className = "message-data text-right";
    divMsg.className = "message other-message float-right";
    spanName.textContent = `Yo, ${arr[3]}, ${arr[2]}`;
  } else {
    divName.className = "message-data";
    divMsg.className = "message my-message";
    spanName.textContent = `${arr[1]}, ${arr[3]}, ${arr[2]}`;
  }
  spanMsg.textContent = arr[0];

  if (arr[4] != "0") {
    let file;
    let str = "No se ha encontrado el archivo";
    let br = document.createElement("br");
    switch (checkMime(arr[5])) {
      case 0:
        file = document.createElement("a");
        file.href = `/media/docs/${arr[4]}`;
        file.setAttribute("download", arr[4]);
        file.textContent = arr[4];
        divMsg.appendChild(file);
        divMsg.appendChild(br);
        break;
      case 1:
        file = document.createElement("img");
        file, (className = "img-msg");
        file.src = `/media/images/${arr[4]}`;
        file.alt = "No se ha encontrado el archivo";
        divMsg.appendChild(file);
        divMsg.appendChild(br);
        break;
      case 2:
        file = document.createElement("audio");
        file.className = "audio-msg";
        file.controls = true;
        let srca1 = document.createElement("source");
        srca1.src = `/media/audios/${arr[4]}`;
        srca1.type = "audio/mpeg";
        let srca2 = document.createElement("source");
        srca2.src = `/media/audios/${arr[4]}`;
        srca2.type = "audio/wav";
        file.appendChild(srca1);
        file.appendChild(srca2);
        divMsg.appendChild(file);
        divMsg.appendChild(br);
        break;
      case 3:
        file = document.createElement("video");
        file, (className = "video-msg");
        file, (controls = true);
        let srcv1 = document.createElement("source");
        srcv1.src = `/media/videos/${arr[4]}`;
        srcv1.type = "video/mp4";
        let srcv2 = document.createElement("source");
        srcv2.src = `/media/videos/${arr[4]}`;
        srcv2.type = "video/webm";
        file.appendChild(srcv1);
        file.appendChild(srcv2);
        divMsg.appendChild(file);
        divMsg.appendChild(br);
        break;
    }
  }
  divMsg.appendChild(spanMsg);
  divName.appendChild(spanName);
  li.appendChild(divName);
  li.appendChild(divMsg);
  ul.appendChild(li);
}

function checkMime(mime) {
  switch (mime) {
    case ".png":
    case ".jpg":
    case ".jpeg":
    case ".gif":
      return 1;
    case ".mp3":
    case ".wav":
      return 2;
    case ".mp4":
    case ".webm":
      return 3;
    default:
      return 0;
  }
}
