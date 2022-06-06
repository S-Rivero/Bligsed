const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const {
    root,
    renderHome,
    renderInasistencias
} = require('../controllers/index.controller');


//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));

router.get('/', root);

router.get('/home', isLoggedIn, renderHome);

router.get('/inasistencias', isLoggedIn, renderInasistencias);

/*

//general
router.get('/documentos', isLoggedIn, renderDocumentos);
router.get('/ficha_medica', isLoggedIn, renderFichaMedica);
router.get('/perfil', isLoggedIn, renderPerfil);

//alumno
router.get('/calificaciones', isLoggedIn, renderCalificaciones);

//docente
router.get('/materia', isLoggedIn, renderMateria);
router.get('/curso', isLoggedIn, renderCurso);

//preceptor (tmb tiene el de /curso)
router.get('/sancion', isLoggedIn, renderSancion);

*/

module.exports = router;