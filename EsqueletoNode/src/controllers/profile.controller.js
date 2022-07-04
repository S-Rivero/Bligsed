const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../database');
const {JSONPromediosAl} = require('../lib/jsonFormat');
const {setChild} = require('../lib/helpers');

exports.root = ((req,res) => {
    res.redirect("/perfil/datosPersonales");
});

exports.datosPersonales = ((req,res) => {
    res.send("/datosPersonales");
});

exports.FichaMedica = ((req,res) => {
    res.send("/FichaMedica");
});

exports.Boletin = ((req,res) => {
    res.send("/Boletin");
});

exports.inasistencias = ((req,res) => {
    res.render('perfil.hbs', {links: 'headerLinks/profile'});
});

exports.mensajes = ((req,res) => {
    res.send("/mensajes");
});