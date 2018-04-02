module.exports = function() {
    var router = require('express').Router();
    
    router.get('/', function(req, res){
        // res.send('hello index');
        res.render('index', {'login' : req.user});
    }); 

    return router;
}