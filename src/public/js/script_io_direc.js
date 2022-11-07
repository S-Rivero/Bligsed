const f = document.getElementById("formPub");

f.addEventListener("submit", (e) => {
    e.preventDefault();
    if(confirm("¿Esta seguro de enviar la publicación?")){
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
        f.title.value = '';
        f.desc.value = '';
        f.file.value = '';
    }
});

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