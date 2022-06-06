const express = require('express');
const router = express.Router();

const auth = require('./auth.routes');
const index = require('./index.routes');

router.use(auth);
router.use(index);

module.exports = router;