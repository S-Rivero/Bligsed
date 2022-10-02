const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const {authLevelCursos, authLevelTablaCursos, authLevelCargarNotas} = require('../lib/nexts');
const {
    root,
    renderHome,
    renderChat,
    renderDocumentos,
    renderCursos,
    renderTablaCursos,
    cargarNotasDocente,
    POSTcargarNotasDocente
} = require('../controllers/index.controller');

//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));

router.get('/',isLoggedIn, root);

router.get('/home', isLoggedIn, renderHome);

router.get('/chat', isLoggedIn, renderChat);

router.get('/documentos', isLoggedIn, renderDocumentos);

router.get('/Cursos', isLoggedIn, authLevelCursos, renderCursos);

router.get('/tablaCurso/:id', isLoggedIn, authLevelTablaCursos, renderTablaCursos);


//Id es la id de materia
//t es el numero de trimestre. Por defecto, desde cursos, te manda al t=1
router.get('/cargarNotas/:id/:t', isLoggedIn, authLevelCargarNotas, cargarNotasDocente);
router.post('/cargarNotas/:id/:t', isLoggedIn, authLevelCargarNotas, POSTcargarNotasDocente);

module.exports = router;