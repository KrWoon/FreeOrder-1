module.exports = function() {
    var router = require('express').Router();
    var pool = require('../../config/passport_config/db')();
    
    // apply restaurant
    router.post('/apply', function(req,res){
        var license = req.body.license1 + '-' + req.body.license2 + '-' + req.body.license3;        
        // Check Duplication of Restaurant
        var checkSql = 'SELECT * FROM application WHERE Businesslicense = ? AND Use_Code = \'Y\'';
        pool.getConnection(function(err, conn) {
            conn.query(checkSql, [license], function(err, restaurant, fields) {
                // if no duplication
                if(!restaurant[0]) {
                    var newApply = {
                        Manager_Code: req.user.Manager_Code,
                        Restaurant_Name: req.body.rname,
                        Businesslicense: license,
                        Address: req.body.Address
                    };                         
                    
                var sql = 'INSERT INTO application SET ?';
                conn.query(sql, newApply, function(err, results, fields) {
                    if(err) {
                        console.log(err);
                        res.status(500);
                    } else {
                        res.json({application: 'Apply restaurant completely!'});
                    }
                });     
                } else {
                    // if duplicated
                    res.json({application: 'Restaurant already exists!'});
                }
                conn.release();
            });
        });        
    });

    // delete apply restaurant
    router.delete('/apply/:id', function(req, res, next){
        var id = req.params.id;
        // var sql = 'UPDATE application SET Use_Code = \'N\' WHERE Application_Code = ?';
        var sql = 'DELETE FROM application WHERE Application_Code = ?';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [id], function(err, results) { 
                req.session.save(function() {
                    conn.release();
                    res.json({form: 'Delete Form Complete!'});
                });
            });
        });
    });

    // admin accept new restaurant
    router.post('/accept/:id', function(req,res){
        var newRestaurant = {
            Manager_Code : req.body.Manager_Code,
            Signboard : req.body.Restaurant_Name,
            Category: 'N',
            openTime : '09:00',
            closeTime : '21:00',
            rate: 0,
            BusinessStatus: 'close',
            Delay: 0,
            Address : req.body.Address,
            NumberOfTable : 0
        };

        var sql = 'INSERT INTO restaurant SET ?';
        pool.getConnection(function(err, conn) {
            conn.query(sql, newRestaurant, function(err, restaurant) {
                // sql = 'UPDATE application SET Use_Code = \'N\' WHERE Application_Code = ?';  
                sql = 'DELETE FROM application WHERE Application_Code = ? ';             
                conn.query(sql, req.params.id, function(err, rows) {
                    conn.release();
                    res.json({application: 'Accept application completely'})
                });
            });
        });                
    });

    // admin rejects the application
    router.post('/reject/:id', function(req,res){
        pool.getConnection(function(err, conn) {
            // sql = 'UPDATE application SET Use_Code = \'N\' WHERE Application_Code = ?';  
            var sql = 'DELETE FROM application WHERE Application_Code = ? '; 

            conn.query(sql, req.params.id, function(err, rows) {
                conn.release();
                res.json({application: 'Reject application completely'})
            });
        });                
    });

    return router;
}