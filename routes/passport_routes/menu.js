module.exports = function() {
    var router = require('express').Router();
    var pool = require('../../config/passport_config/db')();

    router.get(['/:rid', '/:rid/:mid/detail'], function(req,res){
        var sql = 'SELECT * FROM menu WHERE Restaurant_Code = ?'
        pool.getConnection(function(err, conn) {
            conn.query(sql, [req.params.rid], function(err, menus) {
                sql = 'SELECT * FROM menuoption WHERE Restaurant_Code = ?';

                conn.query(sql, [req.params.rid], function(err, options) {
                    if(req.params.mid) {
                        sql = 'SELECT * FROM menuoption INNER JOIN menuinjuction ON menuoption.MenuOption_Code = menuinjuction.MenuOption_Code WHERE menuinjuction.Menu_Code = ?'

                        conn.query(sql, [req.params.mid], function(err, menuDetails) {
                            res.render('menu/mLayout', {'menu' : menus, 'menuDetail' : menuDetails, 'menuOption' : options, 'r_Code' : req.params.rid, 'm_Code' : req.params.mid});
                        });
                    } else {
                        res.render('menu/mLayout', {'menu' : menus, 'menuOption' : options, 'r_Code' : req.params.rid, 'm_Code' : 'None'});
                    }                    
                });                             
                conn.release();
            });
        });         
    });


    router.post('/:rid/add', function(req,res){
        var newMenu = {
            Restaurant_Code: req.params.rid,
            Menu_Name: req.body.menuname,
            Price: req.body.price
        }; 

        var sql = 'INSERT INTO menu SET ?';
        pool.getConnection(function(err, conn) {
            conn.query(sql, newMenu, function(err, results) {
                if(err) {
                    console.log(err);
                    res.status(500);
                } else {
                    req.session.save(function() {
                        res.redirect('/menu/' + req.params.rid);
                    });
                }
            });
        }); 
    });

    router.post('/option/:rid/add', function(req,res){
        var newMenu = {
            Restaurant_Code: req.params.rid,
            MenuOption_Name: req.body.menuname,
            Price: req.body.price
        }; 

        var sql = 'INSERT INTO menuoption SET ?';
        pool.getConnection(function(err, conn) {
            conn.query(sql, newMenu, function(err, results) {
                if(err) {
                    console.log(err);
                    res.status(500);
                } else {
                    req.session.save(function() {
                        res.redirect('/menu/' + req.params.rid);
                    });
                }
            });
        }); 
    });

    router.post('/:rid/:mid/detail/add', function(req,res){
        var details = req.body.detail;
        var sql = 'DELETE FROM menuinjuction WHERE Menu_Code = ?';

        pool.getConnection(function(err, conn) {
            conn.query(sql, [req.params.mid], function(err, results) {
                if(details) {
                    if(!Array.isArray(details)) {
                        details = [details];
                    }
        
                    for(var i=0; i<details.length; i++) {                
                            var newDetail = {
                                Restaurant_Code: req.params.rid,
                                Menu_Code: req.params.mid,
                                MenuOption_Code: details[i]
                            }; 
        
                        sql = 'INSERT INTO menuinjuction SET ?';
                        conn.query(sql, newDetail, function(err, results) {
                            if(err) {
                                console.log('db err');
                                res.status(500);
                            }
                        });
                    }
        
                    req.session.save(function() {
                        res.redirect('/menu/' + req.params.rid + '/' + req.params.mid + '/detail');
                    });
                } else {
                    req.session.save(function() {
                        res.redirect('/menu/' + req.params.rid + '/' + req.params.mid + '/detail');
                    });
                }

                conn.release();
            });
        });     
    });

    router.post('/:rid/:mid/delete', function(req,res){
        var mid = req.params.mid;
        var sql = 'DELETE FROM menuinjuction WHERE Menu_Code = ?';

        pool.getConnection(function(err, conn) {
            conn.query(sql, [mid], function(err, results) { 
                sql = 'DELETE FROM menu WHERE Menu_Code = ?';

                conn.query(sql, [mid],function(err, results) { 
                    req.session.save(function() {
                        res.redirect('/menu/' + req.params.rid);
                    });
                });                
                conn.release();
            });
        });
    });

    router.post('/option/:rid/:mid/delete', function(req,res){
        var mid = req.params.mid;
        var sql = 'DELETE FROM menuinjuction WHERE MenuOption_Code = ?';

        pool.getConnection(function(err, conn) {
            conn.query(sql, [mid], function(err, results) { 
                sql = 'DELETE FROM menuoption WHERE MenuOption_Code = ?';

                conn.query(sql, [mid],function(err, results) { 
                    req.session.save(function() {
                        res.redirect('/menu/' + req.params.rid);
                    });
                });                
                conn.release();
            });
        });
    });

    return router;
}