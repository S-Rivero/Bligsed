const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const {authLevelCursos, authLevelTablaCursos, authLevelCargarNotas, authLevelCargarInasistencias, authLevelAdministrador, authLevelVerUsuarios} = require('../lib/nexts');
const {
    root,
    renderHome,
    renderChat,
    renderDocumentos,
    renderCursos,
    renderTablaCursos,
    renderTablaTodos,

    cargarNotasDocente,
    POSTcargarNotasDocente,
    renderCargarInasistencias,
    PostCargarInasistencias,
    
    homeCrearCuentas,
    crearCuentas,
    insertCuentas,
    crearCurso,
    insertCurso,
    crearMaterias,
    insertMaterias,
    
    homeBuscarCuenta,
    buscarCuenta,
    buscarCuentaId,

    crear,
    editar,
    editarMateria,
    editarMateriaId,
    editarCurso

} = require('../controllers/index.controller');

//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));

router.get('/',isLoggedIn, root);

router.get('/home', isLoggedIn, renderHome);

router.get('/chat', isLoggedIn, renderChat);

router.get('/documentos', isLoggedIn, renderDocumentos);

router.get('/Cursos', isLoggedIn, authLevelCursos, renderCursos);

router.get('/tablaCurso/:id', isLoggedIn, authLevelTablaCursos, renderTablaCursos);
router.get('/tablaTodos', isLoggedIn, authLevelVerUsuarios, renderTablaTodos);

router.get('/crear', isLoggedIn, authLevelAdministrador, crear);
router.get('/editar', isLoggedIn, authLevelAdministrador, editar);
router.get('/editarCurso', isLoggedIn, authLevelAdministrador, editarCurso);
router.get('/editarMateria', isLoggedIn, authLevelAdministrador, editarMateria);
router.get('/editarMateria/:id', isLoggedIn, authLevelAdministrador, editarMateriaId);

//Id es la id de materia
//t es el numero de trimestre. Por defecto, desde cursos, te manda al t=1
router.get('/cargarNotas/:id/:t', isLoggedIn, authLevelCargarNotas, cargarNotasDocente);
router.post('/cargarNotas/:id/:t', isLoggedIn, authLevelCargarNotas, POSTcargarNotasDocente);

router.post('/cargar_inasistencias_render', isLoggedIn, authLevelCargarInasistencias, renderCargarInasistencias);
router.post('/cargar_inasistencias', isLoggedIn, authLevelCargarInasistencias, PostCargarInasistencias);

router.get('/crear_cuentas', isLoggedIn, authLevelAdministrador, homeCrearCuentas);
router.get('/crear_cuentas/:tipo', isLoggedIn, authLevelAdministrador, crearCuentas);
router.post('/crear_cuentas/:tipo', isLoggedIn, authLevelAdministrador, insertCuentas);

router.get( '/crear_materias', isLoggedIn, authLevelAdministrador, crearMaterias);
router.post('/crear_materias', isLoggedIn, authLevelAdministrador, insertMaterias);

router.get( '/crear_curso', isLoggedIn, authLevelAdministrador, crearCurso);
router.post('/crear_curso', isLoggedIn, authLevelAdministrador, insertCurso);

router.get('/buscarCuenta', isLoggedIn, authLevelAdministrador, buscarCuenta);
router.get('/buscarCuenta/:id', isLoggedIn, authLevelAdministrador, buscarCuentaId);

module.exports = router;