module.exports = function(io) {
    var router = require('express').Router();
    var pool = require('../../config/passport_config/db')();
    var FCM = require('fcm-push');
    var sleep = require('system-sleep');
    
    // show data
    router.get('/mobile/:rid', function(req, res) {
        var sql = 'SELECT Order_Code, Email, TotalPrice, OrderStatus, DATE_FORMAT(AddedDate, \'%Y-%m-%d %h:%i\') as Date FROM orderedinfo WHERE Restaurant_Code = ?';
        pool.getConnection(function(err, conn) {
            if(err) throw err;

            conn.query(sql, [req.params.rid], function(err, results) {
                if(err) throw err;

                conn.release();
                res.json(results);   
            });
        });    
    });

    var msg = 0;
    
    // add mobile data
    router.post('/mobile', function(req, res) {
        // var order = req.body.mobileOrder;
        var order = req.body;   // web
        var totalOrder = [];
        var orderCode;

        // insert to orderedinfo table
        var First_func = function(){
            pool.getConnection(function(err, conn) {
                if(err) throw err;

                var sql = 'INSERT INTO orderedinfo (ClientToken, Email, Restaurant_Code) VALUES (?, ?, ?)';

                conn.query(sql, [order[0].ClientToken, order[0].Email, order[0].Restaurant_Code], function(err, results) {
                    if(err) throw err;

                    console.log('insert orderedinfo complete');   
                    setImmediate(() => {
                        Second_func();
                    });                
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
                    orderCode = recent.Order_Code;

                    for(var i=0; i<order.length; i++) {
                        if(order[i].MenuOption_CodeList != 0) {
                            for(var j=0; j<order[i].MenuOption_CodeList.length; j++) {
                                orderedMenu = {
                                    Order_Code: orderCode,
                                    Sequence: i,
                                    Menu_Code: order[i].Menu_Code,
                                    MenuOption_Code: order[i].MenuOption_CodeList[j].MenuOption_Code
                                }
                                totalOrder.push(orderedMenu);
                            }
                        } else {
                            orderedMenu = {
                                Order_Code: orderCode,
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

                    setImmediate(() => {
                        Third_func();
                    });

                    conn.release();
                });
            });
        };        


        // get totalPrice
        var Third_func = function() {
            var totalPrice= 0 ;

            var sql = 'select distinct menu.Menu_Code, menu.Price from menu join orderedmenu on menu.Menu_Code = orderedmenu.Menu_Code join orderedinfo on orderedinfo.Order_Code = orderedmenu.Order_Code where orderedmenu.Order_Code = ?';
            pool.getConnection(function(err, conn) {
                if(err) throw err;
                
                conn.query(sql, [orderCode], function(err, menu) {
                    if(err) throw err;
                    
                    sql = 'select menuoption.MenuOption_Code, menuoption.Price from menuoption join orderedmenu on menuoption.MenuOption_Code = orderedmenu.MenuOption_Code join orderedinfo on orderedinfo.Order_Code = orderedmenu.Order_Code where orderedmenu.Order_Code = ?';
                    conn.query(sql, [orderCode], function(err, option) {
                        if(err) throw err;

                        for(var i=0; i<menu.length; i++) {
                            totalPrice += menu[i].Price;
                        }

                        for(var i=0; i<option.length; i++) {
                            totalPrice += option[i].Price;
                        }

                        console.log(totalPrice);
                        setImmediate(() => {
                            Fourth_func(totalPrice);
                        });
                        
                        conn.release();
                    });
                });
            });  
        }
        
        // insert price into orderedinfo table
        var Fourth_func = function(totalPrice){
            var sql = 'UPDATE orderedinfo SET TotalPrice = ? WHERE Order_Code = ?';
            pool.getConnection(function(err, conn) {
                if(err) throw err;

                conn.query(sql, [totalPrice, orderCode], function(err, results) {
                    if(err) throw err;

                    setImmediate(() => {
                        // jiwoon
                        io.sockets.emit('customOrder', orderCode);
                        const timer = setTimeout(() => {
                            console.log('timer out');  
                            if(msg == 0) {
                                console.log('msg', msg);
                            }                    
                            else {
                                console.log('msg', msg);
                                res.write("req body");
                                msg = 0;
                            }      
                            res.end();
                        }, 10000);

                    });

                    conn.release();
                });
            });            
        }

        First_func();
    });

    
    io.on('connection', (socket) => {
        socket.on('hello', function(data) {
            msg = 1;    
            console.log('msg', msg);
        });
        console.log('Socket Connect22');        
    });


    // get menu, menuoption of only one order
    router.get('/:oid', function(req, res) {
        var orderCode = req.params.oid;

        var sql = 'SELECT distinct orderedmenu.Sequence, orderedinfo.OrderStatus, orderedinfo.Restaurant_Code, orderedmenu.Menu_Code,  menu.Menu_Name, menu.Price as Menu_Price FROM orderedinfo JOIN orderedmenu ON orderedinfo.Order_Code = orderedmenu.Order_Code JOIN menu ON orderedmenu.Menu_Code = menu.Menu_Code WHERE orderedinfo.Order_Code = ?';

        pool.getConnection(function(err, conn) {
            if(err) console.log(err);            
            conn.query(sql, orderCode, function(err, menus) {
                if(err) console.log(err);

                sql = 'SELECT orderedmenu.Menu_Code, menuoption.MenuOption_Name, menuoption.Price as MenuOption_Price FROM orderedinfo JOIN orderedmenu ON orderedinfo.Order_Code = orderedmenu.Order_Code JOIN menuoption ON orderedmenu.MenuOption_Code = menuoption.MenuOption_Code WHERE orderedinfo.Order_Code = ?';
                conn.query(sql, orderCode, function(err, options) {
                    if(err) console.log(err);

                    res.json({'menus': menus, 'options': options});
                })
                
            });
        });
    });

    router.put('/accept/:oid', function(req, res) {
        var orderCode = req.params.oid;

        var sql = 'UPDATE orderedinfo SET OrderStatus = ? WHERE Order_Code = ?';

        pool.getConnection(function(err, conn) {
            if(err) console.log(err);
            conn.query(sql, ['Accept', orderCode], function(err, orders) {
                if(err) console.log(err);

                conn.release();
                res.json('Accept Order completely');
            });
        });
    });


    // accept order and push message to mobile
    router.post('/ready/:oid', function(req, res) {
        /** 아래는 푸시메시지 발송절차 */
        var serverKey = 'AAAAz8FUF8Y:APA91bGFPY5QzMXzFP6TeHg0fBF4DF0GIaBKIrX3wVjRcOk3Sag2RUeO3ZvlROrAVb1XN6_9LV3Y6FfU4XC61qGbYJs6ZevrNYg9tkb-XH7ZF02NghfPoPkxJ63zPwe4UjGDhBjdWNp-';
        // var client_token = 'dIXL2_Y-FA0:APA91bFoHvAX94ByYdP_dGhbhx10T9lkswKZibU_maLClo14K_I08av8-DIMXkH-TznXYpKzWQ8r-rqzxu_Tpmky47AYpSPcnPwrVgBX9aqQzlHLDtPMpAwPp8boxhXegkE4hMagj0ru';
        var client_token = ''

        /** 발송할 Push 메시지 내용 */
        var push_data = {
            // 수신대상
            to: client_token,
            // App에게 전달할 데이터
            data: {
                order: "Accept"
            },
            // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
            notification: {
                title: "Hello Node",
                body: "Node로 발송하는 Push 메시지 입니다."
            }
        };

        var fcm = new FCM(serverKey);

        fcm.send(push_data, function(err, response) {
            if (err) {
                console.error('Push메시지 발송에 실패했습니다.');
                console.error(err);
                res.json('Send ready message fail');
                return;
            }

            console.log('Push메시지가 발송되었습니다.');
            console.log(response);
            res.json('Send ready message completely');
        });
    });

    return router;
}