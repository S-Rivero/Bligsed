const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const {authLevelCursos, authLevelTablaCursos, authLevelCargarNotas} = require('../lib/nexts');
const {
    idCursoToName,
    idMateriaToCurso,
    ListaAlumnosNotas
} = require('../controllers/api.controller');

//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));

router.get('/api/idCursoToName/:id',isLoggedIn, idCursoToName);
router.get('/api/idMateriaToCurso/:id',isLoggedIn, idMateriaToCurso);
router.get('/api/ListaAlumnosNotas/:id/:t',isLoggedIn, authLevelCargarNotas, ListaAlumnosNotas);


module.exports = router;