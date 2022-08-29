$(document).ready(function(){
    $("form#form_msg").on('submit', function(e){
        e.preventDefault();
        var form = document.getElementById('form_msg');
        if(form.msg_in.value != '')
        {
        datos = msgFormat(form);
        $.ajax({
            type: 'post',
            url: '/msg',
            data: datos,
            processData: false,
            contentType: 'multipart/form-data',
        })
        }
    });
});


  
  