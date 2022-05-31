const express = require('express');
const router = express.Router();

const index = require('./index.routes');
const auth = require('./auth.routes');

router.use(index);
router.use(auth);

module.exports = router;