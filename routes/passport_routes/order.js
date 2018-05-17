module.exports = function() {
    var router = require('express').Router();
    var pool = require('../../config/passport_config/db')();

    
    // show data
    router.get('/mobile/:rid', function(req, res) {
        var sql = 'SELECT * FROM order_tb WHERE Restaurant_Code = ?';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [req.params.rid], function(err, results) {

                console.log(results);
                res.json(results);   
                conn.release();
            });
        });    
    });

    // add mobile data
    router.post('/mobile', function(req, res) {
        // jiwoon
        io.sockets.emit('customOrder', {mobile:'complete'});

        var inputData = "";

        req.on('data', function(data) {
            inputData = JSON.parse(data);
        });

        console.log(inputData.mobileOrder);

        req.on('end', function() {
            var totalOrder = [];
        
            // push to totalOrder
            for(var i=0; i<inputData.mobileOrder.length; i++) {
                // menuoption is existing
                if(inputData.mobileOrder[i].MenuOption_CodeList != 0) {
                    for(var j=0; j<inputData.mobileOrder[i].MenuOption_CodeList.length; j++) {
                        var newOrder = {
                            Email: inputData.mobileOrder[i].Email,
                            Restaurant_Code: inputData.mobileOrder[i].Restaurant_Code,
                            Menu_Code: inputData.mobileOrder[i].Menu_Code,
                            MenuOption_Code: inputData.mobileOrder[i].MenuOption_CodeList[j].MenuOption_Code
                        }
                        totalOrder.push(newOrder);
                    }
                } else {
                    var newOrder = {
                        Email: inputData.mobileOrder[i].Email,
                        Restaurant_Code: inputData.mobileOrder[i].Restaurant_Code,
                        Menu_Code: inputData.mobileOrder[i].Menu_Code
                    }
                    totalOrder.push(newOrder);
                }
            }
    
            pool.getConnection(function(err, conn) {
                for(var i=0; i<totalOrder.length; i++) {
                        var sql = 'INSERT INTO order_tb SET ?';
                        conn.query(sql, totalOrder[i], function(err, results) {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log('complete');
                            }
                        })    
                }
                conn.release();
            });
        });

        res.write("FreeOrder DB Ok");
        res.end();
    });

    // // add mobile data
    // router.post('/mobile', function(req, res) {
    //     var inputData = "";

    //     req.on('data', function(data) {
    //         inputData = JSON.parse(data);
    //     });

    //     req.on('end', function() {
    //         var totalOrder = [];
        
    //         // push to totalOrder
    //         for(var i=0; i<req.body.length; i++) {
    //             // menuoption is existing
    //             if(req.body[i].MenuOption_CodeList != 0) {
    //                 for(var j=0; j<req.body[i].MenuOption_CodeList.length; j++) {
    //                     var newOrder = {
    //                         Email: req.body[i].Email,
    //                         Restaurant_Code: req.body[i].Restaurant_Code,
    //                         Menu_Code: req.body[i].Menu_Code,
    //                         MenuOption_Code: req.body[i].MenuOption_CodeList[j].MenuOption_Code
    //                     }
    //                     totalOrder.push(newOrder);
    //                 }
    //             } else {
    //                 var newOrder = {
    //                     Email: req.body[i].Email,
    //                     Restaurant_Code: req.body[i].Restaurant_Code,
    //                     Menu_Code: req.body[i].Menu_Code
    //                 }
    //                 totalOrder.push(newOrder);
    //             }
    //         }
    
    //         pool.getConnection(function(err, conn) {
    //             for(var i=0; i<totalOrder.length; i++) {
    //                     var sql = 'INSERT INTO order_tb SET ?';
    //                     conn.query(sql, totalOrder[i], function(err, results) {
    //                         if(err) {
    //                             console.log(err);
    //                         } else {
    //                             console.log('complete');
    //                         }
    //                     })    
    //             }
    //             conn.release();
    //         });
    //     });

    //     res.write("FreeOrder DB Ok");
    //     res.end();
    // });

    
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