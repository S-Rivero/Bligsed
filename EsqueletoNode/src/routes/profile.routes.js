const {root, datosPersonales, Boletin, inasistencias, mensajes, FichaMedica, updateFichaMedica} = require('../controllers/profile.controller');
const express = require('express');
const router = express.Router();
const {usedRoot, isLoggedIn, isNotLoggedIn, usedRootDp} = require('../lib/auth');

router.get('/', isLoggedIn, root);
router.get('/root:id', isLoggedIn, root);
router.get('/datosPersonales', isLoggedIn, usedRootDp, datosPersonales);
router.get('/FichaMedica', isLoggedIn, usedRoot, FichaMedica);
router.post('/updateFichaMedica', isLoggedIn, usedRoot, updateFichaMedica);
router.get('/Boletin', isLoggedIn, usedRoot, Boletin);
router.get('/Boletin:t', isLoggedIn, usedRoot, Boletin);
router.get('/inasistencias', isLoggedIn, usedRoot, inasistencias);




router.get('/mensajes', isLoggedIn, mensajes);

module.exports = router;