const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const {
    root,
    renderHome,
    renderChat,
    xample,
    rxample,
} = require('../controllers/index.controller');
const { 
    pushMsg,
    elimChat,
    creaChat,
    abanChat,
    pushPub,
    upload,
} = require('../lib/mensajeria');
//Para mandar html --> res.sendFile(path.join(__dirname, '../views/archivo.html'));

router.get('/',isLoggedIn, root);

router.get('/home', isLoggedIn, renderHome);

router.get('/chat', isLoggedIn, renderChat);

router.post('/msg', isLoggedIn, pushMsg);
router.post('/aban', isLoggedIn, abanChat);
router.post('/crea', isLoggedIn, creaChat);
router.post('/elim', isLoggedIn, elimChat);
router.post('/pub', isLoggedIn, pushPub);
router.post('/pubi', isLoggedIn, upload.single('image'), pushPub);
router.post('/pubf', isLoggedIn, upload.single('file'), pushPub);

router.get('/xample', rxample);
router.post('/xample', upload.single("myFile"), xample);

module.exports = router;