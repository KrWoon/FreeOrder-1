module.exports = function() {
    var router = require('express').Router();
    var pool = require('../../config/passport_config/db')();
    var multer = require('multer');
    var FCM = require('fcm-push');
    
    router.get('/', function(req, res){
        res.json({'login' : req.user});
    }); 

    // display restuarnats
    router.get('/restaurants', function(req, res){
        var sql = 'SELECT Signboard, Restaurant_Code FROM restaurant WHERE Manager_Code = ? AND Use_Code = \'Y\'';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [req.user.Manager_Code], function(err, restaurants) {  
                if(err) console.log(err);
                conn.release();    
                res.json({'login' : req.user, 'restaurants' : restaurants});
            });
        });     
    }); 

    // display applications
    router.get('/applications', function(req, res){
        var sql = 'SELECT * FROM application WHERE Manager_Code = ? AND Use_Code = \'Y\'';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [req.user.Manager_Code], function(err, applications) {   
                conn.release();   
                res.json({'login' : req.user, 'applications' : applications});
            });
        });     
    }); 

    // display applications
    router.get('/admins', function(req, res){
        var sql = 'SELECT Application_Code, Restaurant_Name, Businesslicense, Address, Email, application.Manager_Code FROM application JOIN manager ON application.Manager_Code = manager.Manager_Code WHERE application.Use_Code = \'Y\'';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [], function(err, admins) { 
                conn.release();   
                res.json({'login' : req.user, 'admins' : admins});
            });
        });     
    }); 


    // accept order and push message to mobile
    router.post('/push', function(req, res) {
        console.log('1');
        setImmediate(() => {
            console.log('2');
            console.log('3');
            setImmediate(() => {
                console.log('4');
                console.log('5');
            });
            console.log('9');
        });
        console.log('6');
        setImmediate(() => {
            console.log('7');
            console.log('8');
        });
        res.json('hi');
    });

    return router;
}