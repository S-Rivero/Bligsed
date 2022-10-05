// Initializations
const f = document.getElementById("formPub");
const ul = document.getElementById('contenedorPub');

var socket = io.connect();

f.addEventListener("submit", (e) => {
    e.preventDefault();
    // if(confirm("¿Esta seguro de enviar la publicación?")){
        now = getDate();
        o = {
            user: f.user.value,
            title: f.title.value,
            desc: f.desc.value,
            date: now.date  
        }
        if (f.file.files[0]) {
            o.file = Object.values(f.file.files).map(e => { return {file: e, name: e.name} });
            // o.file = Object.values(f.file.files).map(e => { return {file: e } });
        }
        else
            o.file = 'no';
        socket.emit('newPub', o);
        delete o, now;
    // }
});

window.onload = () => {
    socket.emit('loadPub', arr => {
        arr.forEach(e => printPub(e));
    })
}

socket.on('newPub', arr => {
    printPub(arr)
})

function printPub(e) {
    // title1 «¯§¦Æ×þ®©©» desc1 «¯§¦Æ×þ®©©» name «¯§¦Æ×þ®©©» date «¯§¦Æ×þ®©©» file1,file2,no
    console.log(e);
    let pub       = document.createElement('li'),
        autor     = document.createElement('div'),
        aNombre   = document.createElement('div'),
        aFecha    = document.createElement('div'),
        contenido = document.createElement('div'),
        cTitle    = document.createElement('div'),
        cText     = document.createElement('div'),
        cVer      = document.createElement('div'),
        caVer     = document.createElement('a'  );

    pub       .style     = "list-style: none";
    autor     .className = 'publicaciones_autor';
    aNombre   .className = 'autor_nombre';
    aFecha    .className = 'autor_fecha';
    contenido .className = 'publicaciones_contenido';
    cTitle    .className = 'contenido_titulo';
    cText     .className = 'contenido_texto';
    cVer      .className = 'contenido_vermas';
    caVer     .className = 'boton_vermas';
    
    if('/\n/'.test(e[1])){
        e[1] = e[1].split('\n');
        e[1].forEach(e => {
            p = document.createElement('p');
            br = document.createElement('br');
            p.textContent = e;
            cText.appendChild(p);
            cText.appendChild(br);
        })
    }
    else
        cText.textContent  = e[1];

    caVer.textContent   = 'Ver más';
    aFecha.textContent  = e[3];
    aNombre.textContent = e[2];
    cTitle.textContent  = e[0];

    
    autor.appendChild(aNombre);
    autor.appendChild(aFecha);
    cVer.appendChild(caVer);
    contenido.appendChild(cTitle);
    contenido.appendChild(cText);
    contenido.appendChild(cVer);
    
    if (e[4] != 'no') {
        cFiles = document.createElement('div');
        cFiles.className = 'contenido_archivos';
        e[4].forEach(e => {
            a = document.createElement('a');
            a.href = `/media/pubDocs/${e}`;
            a.setAttribute('download',"download");
            a.textContent = e;
            br = document.createElement('br');
            cFiles.appendChild(a);
            cFiles.appendChild(br);
        })
        contenido.appendChild(cFiles);
    }
    
    pub.appendChild(autor);
    pub.appendChild(contenido);
    ul.insertAdjacentElement("afterbegin", pub);
}


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