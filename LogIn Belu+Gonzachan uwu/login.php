<?php
    include('config.php'); 
    session_start();  
//Por ahora se loguea unicamente con el mail. En un futuro tambien con el DNI
    if(isset($_POST['login'])){
        $mail = $_POST['mail'];
        $password = $_POST['password'];

//Revisar relaciones y claves foraneas. Falla la relacion de Padres con Ficha medica
        $consulta = $conn->prepare("SELECT * FROM usuarios WHERE Mail =:mail");
        $consulta->bindParam("mail", $mail, PDO::PARAM_STR); 
        $consulta ->execute();

        $resultado = $consulta->fetch(PDO::FETCH_ASSOC);

        if(!$resultado){
            echo'<script type="text/javascript">
            alert("User o Contraseña incorrectos");
            window.location.href="login.html";
            </script>';
        }
        else{
            if(password_verify($password,$resultado['Contraseña'])){ 
                $_SESSION['mail'] = $resultado['Mail'];
                echo'<script type="text/javascript">
                alert("Logueado");
                </script>';
            }
            else{
                echo'<script type="text/javascript">
                alert("User o Contraseña incorrectos");
                window.location.href="login.html";
                </script>';
            }
        }
    }
    else{
        echo "error en login.php con el boton login";
    }
?>