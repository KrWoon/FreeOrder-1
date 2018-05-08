module.exports = function() {
    var router = require('express').Router();
    var pool = require('../../config/passport_config/db')();

    // show data
    router.get('/', function(req, res) {
        var sql = 'SELECT * FROM users';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [], function(err, results) {
                res.json(results);   
                conn.release();
            });
        });    
    });

    // show one data
    router.get('/:id', function(req, res, next) {
        var sql = 'SELECT * FROM users WHERE UserID = ?';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [req.params.id], function(err, result) {
                res.json(result[0]);   
                conn.release();
            });
        }); 
    });

    // add data
    router.post('/', function(req, res) {
        var newOrder = {
            UserName: req.body.UserName,
            UserLocation: req.body.UserLocation
        };

        var sql = 'INSERT INTO users SET ?';
        pool.getConnection(function(err, conn) {
            conn.query(sql, newOrder, function(err, results) {
                if(err) {
                    console.log(err);
                    res.status(400).send({message: 'Error'});
                } else {
                    req.session.save(function() {                        
                        res.status(200).json({message: 'Add Order Complete!'});
                    });
                }
                conn.release();
            });
        });
    });

    //update data
    router.put('/:id', function(req, res) {
        var sql = 'SELECT UserID FROM users WHERE UserID = ?';

        pool.getConnection(function(err, conn) {
            conn.query(sql, req.params.id, function(err, results) {
               if(!results) {
                   return next(new Error('no users in database'));
               } else {
                    var updateUser = {
                        UserName: req.body.UserName,
                        UserLocation: req.body.UserLocation
                    }
                    
                    sql = 'UPDATE users SET UserName = ?, UserLocation = ? WHERE UserID = ' + req.params.id;
                    conn.query(sql, [updateUser.UserName, updateUser.UserLocation], function(err, result){
                        if(err) {
                            console.log(err);
                            res.status(400).send({message: 'Error'});
                        } else {
                            req.session.save(function() {                        
                                res.json({message: 'Update Order Complete!'});
                            });
                        }
                        
                    });
               }

               conn.release();
            });
        });    
    });


    //delete data
    router.delete('/:id', function(req, res, next) {
        var sql = 'SELECT UserID FROM users WHERE UserID = ?';

        pool.getConnection(function(err, conn) {
            conn.query(sql, req.params.id, function(err, results) {
               if(!results) {
                   res.json(err);
                } else {
                    sql = 'DELETE FROM users WHERE UserID = ' + req.params.id;
                    conn.query(sql, [], function(err, result){
                        req.session.save(function() {                        
                            res.json({order: 'Delete Order Complete!'});
                        });                        
                    });
                }

               conn.release();
            });
        });    
    });

    return router;
}