module.exports = function(io) {
    var router = require('express').Router();
    var pool = require('../../config/passport_config/db')();

    
    // show data
    router.get('/mobile/:rid', function(req, res) {
        var sql = 'SELECT Email, TotalPrice, DATE_FORMAT(AddedDate, \'%Y-%m-%d %h:%i\') as Date FROM orderedinfo WHERE Restaurant_Code = ?';
        pool.getConnection(function(err, conn) {
            if(err) throw err;

            conn.query(sql, [req.params.rid], function(err, results) {
                if(err) throw err;

                conn.release();
                res.json(results);   
            });
        });    
    });

    // add mobile data
    router.post('/mobile', function(req, res) {
        // var order = req.body.mobileOrders;
        var order = req.body;
        var totalOrder = [];

        // insert to orderedinfo table
        var First_func = function(){
            pool.getConnection(function(err, conn) {
                if(err) throw err;

                var sql = 'INSERT INTO orderedinfo (Email, Restaurant_Code) VALUES (?, ?)';

                conn.query(sql, [order[0].Email, order[0].Restaurant_Code], function(err, results) {
                    if(err) throw err;

                    console.log('insert orderedinfo complete');
                    Second_func();
                    conn.release();
                });
            });
        };
        
        // get order_code and insert to orderedmenu table
        var Second_func = function(){
            var sql = 'SELECT Order_Code FROM orderedinfo WHERE Email = ? AND Restaurant_Code = ?';

            pool.getConnection(function(err, conn) {
                if(err) throw err;

                conn.query(sql, [order[0].Email, order[0].Restaurant_Code], function(err, orderCodes) {
                    if(err) throw err;

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

                    // jiwoon
                    io.sockets.emit('customOrder', recent);
                    res.write("req.body Ok");
                    res.end();

                    conn.release();
                });
            });
        };
        
        First_func();
    });


    // update price and delay
    router.put('/mobile/:oid', function(req, res) {
        var orderCode = req.params.oid;

        // get totalPrice and totalDelay
        var First_func = function() {
            var totalPrice = 0;
            var totalDelay = 0;

            var sql = 'select distinct menu.Menu_Code, menu.Price, menu.Delay from menu join orderedmenu on menu.Menu_Code = orderedmenu.Menu_Code join orderedinfo on orderedinfo.Order_Code = orderedmenu.Order_Code where orderedmenu.Order_Code = ?';
            pool.getConnection(function(err, conn) {
                if(err) throw err;
                
                conn.query(sql, [orderCode], function(err, menu) {
                    if(err) throw err;
                    
                    sql = 'select menuoption.MenuOption_Code, menuoption.Price from menuoption join orderedmenu on menuoption.MenuOption_Code = orderedmenu.MenuOption_Code join orderedinfo on orderedinfo.Order_Code = orderedmenu.Order_Code where orderedmenu.Order_Code = ?';
                    conn.query(sql, [orderCode], function(err, option) {
                        if(err) throw err;

                        for(var i=0; i<menu.length; i++) {
                            totalPrice += menu[i].Price;
                            totalDelay += menu[i].Delay;
                        }

                        for(var i=0; i<option.length; i++) {
                            totalPrice += option[i].Price;
                        }

                        Second_func(totalPrice, totalDelay);
                        conn.release();
                    });
                });
            });  
        }  

        // insert price and delay into orderedinfo table
        var Second_func = function(Price, Delay){
            var sql = 'UPDATE orderedinfo SET TotalPrice = ?, EstimatedLatency = ? WHERE Order_Code = ?';
            pool.getConnection(function(err, conn) {
                if(err) throw err;

                conn.query(sql, [Price, Delay, orderCode], function(err, results) {
                    if(err) throw err;

                    conn.release();
                    res.json('good');   
                });
            });            
        }

        First_func();
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