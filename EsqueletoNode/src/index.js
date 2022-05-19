const { execArgv } = require('process');
require('colors');
require('dotenv').config();
const path = require('path');
const mysql = require('mysql');
const express = require('express');


const app = express();
const connection = mysql.createConnection({
    port: 3000,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prueba'
});

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

//middlewares


//routes
app.use(require('./routes/'));

//static files
app.use(express.static(path.join(__dirname, 'public')));


//listening the server
app.listen(app.get('port'), () => {
    console.log('server on port'.blue, app.get('port'));
});