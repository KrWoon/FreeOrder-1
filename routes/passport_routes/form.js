module.exports = function() {
    var router = require('express').Router();
    var pool = require('../../config/passport_config/db')();
    
    router.get('/apply', function(req,res){
        res.render('form/apply');
    });

    router.post('/apply', function(req,res){
        var license = req.body.license1 + '-' + req.body.license2 + '-' + req.body.license3;        
        // Check Duplication of Restaurant
        var checkSql = 'SELECT * FROM application WHERE Businesslicense = ?';
        pool.getConnection(function(err, conn) {
            conn.query(checkSql, [req.body.license], function(err, restaurant, fields) {
                // if no duplication
                if(!restaurant[0]) {
                    var newApply = {
                        Manager_Code: req.user.Manager_Code,
                        Restaurant_Name: req.body.rname,
                        Businesslicense: license
                    };                         
                    
                var sql = 'INSERT INTO application SET ?';
                conn.query(sql, newApply, function(err, results, fields) {
                    if(err) {
                        console.log(err);
                        res.status(500);
                    } else {
                        req.session.save(function() {
                        res.redirect('/');
                        });
                    }
                });     
                } else {
                    console.log('Restaurant already exists')
                    req.session.save(function() {
                        res.redirect('/form/apply');
                    });
                }
                conn.release();
            });
        });        
    });

    router.get('/apply/:id/edit', function(req,res){
        var id = req.params.id;
        var sql = 'SELECT * FROM application WHERE Application_Code = ?';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [id], function(err, results) { 
                req.session.save(function() {                    
                    res.render('form/apply_edit', {'application' : results[0]});
                });
                conn.release();
            });
        });
    });

    router.post('/apply/:id/edit', function(req,res){
        // 식당 중복 체크
        var checkSql = 'SELECT * FROM application WHERE Businesslicense = ?';
        pool.getConnection(function(err, conn) {
            conn.query(checkSql, [req.body.license], function(err, restaurant, fields) {
                // 중복된 식당이 없다면
                if(!restaurant[0]) {     
                    
                var sql = 'UPDATE application SET Restaurant_Name=?, Businesslicense=? WHERE Application_Code = ?';
                conn.query(sql, [req.body.rname, req.body.license, req.params.id], function(err, results, fields) {
                    if(err) {
                        console.log(err);
                        res.status(500);
                    } else {
                        req.session.save(function() {
                        res.redirect('/');
                        });
                    }
                });     
                } else {
                    console.log('Restaurant already exists')
                    req.session.save(function() {
                        res.redirect('/form/apply/'+req.params.id+'/edit');
                    });
                }
                conn.release();
            });
        });        
    });

    router.post('/apply/:id/delete', function(req,res){
        var id = req.params.id;
        var sql = 'DELETE FROM application WHERE Application_Code = ?';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [id], function(err, results) { 
                req.session.save(function() {
                    res.redirect('/');
                });
                conn.release();
            });
        });
    });

    router.get('/permit', function(req,res){
        var sql = 'SELECT * FROM application INNER JOIN manager ON application.Manager_Code = manager.Manager_Code';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [], function(err, results, fields) {
                res.render('form/permit', {restaurants : results})
            });
            conn.release();
        });
    });

    router.get('/permit/:id', function(req,res){
        var id = req.params.id;

        var sql = 'SELECT * FROM application INNER JOIN manager ON application.Manager_Code = manager.Manager_Code WHERE application.Application_Code = ?';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [id], function(err, results) {
                res.render('form/permit_id', {restaurant : results[0]})
            });
            conn.release();
        });                
    });

    router.post('/permit/:id', function(req,res){
        var newRestaurant = {
            Manager_Code : req.body.managerCode,
            Signboard : req.body.rname,
            Location : 'N',
            NumberOfTable : 0
        };

        var sql = 'INSERT INTO restaurant SET ?';
        pool.getConnection(function(err, conn) {
            conn.query(sql, newRestaurant, function(err, restaurant) {
                sql = 'DELETE FROM application WHERE Application_Code = ?';                
                conn.query(sql, req.params.id, function(err, rows) {
                    req.session.save(function() {
                        res.redirect('/form/permit');
                    });
                });
                conn.release();
            });
        });                
    });

    return router;
}