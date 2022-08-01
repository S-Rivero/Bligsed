const {root, datosPersonales, Boletin, inasistencias, mensajes, FichaMedica, updateFichaMedica} = require('../controllers/profile.controller');
const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');

router.get('/', isLoggedIn, root);
router.get('/datosPersonales', isLoggedIn, datosPersonales);
router.get('/FichaMedica', isLoggedIn, FichaMedica);
router.post('/updateFichaMedica', isLoggedIn, updateFichaMedica);
router.get('/Boletin', isLoggedIn, Boletin);
router.get('/Boletin:t', isLoggedIn, Boletin);
router.get('/inasistencias', isLoggedIn, inasistencias);
router.get('/mensajes', isLoggedIn, mensajes);

module.exports = router;