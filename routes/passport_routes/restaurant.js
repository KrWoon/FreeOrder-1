module.exports = function() {
    var router = require('express').Router();
    var pool = require('../../config/passport_config/db')();

    // get restaurant info
    router.get('/:rid', function(req,res){
        sql = 'SELECT * FROM restaurant WHERE Restaurant_Code = ? AND Use_Code = \'Y\'';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [req.params.rid], function(err, results) { 
                if(err) throw err;              
                conn.release();
                res.json(results[0]);
                // res.json({'restaurant' : results[0], 'login' : req.user}); 
            });
        });     
    });

    router.get('/:rid/info', function(req, res) {
        sql = 'SELECT * FROM restaurant WHERE Restaurant_Code = ? AND Use_Code = \'Y\'';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [req.params.rid], function(err, results) {
                if(err) throw err;
                res.render('restaurant/info', {'myRestaurant' : results[0], 'login' : req.user});                
                conn.release();
            });
        }); 
    });

    // update restaurant
    router.put('/:rid', function(req, res) {
        var updateRestaurant = {
            Signboard : req.body.Signboard,
            Location : req.body.Location,
            Category : req.body.Category,
            NumberOfTable : req.body.NumberOfTable,
            openTime : req.body.openTime,
            closeTime : req.body.closeTime,
            Delay : req.body.Delay
        };
        
        var sql = 'UPDATE restaurant SET ? WHERE Use_Code = \'Y\' AND Restaurant_Code = ' + req.params.rid;
        pool.getConnection(function(err, conn) {
            conn.query(sql, updateRestaurant, function(err, restaurant) {
                if(err) throw err; 
                req.session.save(function() {
                    conn.release();
                    res.json({restaurant: 'Update Restaurant Completely!'});
                });               
            });
        });              
    });

    // update status
    router.post('/changeStatus/:rid', function(req,res) {
        console.log(req.body.status);

        var sql = 'SELECT count(*) as amount FROM menu WHERE Restaurant_Code = ' + req.params.rid;

        pool.getConnection(function(err, conn) {
            conn.query(sql, [], function(err, menus) {
                if(err) throw err;

                if(menus[0].amount > 2 || req.body.status == 'close') {
                    var sql = 'UPDATE restaurant SET BusinessStatus=? WHERE Restaurant_Code = ' + req.params.rid;
                    conn.query(sql, [req.body.status], function(err, restaurant) {
                        if(err) throw err;

                        req.session.save(function() {
                            res.json({message: "Change status completely!", change: 1});
                        });                     
                    });
                } else {
                    res.json({message: "You must add Menu at least 3", change: 0});               
                }   

                conn.release();
            });      
        });
    });

    // router.post('/:rid/info/changeStatus', function(req,res) {
    //     var sql = 'SELECT count(*) as amount FROM menu WHERE Restaurant_Code = ' + req.params.rid;

    //     pool.getConnection(function(err, conn) {
    //         conn.query(sql, [], function(err, menus) {
    //             if(err) throw err;

    //             if(menus[0].amount > 2) {
    //                 var sql = 'UPDATE restaurant SET BusinessStatus=? WHERE Restaurant_Code = ' + req.params.rid;
    //                 conn.query(sql, [req.body.status], function(err, restaurant) {
    //                     req.session.save(function() {
    //                         res.redirect('/restaurant/' + req.params.rid);
    //                     });                     
    //                 });
    //             } else {
    //                 res.write('<script type="text/javascript"> alert("You must add Menu at least 3"); </script>')
    //                 res.write('<script language=\"javascript\"> history.back(); </script>')                    
    //             }   

    //             conn.release();
    //         });      
    //     });
    // });

    return router;
}