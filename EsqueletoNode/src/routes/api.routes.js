const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const {authLevelCursos, authLevelTablaCursos, authLevelCargarNotas, authLevelCargarInasistencias, authLevelAdministrador, authLevelVerUsuarios} = require('../lib/nexts');
const {
    idCursoToName,
    idMateriaToCurso,
    ListaAlumnosNotas,
    eliminarInasistencias,
    actualizarInasistencias,
    checkUser,
    buscarCuenta,
    actualizarUsuario,
    actualizarAlumno,
    eliminarCursos,
    listarDocentes,
    listarCursos,
    actualizarCurso
} = require('../controllers/api.controller');

//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));

router.get('/api/idCursoToName/:id',isLoggedIn, idCursoToName);
router.get('/api/idMateriaToCurso/:id',isLoggedIn, idMateriaToCurso);
router.get('/api/ListaAlumnosNotas/:id/:t',isLoggedIn, authLevelCargarNotas, ListaAlumnosNotas);

router.get('/api/eliminarInasistencia/:id',isLoggedIn, authLevelCargarInasistencias, eliminarInasistencias);
router.get('/api/actualizarInasistencia/:id/:date/:checkbox/:select',isLoggedIn, authLevelCargarInasistencias, actualizarInasistencias);

router.post('/api/checkUser',isLoggedIn, authLevelAdministrador, checkUser);

router.get('/api/buscarCuenta/:username', isLoggedIn, authLevelVerUsuarios, buscarCuenta);
router.post('/api/actualizarUsuario', isLoggedIn, authLevelVerUsuarios, actualizarUsuario);
router.post('/api/actualizarAlumno', isLoggedIn, authLevelVerUsuarios, actualizarAlumno);

router.post('/api/eliminarCursos', isLoggedIn, authLevelAdministrador, eliminarCursos);

router.get('/api/listarDocentes', isLoggedIn, authLevelAdministrador, listarDocentes);
router.get('/api/listarCursos', isLoggedIn, authLevelAdministrador, listarCursos);
router.post('/api/actualizarCurso', isLoggedIn, authLevelAdministrador, actualizarCurso);
module.exports = router;