<html>
    <head>
        <title>Inasistencias</title>
        <link rel="stylesheet" href="inasistencias.css">
    </head>
    <body>
        <h1>Inasistencias</h1>
        <table id="tabla_inasistencias">
            <tr>
                <td colspan="2">Fecha</td>
                <td colspan="3">Motivo</td>
                <td>Cantidad</td>
                <td>Tipo</td>
            </tr>
            <?php show_inasistencias(); ?>
        </table>
    </body>
</html>


<?php
    function show_inasistencias(){
        include('../config.php');
        $_id = getId($conn);
        $cont = 0;
        $consulta = $conn->prepare("SELECT * FROM inasistencias_alum WHERE id_usuario = $_id"); //Por ahora solo funciona con el id de sesion
        $consulta ->execute();
        while($r = $consulta->fetch(PDO::FETCH_ASSOC)){
            echo(print_inasistencia(bgColor($cont),$r['fecha'],$r['motivo'],$r['cantidad'],$r['tipo']));
            $cont++;
        }
    }
    function getId($conn){
        if(isset($_SESSION)){
            $_id = $_SESSION['id'];
        }else{
            $_id = 2; //ESTO ES PORQUE TODAVIA NO HAY VARIABLES DE SESSION
        }
        return $_id;
    }
    function print_inasistencia($class, $date, $reason, $quantity, $type){
        return'
            <tr class="'.$class.'">
                <td colspan="2">'.$date.'</td>
                <td colspan="3">'.$reason.'</td>
                <td>'.$quantity.'</td>
                <td>'.$type.'</td>
            </tr>
        ';
    }

    function bgColor($cont){
        if($cont % 2 == 0)
            return 'a';
        else
            return '';
    }
?>