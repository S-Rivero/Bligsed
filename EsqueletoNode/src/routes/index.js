const express = require('express');
const router = express.Router();

const auth = require('./auth.routes');
const index = require('./index.routes');
const profile = require('./profile.routes');
const notFound = require('./notFound.routes');

router.use(auth);
router.use(index);
router.use('/perfil', profile);
router.use(notFound);


module.exports = router;