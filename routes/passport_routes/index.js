module.exports = function() {
    var router = require('express').Router();
    var pool = require('../../config/passport_config/db')();

    
    router.get('/', function(req, res){
        res.json({'login' : req.user});
    }); 

    router.get('/restaurants', function(req, res){
        var sql = 'SELECT Signboard, Restaurant_Code FROM restaurant WHERE Manager_Code = ? AND Use_Code = \'Y\'';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [req.user.Manager_Code], function(err, restaurants) {  
                conn.release();    
                res.json({'login' : req.user, 'restaurants' : restaurants});
            });
        });     
    }); 

    router.get('/applications', function(req, res){
        var sql = 'SELECT Restaurant_Name, Application_Code FROM application WHERE Manager_Code = ? AND Use_Code = \'Y\'';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [req.user.Manager_Code], function(err, applications) {   
                conn.release();   
                res.json({'login' : req.user, 'applications' : applications});
            });
        });     
    }); 


    return router;
}