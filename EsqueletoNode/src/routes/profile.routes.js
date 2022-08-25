const {root, datosPersonales, Boletin, inasistencias, mensajes, FichaMedica, updateFichaMedica, test} = require('../controllers/profile.controller');
const {rootId, datosPersonalesId, BoletinId, inasistenciasId, mensajesId, FichaMedicaId, updateFichaMedicaId} = require('../controllers/profile.controller');
const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const {esAlumno, usedRootDp, setSessionCurso} = require('../lib/nexts');
const {usedRootId, usedRootDpId} = require('../lib/nexts');

router.get('/', isLoggedIn, root);
router.get('/p/:id', isLoggedIn, rootId);

router.get('/datosPersonales', isLoggedIn, setSessionCurso, datosPersonales);
router.get('/:id/datosPersonales', isLoggedIn, usedRootDpId, datosPersonalesId);

router.get('/FichaMedica', isLoggedIn, esAlumno, FichaMedica);
router.get('/:id/FichaMedica', isLoggedIn, usedRootId, FichaMedicaId);

router.post('/updateFichaMedica', isLoggedIn, esAlumno,updateFichaMedica);
router.post('/:id/updateFichaMedica', isLoggedIn, usedRootId, updateFichaMedica);

router.get('/Boletin', isLoggedIn, esAlumno,Boletin);
router.get('/Boletin:t', isLoggedIn, esAlumno, Boletin);
router.get('/:id/Boletin', isLoggedIn, usedRootId, Boletin);
router.get('/:id/Boletin:t', isLoggedIn, usedRootId, test);

router.get('/inasistencias', isLoggedIn, esAlumno, inasistencias);
router.get('/:id/inasistencias', isLoggedIn, usedRootId, inasistencias);

module.exports = router;