<?php
    include('config.php'); 
    //Para el disparador: https://es.stackoverflow.com/questions/197770/ejecutar-php-cada-cierto-tiempo-sin-ajax
    if(isset($_POST['BORRAR']))//Tiene que haber un disparador automatico para este evento. no tiene que hacerse a traves de un boton con isset
    {
        $consulta = $conn->prepare("SELECT * FROM superusuarios WHERE pago = 0"); 
        $consulta ->execute();
        while($resultado = $consulta->fetch(PDO::FETCH_ASSOC)){
            if(calcularTiempo($resultado['fecha_creacion']) >= 14){
                $borrar = $conn -> prepare("DELETE FROM `superusuarios` WHERE id = :id");
                $borrar -> bindParam("id",$resultado['id'],PDO::PARAM_STR);
                $borrar ->execute();
            }
        }    
    }

    function calcularTiempo($creacion){
        $dateHoy = date_create("now");
        $dateBdd = date_create($creacion);
        $interval = date_diff($dateHoy, $dateBdd);
        return $interval->days;
    }
?>
