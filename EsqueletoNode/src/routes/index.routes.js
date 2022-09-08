const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const {authLevelCursos} = require('../lib/nexts');
const {
    root,
    renderHome,
    renderChat,
    renderDocumentos,
    renderCursos
} = require('../controllers/index.controller');
const { 
    pushMsg,
    elimChat,
    creaChat,
    abanChat,
    pushPub,
} = require('../lib/mensajeria');

//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));

router.get('/',isLoggedIn, root);

router.get('/home', isLoggedIn, renderHome);

router.get('/chat', isLoggedIn, renderChat);

router.get('/documentos', isLoggedIn, renderDocumentos);

router.get('/cursos', isLoggedIn, authLevelCursos, renderCursos);

router.post('/msg', isLoggedIn, pushMsg);
router.post('/aban', isLoggedIn, abanChat);
router.post('/crea', isLoggedIn, creaChat);
router.post('/elim', isLoggedIn, elimChat);
router.post('/pub', isLoggedIn, pushPub);

module.exports = router;