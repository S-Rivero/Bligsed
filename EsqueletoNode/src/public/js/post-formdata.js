$(document).ready(function(){
    $("form#form_xample").on('submit', function(e){
        e.preventDefault();
        var form = document.getElementById('form_xample');
        if(form.msg_in.value != '')
        {
        datos = Format(form);
        $.ajax({
            type: 'post',
            url: '/xample',
            data: form,
            // data: storage,
            // data: datos,
            processData: false,
            contentType: 'multipart/form-data',
        })
        }
    });
});


function Format(form){
    let now = getDate();
    var string = 'title='+form.title.value+'&desc='+form.desc.value+'&autName='+form.autor.value+'&date='+now.date;
    return string;
}