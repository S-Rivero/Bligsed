// Initializations
const ul = document.getElementById('contenedorPub');

var socket = io.connect();

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
    let pub       = document.createElement('div'),
        autor     = document.createElement('div'),
        aNombre   = document.createElement('div'),
        aFecha    = document.createElement('div'),
        contenido = document.createElement('div'),
        cTitle    = document.createElement('div'),
        cText     = document.createElement('div');

    pub       .className = 'publicacion';
    autor     .className = 'publicacion_autor';
    aNombre   .className = 'autor_nombre';
    aFecha    .className = 'autor_fecha';
    contenido .className = 'publicacion_contenido';
    cTitle    .className = 'contenido_titulo';
    cText     .className = 'contenido_texto';

    if (/\n/.test(e[1])) {
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
        cText.textContent = e[1];

    aFecha.textContent = e[3];
    aNombre.textContent = e[2];
    cTitle.textContent = e[0];

    if (e[4] != 'no') {
        cFiles = document.createElement('div');
        e[4].forEach(e => {
            a = document.createElement('a');
            a.href = `/media/pubDocs/${e}`;
            a.setAttribute('download', e);
            a.textContent = e;
            br = document.createElement('br');
            cFiles.appendChild(a);
            cFiles.appendChild(br);
        })
        cText.appendChild(cFiles);
    }

    autor.appendChild(aNombre);
    autor.appendChild(aFecha);
    contenido.appendChild(cTitle);
    contenido.appendChild(cText);
    pub.appendChild(autor);
    pub.appendChild(contenido);
    ul.insertAdjacentElement("afterbegin", pub);
}