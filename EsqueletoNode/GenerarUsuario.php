<?php
    //Necesita un formulario que le pase un mail y un tipo de usuario
    include('config.php'); 
    //Cualquier usuario puede hacer esto por ahora. Verificar con la Session que quien lo haga tenga permisos

    if(isset($_POST['Crear'])){
        $mail = $_POST['mail'];
        $mailInvalido = validarMail($conn, $mail);

        if($mailInvalido == 1){
            mensajeError(1);
        }
        else {
            $tipo = $_POST['tipo'];

            $pass = RandomString(10);
            $passHash = password_hash($pass,PASSWORD_DEFAULT);

            $tipo_de_usuario = obtenerTipo($tipo);
            
            
            if(cargarDato($conn, $mail, $tipo_de_usuario, $passHash) == 0){
                mandarMail($mail, $tipo_de_usuario, $pass);
            }
        }
    }

    function mensajeError($n){
        switch ($n) {
            case 1:
                echo'<script type="text/javascript">
                alert("Este mail ya esta registrado");
                </script>';
                break;
            
            default:
                echo'<script type="text/javascript">
                alert("Error desconocido");
                </script>';
                break;
        }
    }

    function RandomString($length)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randstring = '';
        $charactersLength = strlen($characters) - 1;
        for ($i = 0; $i < $length; $i++) {
            $randstring =  $randstring.$characters[rand(0, $charactersLength)];
        }
        return $randstring;
    }

    function obtenerTipo($t){
        switch ($t) {
            case 'Alumno':
                $tdu = 4;
                break;
            
            case 'Docente':
                $tdu = 5;
                break;
                
            default: //Hay que evitar que se suban los datos erroneos a la BDD/ Se puede usar una especie de bandera para corroborar que el dato sea integro
                echo'<script type="text/javascript">
                alert("ERROR EN EL TIPO DE USUARIO");
                </script>';
                break;
        }
        return $tdu;
    }

    function cargarDato($conn, $m, $t, $p){
        $consulta = $conn->prepare("INSERT INTO usuarios(Mail, Tipo_de_usuario, Contraseña) VALUES (:mail, :tipo, :pass)");
        $consulta->bindParam("mail", $m, PDO::PARAM_STR); 
        $consulta->bindParam("tipo", $t, PDO::PARAM_STR); 
        $consulta->bindParam("pass", $p, PDO::PARAM_STR);
        $resultado = $consulta -> execute();

        if(!$resultado){
            echo'<script type="text/javascript">
            alert("No se pudo cargar el usuario "'.$m.');
            </script>';
            return 1;
        }
        else {
            return 0;
        }
    }

    function validarMail($conn, $m){
        $consulta = $conn->prepare("SELECT * FROM usuarios WHERE Mail =:mail");
        $consulta->bindParam("mail", $m, PDO::PARAM_STR); 
        $consulta ->execute();
        
        $resultado = $consulta->fetch(PDO::FETCH_ASSOC);

        if($resultado){
            
            return 1;
        }
        else {
            return 0;
        }
    }

    function mandarMail($m, $t, $p){
        //https://albertotain.blogspot.com/2018/02/como-configurar-xampp-para-enviar.html
        $to = $m;
        $subject = "Usuario de Xhendra2.0";
        $message = "Usuario: ".$m." Contraseña: ".$p;
        mail($to, $subject, $message);
    }
?>