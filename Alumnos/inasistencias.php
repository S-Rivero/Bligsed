<html>
    <head>
        <title>Inasistencias</title>
        <link rel="stylesheet" href="inasistencias.css">
    </head>
    <body>
        <h1>Inasistencias</h1>
        <table id="tabla_inasistencias">
            <tr >
                <td colspan="2">Fecha</td>
                <td colspan="3">Motivo</td>
                <td>Cantidad</td>
                <td>Tipo</td>
            </tr>
            <?php
                include('../config.php'); 
                $consulta = $conn->prepare("SELECT * FROM inasistencias_alum WHERE id_usuario = 2"); //idusuario == session usuario xd
                $consulta ->execute();
                while($r = $consulta->fetch(PDO::FETCH_ASSOC)){
                    echo(print_inasistencia('a',$r['fecha'],$r['motivo'],$r['cantidad'],$r['tipo']));
                }
            ?>dwadwa
        </table>
    </body>
</html>


<?php
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
?>