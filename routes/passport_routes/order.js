module.exports = function(io) {
    var router = require('express').Router();
    var pool = require('../../config/passport_config/db')();

    
    // show data
    router.get('/mobile/:rid', function(req, res) {
        var sql = 'SELECT * FROM ordereditem WHERE Restaurant_Code = ?';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [req.params.rid], function(err, results) {
                if(err) throw err;

                res.json(results);   
                conn.release();
            });
        });    
    });

    // add mobile data test
    router.post('/mobile/test', function(req, res) {
        var order = req.body.mobileOrders;
        var totalOrder = [];

        // jiwoon
        io.sockets.emit('customOrder', order);
        res.write("req.body Ok");

        // insert to ordereditem table
        var First_func = function(){
            var sql = 'INSERT INTO ordereditem (Email, Restaurant_Code) VALUES (?, ?)';

            pool.getConnection(function(err, conn) {
                if(err) throw err;

                conn.query(sql, [order[0].Email, order[0].Restaurant_Code], function(err, results) {
                    console.log('insert ordereditem complete');
                    Second_func();
                });
            });
        };
        
        // get order_code and insert to orderedmenu table
        var Second_func = function(){
            var sql = 'SELECT Order_Code FROM ordereditem WHERE Email = ? AND Restaurant_Code = ?';

            pool.getConnection(function(err, conn) {
                if(err) throw err;

                conn.query(sql, [order[0].Email, order[0].Restaurant_Code], function(err, orderCodes) {
                    var recent = orderCodes[orderCodes.length - 1];

                    for(var i=0; i<order.length; i++) {
                        if(order[i].MenuOption_CodeList != 0) {
                            for(var j=0; j<order[i].MenuOption_CodeList.length; j++) {
                                orderedMenu = {
                                    Order_Code: recent.Order_Code,
                                    Sequence: i,
                                    Menu_Code: order[i].Menu_Code,
                                    MenuOption_Code: order[i].MenuOption_CodeList[j].MenuOption_Code
                                }
                                totalOrder.push(orderedMenu);
                            }
                        } else {
                            orderedMenu = {
                                Order_Code: recent.Order_Code,
                                Sequence: i,
                                Menu_Code: order[i].Menu_Code
                            }
                            totalOrder.push(orderedMenu);
                        }
                    }

                    sql = 'INSERT INTO orderedmenu SET ?';
                    for(var i=0; i<totalOrder.length; i++) {                        
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
        };
        
        First_func();
        res.end();
    });


    //add mobile data
    router.post('/mobile', function(req, res) {
        // var inputData = req.body;
        
        var order = req.body;
        var totalOrder = [];

        // jiwoon
        io.sockets.emit('customOrder', order);
        res.write("req.body Ok");


        // insert to ordereditem table
        var First_func = function(){
            var sql = 'INSERT INTO ordereditem (Email, Restaurant_Code) VALUES (?, ?)';

            pool.getConnection(function(err, conn) {
                if(err) throw err;

                conn.query(sql, [order[0].Email, order[0].Restaurant_Code], function(err, results) {
                    console.log('insert ordereditem complete');
                    Second_func();
                });
            });
        };
        
        // get order_code and insert to orderedmenu table
        var Second_func = function(){
            var sql = 'SELECT Order_Code FROM ordereditem WHERE Email = ? AND Restaurant_Code = ?';

            pool.getConnection(function(err, conn) {
                if(err) throw err;

                conn.query(sql, [order[0].Email, order[0].Restaurant_Code], function(err, orderCodes) {
                    var recent = orderCodes[orderCodes.length - 1];

                    for(var i=0; i<order.length; i++) {
                        if(order[i].MenuOption_CodeList != 0) {
                            for(var j=0; j<order[i].MenuOption_CodeList.length; j++) {
                                orderedMenu = {
                                    Order_Code: recent.Order_Code,
                                    Sequence: i,
                                    Menu_Code: order[i].Menu_Code,
                                    MenuOption_Code: order[i].MenuOption_CodeList[j].MenuOption_Code
                                }
                                totalOrder.push(orderedMenu);
                            }
                        } else {
                            orderedMenu = {
                                Order_Code: recent.Order_Code,
                                Sequence: i,
                                Menu_Code: order[i].Menu_Code
                            }
                            totalOrder.push(orderedMenu);
                        }
                    }

                    sql = 'INSERT INTO orderedmenu SET ?';
                    for(var i=0; i<totalOrder.length; i++) {                        
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
        };
        
        First_func();
        res.end();
    });

    
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