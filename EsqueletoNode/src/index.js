const { execArgv } = require('process');
require('colors');
require('dotenv').config();
const path = require('path');
const mysql = require('mysql');
const express = require('express');
const {database, port} = require('./config');
//const session = require('express-session');

//Instancia el sv y conecta con la DB
const app = express();
const connection = mysql.createConnection({ database });

    /* Parte q falta del config.php
    try{
        $conn = new PDO("mysql:host=".$host.";dbname=".$database, $user, $pass);
    }
    catch (PDOException $e){
        exit("Error: " . $e->getMessage());
    }
    */

connection.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Connected to database");
    }
});

//settings
app.set('port', 3000);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
/*  SESSION
    app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, 'static')));
*/

//middlewares


//routes
app.use(require('./routes/'));

//static files
app.use(express.static(path.join(__dirname, 'public')));


//listening the server
app.listen(app.get('port'), () => {
    console.log('server on port'.blue, app.get('port'));
});