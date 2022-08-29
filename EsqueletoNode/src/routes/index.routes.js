const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, path.join(__dirname, '../public/files'));
    },
    filename: (req,file,cb) => {
        console.log(file);
        cb(null, "BligsedImages_"+Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage:storage});


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

router.get('/xample', rxample);
router.post('/xample', upload.single("file"), xample);


module.exports = router;