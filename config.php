<?php
    $user = 'root';
    $pass = '';
    $database = 'proyecto';
    $host = 'localhost';

    try{
        $conn = new PDO("mysql:host=".$host.";dbname=".$database, $user, $pass);
    }
    catch (PDOException $e){
        exit("Error: " . $e->getMessage());
    }
?>