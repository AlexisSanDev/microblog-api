var express = require('express');
var router = express.Router();
//middleware

router.use(function timeLog(req,res,next){
    console.log('Fecha actual: ', Date.now());
    next();
});

//home

router.get('/',function(req,res){
    res.send('Pagina inicial de los posts');
});

//about

router.get('/about',function(req,res){
    res.send('Acerca de los posts');
});

module.exports = router;