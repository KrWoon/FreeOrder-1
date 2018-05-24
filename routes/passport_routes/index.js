module.exports = function() {
    var router = require('express').Router();
    var pool = require('../../config/passport_config/db')();
    var multer = require('multer');

    
    router.get('/', function(req, res){
        res.json({'login' : req.user});
    }); 

    // display restuarnats
    router.get('/restaurants', function(req, res){
        var sql = 'SELECT Signboard, Restaurant_Code FROM restaurant WHERE Manager_Code = ? AND Use_Code = \'Y\'';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [req.user.Manager_Code], function(err, restaurants) {  
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
        var sql = 'SELECT Application_Code, Restaurant_Name, Businesslicense, Location, Email, application.Manager_Code FROM application JOIN manager ON application.Manager_Code = manager.Manager_Code WHERE application.Use_Code = \'Y\'';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [], function(err, admins) { 
                conn.release();   
                res.json({'login' : req.user, 'admins' : admins});
            });
        });     
    }); 

    
    var upload = {
        insertImage:function (data, callback) {
            pool.getConnection(function(err, conn) {
                conn.query("INSERT INTO users (UserID, UserName, UserLocation) VALUES (0, ?, 'N')", [data], function(err, row) {
                    if(err) {console.log('error db')}
                    return conn.release();
                })
            });            
        }
    };

    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './public/images/')
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname)
        }
    });

    var uploads = multer({ storage: storage }).single('image');


    router.post('/upload', function (req, res, next) {
        uploads(req, res, function (err) {
            if(err){
                return res.end('Error Upload file')
            }
    
            upload.insertImage(req.file.filename, function (err, rows) {
                if(err){
                    res.end(err)
                } else {
                    res.json('db complete');
                }
            })
            res.json(req.file);
        })
    });


    return router;
}