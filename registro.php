<?php
    include('config.php');
    if(isset($_POST['registro'])){
        $mail = $_POST['mail'];
        $password = $_POST['password'];

        $consulta = $conn->prepare("SELECT * FROM usuarios WHERE Mail =:mail");
        $consulta->bindParam("mail", $mail, PDO::PARAM_STR); 
        $consulta ->execute();
        
        $resultado = $consulta->fetch(PDO::FETCH_ASSOC);

        if($resultado){
            echo'<script type="text/javascript">
            alert("Este mail ya esta registrado");
            </script>';
        }
        else{
            $passHash = password_hash($password,PASSWORD_DEFAULT);
            $consulta = $conn->prepare("INSERT INTO usuarios(Mail, Tipo_de_usuario, Contraseña) VALUES (:mail, 34, :password)");
            $consulta->bindParam("mail", $mail, PDO::PARAM_STR); 
            $consulta->bindParam("password", $passHash, PDO::PARAM_STR);
            $resultado = $consulta -> execute();
            if(!$resultado){ //si devuelve false es porque fallo la insersion
                echo'<script type="text/javascript">
                alert("No se pudo registrar el usuario");
                </script>';
            }          
        }
    }
?>