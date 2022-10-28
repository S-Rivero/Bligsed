const bcrypt = require("bcryptjs/dist/bcrypt");
const fs = require("fs");
const path = require("path");
const pool = require("./database");
exports.io_init = function (app) {
  // Initializations
  const server = app.listen(app.get("port"), () => {
    console.log("Server on port:", app.get("port"));
  }),
    { Server } = require("socket.io"),
    io = new Server(server, {
      maxHttpBufferSize: 1e9, // 1 GB
    });
  const clients = {};

  // namespace == default == '/'
  io.on("connection", (socket) => {
    socket.room = "default";

    socket.on("loadPage", (user, cb) => {
      fs.readFile(`./src/local_database/users/${user.username}.txt`, (err, data) => {
        if (err) {
          fs.writeFileSync(`./src/local_database/users/${user.username}.txt`, "");
          socket.chats = false;
          cb(null);
        } else {
          data = data.toString();
          if (data == "") {
            socket.chats = false;
            cb(null);
          } else {
            socket.chats = true;
            cb(
              data.split("-").map((e) => {
                return {
                  id: e,
                  name: fs
                    .readFileSync(`./src/local_database/rooms/${e}.txt`)
                    .toString(),
                };
              })
            );
          }
        }
      });
    });

    socket.on("switchRoom", (newroom, cb) => {
      socket.leave(socket.room);
      socket.join(newroom);

      // ******************************************************************
      // *************** Manejo de participantes en la sala ***************
      // ******************************************************************

      if (socket.room != "default") {
        clients[socket.room]--;
        if (clients[socket.room] == 0) delete clients[socket.room];
        else
          io.sockets
            .in(socket.room)
            .emit("updateMembers", clients[socket.room]);
      }
      if (clients.hasOwnProperty(newroom)) clients[newroom]++;
      else clients[newroom] = 1;

      //No deberia entrar nunca pero un respaldo para ahorrar 2 bits
      if (clients.hasOwnProperty("default")) delete clients[socket.room];

      io.sockets.in(newroom).emit("updateMembers", clients[newroom]);
      socket.room = newroom;

      // ******************************************************************
      // ******************** Carga de mensajes del room ******************
      // ******************************************************************

      let arr = [],
        data = fs
          .readFileSync(`./src/local_database/messages/${newroom}.txt`)
          .toString()
          .split("\n")
          .map((e) => e.replace("\r", ""));
      data.pop();
      data.forEach((elem) => {
        let x = elem.split("«¯§¦Æ×þ®©©»");
        x[4] = x[4].replace("\r", "");
        if (x[4] != 0) x.push(path.extname(x[4]));
        arr.push(x);
      });
      cb(arr);
      delete arr;
      delete data;
    });

    socket.on("disconnect", () => {
      socket.leave(socket.room);
      if (socket.room != "default") {
        clients[socket.room]--;
        if (clients[socket.room] == 0) delete clients[socket.room];
        else
          io.sockets
            .in(socket.room)
            .emit("updateMembers", clients[socket.room]);
      }
    });

    socket.on("sendMessage", (o) => {
      let content, fileDir;

      if (o.file != 0) {
        switch (checkMime(o.fileType)) {
          case 0:
            o.fileName = "BligsedDocs_" + Date.now() + path.extname(o.fileName);
            fileDir = `./src/public/media/docs/${o.fileName}`;
            break;
          case 1:
            o.fileName =
              "BligsedImages_" + Date.now() + path.extname(o.fileName);
            fileDir = `./src/public/media/images/${o.fileName}`;
            break;
          case 2:
            o.fileName =
              "BligsedAudios_" + Date.now() + path.extname(o.fileName);
            fileDir = `./src/public/media/audios/${o.fileName}`;
            break;
          case 3:
            o.fileName =
              "BligsedVideos_" + Date.now() + path.extname(o.fileName);
            fileDir = `./src/public/media/videos/${o.fileName}`;
            break;
        }
        //-------------Guarda el archivo--------------
        fs.writeFileSync(fileDir, o.file);

        //-------------str q va a ir a local_database--------------
        content = `${o.content}«¯§¦Æ×þ®©©»${o.user}«¯§¦Æ×þ®©©»${o.date}«¯§¦Æ×þ®©©»${o.time}«¯§¦Æ×þ®©©»${o.fileName}\n`;

        //-------------Envia el arr a los clientes --------------
        io.sockets
          .in(socket.room)
          .emit("newMessage", [
            o.content,
            o.user,
            o.date,
            o.time,
            o.fileName,
            path.extname(o.fileName),
          ]);
      } else {
        //-------------str q va a ir a local_database--------------
        content = `${o.content}«¯§¦Æ×þ®©©»${o.user}«¯§¦Æ×þ®©©»${o.date}«¯§¦Æ×þ®©©»${o.time}«¯§¦Æ×þ®©©»${o.file}\n`;

        //-------------Envia el arr a los clientes --------------
        io.sockets
          .in(socket.room)
          .emit("newMessage", [o.content, o.user, o.date, o.time, o.file]);
      }

      //-------------Guarda content en local_database --------------
      fs.appendFileSync(
        `./src/local_database/messages/${socket.room}.txt`,
        content
      );

      delete content;
      delete fileDir;
    });

    socket.on("crearGrupo", (o, user, cb) => {
      // Cuenta los rooms exitentes para sacar la ID del nuevo
      let files = fs.readdirSync("./src/local_database/rooms/").length;
      let x = false;
      // Es un booleano q da true si es un chat 2p2
      if (o.priv) {
        pool.query(
          "SELECT Nombre FROM usuarios WHERE username = ?",
          o.username,
          (err, name) => {
            if (err || !name[0])
              cb(1);
            else {
              o.name = name[0].Nombre;
              fs.writeFileSync(
                `./src/local_database/rooms/${files}.txt`,
                `${user.name}\n${user.username}\n${o.name}\n${o.username}`
              );
              fs.readFile(`./src/local_database/users/${o.username}.txt`, (err, data) => {
                if (err)
                  fs.writeFileSync(
                    `./src/local_database/users/${o.username}.txt`,
                    `${files}`
                  );
                else {
                  if (data.toString() == "")
                    fs.appendFileSync(
                      `./src/local_database/users/${o.username}.txt`,
                      `${files}`
                    );
                  else
                    fs.appendFileSync(
                      `./src/local_database/users/${o.username}.txt`,
                      `-${files}`
                    );
                }
              });
              restanteCrearGrupo(files, cb, user.username);
            }
          }
        );
      }
      // ES UN GRUPO
      else {
        fs.writeFileSync(
          `./src/local_database/rooms/${files}.txt`,
          `${o.name}`
        );
        restanteCrearGrupo(files, cb, user.username);
      }
      delete files;
    });
    function restanteCrearGrupo(files, cb, u) {
      // USUARIO ACTUAL
      if (socket.chats)
        fs.appendFileSync(
          `./src/local_database/users/${u}.txt`,
          `-${files}`
        );
      else
        fs.appendFileSync(
          `./src/local_database/users/${u}.txt`,
          `${files}`
        );

      // INSTANCIA MENSAJES DEL CHAT (VACIOS)
      fs.writeFileSync(`./src/local_database/messages/${files}.txt`, "");
      cb(0);
    }

    socket.on("abanGrupo", (id, cb) => {
      let data = fs
        .readFileSync(`./src/local_database/users/${username}.txt`)
        .toString(),
        content = [];
      if (/-/.test(data)) {
        data.split("-").forEach((e) => {
          if (e != socket.room) content.push(e);
        });
        if (content.length >= 2)
          fs.writeFileSync(
            `./src/local_database/users/${username}.txt`,
            content.join("-")
          );
        else
          fs.writeFileSync(`./src/local_database/users/${username}.txt`, content[0]);
      } else fs.writeFileSync(`./src/local_database/users/${username}.txt`, "");
      cb(true);
    });

    socket.on("añadirMiembro", (email, room, cb) => {
      pool.query(
        "SELECT id FROM usuarios WHERE username = ?",
        email,
        function (err, id) {
          console.log("Hizo consulta");
          if (err) cb(false);
          else cb(true);
          console.log(id);
          // let list = JSONListaDeCursos(a);
          // let listMat = JSONListaDeMaterias(a);
        }
      );
      // if(ids.length > 1)

      //Consulta a la base de datos buscando en base al nombre
      // fs.readFile(`./src/local_database/users/${o.id}.txt`, (err, data) => {
      //     if(err)
      //         fs.writeFileSync(`./src/local_database/users/${o.id}.txt`, `${files}`);
      //     else{
      //         if(data.toString() == '')
      //             fs.appendFileSync(`./src/local_database/users/${o.id}.txt`, `${files}`);
      //         else
      //             fs.appendFileSync(`./src/local_database/users/${o.id}.txt`, `-${files}`);
      //     }
      // });
    });

    socket.on("loadPub", (cb) => {
      socket.join("/publicaciones");
      socket.room = "/publicaciones";
      cb(
        fs.readdirSync("./src/local_database/pubs/").map((e) => {
          let data = fs
            .readFileSync(`./src/local_database/pubs/${e}`)
            .toString()
            .split("«¯§¦Æ×þ®©©»");
          if (data[4] != "no") {
            data[4] = data[4].split(",");
            data[4].pop();
          }
          return data;
        })
      );
    });

    socket.on("newPub", (o) => {
      p = fs.readdirSync("./src/local_database/pubs/").length;
      strp = `${o.title}«¯§¦Æ×þ®©©»${o.desc}«¯§¦Æ×þ®©©»${o.user}«¯§¦Æ×þ®©©»${o.date}«¯§¦Æ×þ®©©»`;
      filesArr = "no";

      if (o.file != "no") {
        filesArr = [];
        pf = fs.readdirSync("./src/public/media/pubDocs").length;
        for (let i = 0; i < o.file.length; i++) {
          o.file[i].name = `B${pf + i}_${o.file[i].name}`;
          fs.writeFileSync(
            `./src/public/media/pubDocs/${o.file[i].name}`,
            o.file[i].file
          );
          filesArr.push(o.file[i].name);
          strp += o.file[i].name + ",";
        }
        strp += "no";
        delete pf;
      } else strp += o.file;

      fs.writeFileSync(`./src/local_database/pubs/${p}.txt`, strp);
      io.sockets
        .in(socket.room)
        .emit("newPub", [o.title, o.desc, o.user, o.date, filesArr]);
      delete i, p, filesArr, strp;
    });
  });
};

function checkMime(mime) {
  switch (mime) {
    case "image/png":
    case "image/jpeg":
    case "image/gif":
    case "image/svg+xml":
    case "image/bmp":
    case "image/cis-cod":
    case "image/ief":
    case "image/pipeg":
    case "image/tiff":
    case "image/x-cmu-raster":
    case "image/x-cmx":
    case "image/x-icon":
    case "image/x-portable-anymap":
    case "image/x-portable-bitmap":
    case "image/x-portable-graymap":
    case "image/x-portable-pixmap":
    case "image/x-rgb":
    case "image/x-xbitmap":
    case "image/x-xpixmap":
    case "image/x-xwindowdump":
      return 1;
    case "audio/basic":
    case "auido/L24":
    case "audio/mid":
    case "audio/mpeg":
    case "audio/mp4":
    case "audio/x-aiff":
    case "audio/x-mpegurl":
    case "audio/vnd.rn-realaudio":
    case "audio/ogg":
    case "audio/vorbis":
    case "audio/vnd.wav":
      return 2;
    case "video/mpeg":
    case "video/mp4":
    case "video/quicktime":
    case "video/x-la-asf":
    case "video/x-ms-asf":
    case "video/x-msvideo":
    case "video/x-sgi-movie":
      return 3;
    default:
      return 0;
  }
}
