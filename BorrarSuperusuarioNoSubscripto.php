<?php
    include('config.php'); 

    if(isset($_POST['BORRAR']))//Tiene que haber un disparador automatico para este evento. no tiene que hacerse a traves de un boton con isset
    {
        $consulta = $conn->prepare("SELECT * FROM superusuarios WHERE pago = 0"); 
        $consulta ->execute();
        $resultado = $consulta->fetch(PDO::FETCH_ASSOC);
        print_r($resultado);//Solo esta bajando una de las 3 coincidencias
        foreach($resultado as $r){ //Esto analiza cada dato del resultado, no cada resultado. Corregir
            echo calcularTiempo($r['fecha_creacion']);
            // if(calcularTiempo($resultado['fecha_creacion']) >= 14){
            // }
         
        }
        
    }


    function calcularTiempo($creacion){
        $dateHoy = date_create("now");
        $dateBdd = date_create($creacion);
        $interval = date_diff($dateHoy, $dateBdd);
        return $interval->days;
    }
?>
