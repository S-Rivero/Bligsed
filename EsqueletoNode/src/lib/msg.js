exports.sendMsg = (req,res) => {
    var chat = this.getElementById('contenedor-mensajes');
    var msg = this.createElement('li');
    li.textContent = req.msg;
    chat.append(msg);
};
