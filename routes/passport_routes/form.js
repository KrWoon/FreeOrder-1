module.exports = function() {
    var router = require('express').Router();
    var pool = require('../../config/passport_config/db')();
    
    router.get('/apply', function(req,res){
        res.render('form/apply');
    });

    router.post('/apply', function(req,res){
        // 식당 중복 체크
        var checkSql = 'SELECT * FROM application WHERE Businesslicense = ?';
        pool.getConnection(function(err, checkConn) {
            checkConn.query(checkSql, [req.body.license], function(err, restaurant, fields) {
                // 중복된 식당이 없다면
                if(!restaurant[0]) {
                    var newRestaurant = {
                        Manager_Code: req.user.Manager_Code,
                        Restaurant_Name: req.body.rname,
                        Businesslicense: req.body.license
                    };                         
                    
                    var sql = 'INSERT INTO application SET ?';
                    pool.getConnection(function(err, conn) {
                        conn.query(sql, newRestaurant, function(err, results, fields) {
                            if(err) {
                                console.log(err);
                                res.status(500);
                            } else {
                                req.session.save(function() {
                                    res.redirect('/');
                                });
                            }
                            conn.release();
                        });     
                    });    
                } else {
                    console.log('Restaurant already exists')
                    req.session.save(function() {
                        res.redirect('/form/apply');
                    });
                }
                checkConn.release();
            });
        });        
    });

    router.get('/permit', function(req,res){
        var sql = 'SELECT * FROM application';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [], function(err, results, fields) {
                res.render('form/permit', {restaurants : results})
            });
            conn.release();
        });
    });

    router.get('/permit/:id', function(req,res){
        var id = req.params.id;

        var sql = 'SELECT * FROM application WHERE Application_Code = ?';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [id], function(err, results, fields) {
                res.render('form/permit_id', {restaurant : results[0]})
            });
            conn.release();
        });                
    });

    router.post('/permit/:id', function(req,res){
        req.session.save(function() {
            res.redirect('/form/permit');
        });
        
    });

    return router;
}