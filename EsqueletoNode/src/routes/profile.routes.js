const {root, datosPersonales, Boletin, inasistencias, mensajes, FichaMedica, updateFichaMedica, test} = require('../controllers/profile.controller');
const {rootId, datosPersonalesId, BoletinId, inasistenciasId, mensajesId, FichaMedicaId, updateFichaMedicaId} = require('../controllers/profile.controller');
const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const {usedRoot, usedRootDp, who} = require('../lib/nexts');

router.get('/', isLoggedIn, root);
router.get('/p/:id', isLoggedIn, rootId);

router.get('/datosPersonales', isLoggedIn, usedRootDp, datosPersonales);
router.get('/:id/datosPersonales', isLoggedIn, usedRootDp, datosPersonalesId);

router.get('/FichaMedica', isLoggedIn, usedRoot, FichaMedica);
router.get('/:id/FichaMedica', isLoggedIn, usedRoot, FichaMedica);

router.post('/updateFichaMedica', isLoggedIn, usedRoot, updateFichaMedica);
router.post('/:id/updateFichaMedica', isLoggedIn, usedRoot, updateFichaMedica);

router.get('/Boletin', isLoggedIn, usedRoot, Boletin);
router.get('/Boletin:t', isLoggedIn, usedRoot, Boletin);
router.get('/:id/Boletin', isLoggedIn, usedRoot, Boletin);
router.get('/:id/Boletin:t', isLoggedIn, usedRoot, test);

router.get('/inasistencias', isLoggedIn, usedRoot, inasistencias);
router.get('/:id/inasistencias', isLoggedIn, usedRoot, inasistencias);

module.exports = router;