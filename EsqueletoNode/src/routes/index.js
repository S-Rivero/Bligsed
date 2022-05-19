const express = require('express');
const router = express.Router();


router.get('/', (req, res)=>{
    // res.render('index', {title: 'First Website'});
    res.send('Directorio Raiz');
});

router.get('/about', (req,res)=>{
    // res.render('about');
    res.send('/About');
});

module.exports = router;