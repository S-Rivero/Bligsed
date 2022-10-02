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

    str =
        `<li style="list-style: none;">
        <div class="publicaciones_autor">
            <div class="autor_nombre">
                ${e[2]}
            </div>
            <div class="autor_fecha">
                ${e[3]}
            </div>
        </div>
        <div class="publicaciones_contenido">
            <div class="contenido_titulo">
                ${e[0]}
            </div>
            <div class="contenido_texto">
                ${e[1]}
            </div>`;
    if (e[4] != 'no') {
        str += `<div class="contenido_archivos">
        `;
        e[4].forEach(e => {
            str += `<a href="/media/pubDocs/${e}" download>${e}</a>
            </br>`;
        })
        str += `
        </div>`;
    }
    str +=
        `<div class="contenido_vermas">
                <a class="boton_vermas">Ver Mas</a>
            </div>
        </div>
    </li>`;

    ul.insertAdjacentHTML('afterbegin', str);
    delete str;
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