const {root, datosPersonales, Boletin, inasistencias, mensajes} = require('../controllers/profile.controller');
const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');

router.get('/', isLoggedIn, root);
router.get('/datosPersonales', isLoggedIn, datosPersonales);
router.get('/FichaMedica', isLoggedIn, root);
router.get('/Boletin', isLoggedIn, Boletin);
router.get('/inasistencias', isLoggedIn, inasistencias);
router.get('/mensajes', isLoggedIn, mensajes);

module.exports = router;