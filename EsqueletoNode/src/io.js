const fs = require('fs');
const path = require('path');
exports.io_init = app => {

    // Initializations
    const server = app.listen(app.get('port'), () => { console.log('Server on port:', app.get('port')); }),
        { Server } = require('socket.io'),
        io = new Server(server, {
            maxHttpBufferSize: 1e8 // 100 MB
        });
    const clients = {};

    // namespace == default == '/'
    io.on('connection', socket => {
        // Envia al client los rooms en los que esta el usuario
        socket.on('loadPage', (user, cb) => {
            console.log(fs.readdirSync('./src/local_database/rooms'));
            cb(
                fs.readdirSync('./src/local_database/rooms')
                    .map(e => {
                        let data = fs.readFileSync(`./src/local_database/rooms/${e}`)
                            .toString()
                            .split('\n')
                            .map(e => e.replace('\r', ''));
                        data.pop();
                        for (let i in data) {
                            if (data[i] == user.id) {
                                if (/«¯§¦Æ×þ®©©»/.test(data[0])) {
                                    data[0] = data[0].split('«¯§¦Æ×þ®©©»');
                                    if (data[0][0] == user.name)
                                        data[0] = data[0][1];
                                    else
                                        data[0] = data[0][0];
                                }
                                return { id: e.replace('.txt', ''), name: data[0] };
                            }
                        }
                    })
            );
        });

        socket.room = 'default';

        socket.on('switchRoom', (newroom, cb) => {
            socket.leave(socket.room);
            socket.join(newroom);


            // ******************************************************************
            // *************** Manejo de participantes en la sala ***************
            // ******************************************************************

            if (socket.room != 'default') {
                clients[socket.room]--;
                if (clients[socket.room] == 0)
                    delete clients[socket.room];
                else
                    io.sockets.in(socket.room).emit('updateMembers', clients[socket.room]);
            }
            if (clients.hasOwnProperty(newroom))
                clients[newroom]++;
            else
                clients[newroom] = 1;

            //No deberia entrar nunca pero un respaldo para ahorrar 2 bits
            if (clients.hasOwnProperty('default'))
                delete clients[socket.room];

            io.sockets.in(newroom).emit('updateMembers', clients[newroom]);
            socket.room = newroom;


            // ******************************************************************
            // ******************** Carga de mensajes del room ******************
            // ******************************************************************

            let arr = [],
                data = fs.readFileSync(`./src/local_database/messages/${newroom}.txt`)
                    .toString()
                    .split('\n')
                    .map(e => e.replace('\r', ''));
            data.pop();
            data.forEach(elem => {
                let x = elem.split('«¯§¦Æ×þ®©©»');
                x[4] = x[4].replace("\r", "");
                if (x[4] != 0)
                    x.push(path.extname(x[4]));
                arr.push(x);
            })
            cb(arr);
            delete arr;
            delete data;
        });

        socket.on('disconnect', () => {
            socket.leave(socket.room);
            if (socket.room != 'default') {
                clients[socket.room]--;
                if (clients[socket.room] == 0)
                    delete clients[socket.room];
                else
                    io.sockets.in(socket.room).emit('updateMembers', clients[socket.room]);
            }
        });

        // Messages
        socket.on('sendMessage', o => {
            let content,
                fileDir;

            if (o.file != 0) {
                switch (checkMime(o.fileType)) {
                    case 0:
                        o.fileName = "BligsedDocs_" + Date.now() + path.extname(o.fileName);
                        fileDir = `./src/public/media/docs/${o.fileName}`;
                        break;
                    case 1:
                        o.fileName = "BligsedImages_" + Date.now() + path.extname(o.fileName);
                        fileDir = `./src/public/media/images/${o.fileName}`;
                        break;
                    case 2:
                        o.fileName = "BligsedAudios_" + Date.now() + path.extname(o.fileName);
                        fileDir = `./src/public/media/audios/${o.fileName}`;
                        break;
                    case 3:
                        o.fileName = "BligsedVideos_" + Date.now() + path.extname(o.fileName);
                        fileDir = `./src/public/media/videos/${o.fileName}`;
                        break;
                }
                //-------------Guarda el archivo--------------
                fs.writeFileSync(fileDir, o.file);

                //-------------str q va a ir a local_database--------------
                content = `${o.content}«¯§¦Æ×þ®©©»${o.user}«¯§¦Æ×þ®©©»${o.date}«¯§¦Æ×þ®©©»${o.time}«¯§¦Æ×þ®©©»${o.fileName}\n`

                //-------------Envia el arr a los clientes --------------
                io.sockets.in(socket.room).emit('newMessage', [o.content, o.user, o.date, o.time, o.fileName, path.extname(o.fileName)]);
            }
            else {
                //-------------str q va a ir a local_database--------------
                content = `${o.content}«¯§¦Æ×þ®©©»${o.user}«¯§¦Æ×þ®©©»${o.date}«¯§¦Æ×þ®©©»${o.time}«¯§¦Æ×þ®©©»${o.file}\n`

                //-------------Envia el arr a los clientes --------------
                io.sockets.in(socket.room).emit('newMessage', [o.content, o.user, o.date, o.time, o.file]);
            }

            //-------------Guarda content en local_database --------------
            fs.appendFileSync(`./src/local_database/messages/${socket.room}.txt`, content);

            delete content;
            delete fileDir;
        });


        // ******************************************************************
        // ************************ Crear Grupo *****************************
        // ******************************************************************

        socket.on('crearGrupo', (o, cb) => {
            let files = fs.readdirSync('./src/local_database/rooms/').length;
            content = `${o.name}\n${o.this_user}\n`;
            if (o.other_users) {
                o.other_users.forEach(elem => {
                    content += `${elem}\n`;
                });
            }
            fs.writeFileSync(`./src/local_database/rooms/${files}.txt`, content);
            cb(true);
            delete content;
            fs.writeFileSync(`./src/local_database/messages/${files}.txt`, '');
            delete files;
        });


        // ******************************************************************
        // ************************ Crear Chat Individual *******************
        // ******************************************************************

        socket.on('crearChatP2P', (o, cb) => {
            let files = fs.readdirSync('./src/local_database/rooms/').length;
            content = `${o.this_name}«¯§¦Æ×þ®©©»${o.other_name}\n${o.this_user}\n${o.other_user}\n`;
            fs.writeFileSync(`./src/local_database/rooms/${files}.txt`, content);
            cb(true);
            delete content;
            fs.writeFileSync(`./src/local_database/messages/${files}.txt`, '');
            delete files;
        });


        // ******************************************************************
        // ************************ Abandonar Grupo *************************
        // ******************************************************************

        socket.on('abanRoom', (id, cb) => {
            let updateContent = [];
            fs.readFileSync(`./src/local_database/rooms/${socket.room}.txt`)
                .toString()
                .split('\n')
                .map(e => e.replace('\r', ''))
                .forEach(elem => {
                    if (elem != id)
                        updateContent.push(elem);
                });
            fs.writeFileSync(`./src/local_database/rooms/${socket.room}.txt`, updateContent.join('\n'));
            console.log(fs.readFileSync(`./src/local_database/rooms/${socket.room}.txt`));
            if (updateContent[1] === '')
                fs.unlinkSync(`./src/local_database/messages/${socket.room}.txt`);
            cb(true)
        });


        // ******************************************************************
        // ***************** Añadir Participante a Grupo ********************
        // ******************************************************************

        socket.on('añadirMiembro', ids => {
            let content = '';
            ids.forEach(id => {
                content += `${id}\n`;
            })
            fs.appendFileSync(`.local_database/rooms/${socket.room}.txt`, content);
        });


        //************************************************************************\\
        //******************************ACA SIGO TESTEANDO************************\\
        //************************************************************************\\













        // ******************************************************************
        // ************************* PUBLICACIONES **************************
        // ******************************************************************

        socket.on('loadPub', cb => {
            socket.join('/publicaciones');
            socket.room = '/publicaciones';
            cb(
                fs.readdirSync('./src/local_database/pubs/')
                    .map(e => {
                        let data = fs.readFileSync(`./src/local_database/pubs/${e}`)
                            .toString()
                            .split('«¯§¦Æ×þ®©©»');
                        if (data[4] != 'no') {
                            data[4] = data[4].split(',');
                            data[4].pop();
                        }
                        return data;
                    })
            );
        });

        socket.on('newPub', o => {
            p = fs.readdirSync('./src/local_database/pubs/').length;
            strp = `${o.title}«¯§¦Æ×þ®©©»${o.desc}«¯§¦Æ×þ®©©»${o.user}«¯§¦Æ×þ®©©»${o.date}«¯§¦Æ×þ®©©»`;
            filesArr = 'no';

            if(o.file != 'no'){
                filesArr = [];
                pf = fs.readdirSync('./src/public/media/pubDocs').length;
                console.log(pf);
                for(let i = 0; i < o.file.length; i++ ){
                    o.file[i].name = `Bl${pf+i}_${o.file[i].name}`;
                    fs.writeFileSync(`./src/public/media/pubDocs/${o.file[i].name}`, o.file[i].file);
                    filesArr.push(o.file[i].name);
                    strp += o.file[i].name+',';
                };
                strp += 'no';
            }
            else
                strp += o.file;

            fs.writeFileSync(`./src/local_database/pubs/${p}.txt`, strp);
            io.sockets.in(socket.room).emit('newPub', [o.title, o.desc, o.user, o.date, filesArr]);            
            delete i, p, pf, filesArr, strp;
        });
    });
}

function checkMime(mime) {
    switch (mime) {
        case 'image/png':
        case 'image/jpeg':
        case 'image/gif':
        case 'image/svg+xml':
        case 'image/bmp':
        case 'image/cis-cod':
        case 'image/ief':
        case 'image/pipeg':
        case 'image/tiff':
        case 'image/x-cmu-raster':
        case 'image/x-cmx':
        case 'image/x-icon':
        case 'image/x-portable-anymap':
        case 'image/x-portable-bitmap':
        case 'image/x-portable-graymap':
        case 'image/x-portable-pixmap':
        case "image/x-rgb":
        case 'image/x-xbitmap':
        case 'image/x-xpixmap':
        case 'image/x-xwindowdump':
            return 1;
            break;
        case 'audio/basic':
        case 'auido/L24':
        case 'audio/mid':
        case 'audio/mpeg':
        case 'audio/mp4':
        case 'audio/x-aiff':
        case 'audio/x-mpegurl':
        case 'audio/vnd.rn-realaudio':
        case 'audio/ogg':
        case 'audio/vorbis':
        case 'audio/vnd.wav':
            return 2;
            break;
        case 'video/mpeg':
        case 'video/mp4':
        case 'video/quicktime':
        case 'video/x-la-asf':
        case 'video/x-ms-asf':
        case 'video/x-msvideo':
        case 'video/x-sgi-movie':
            return 3;
            break;
        default:
            return 0;
            break;
    }
}