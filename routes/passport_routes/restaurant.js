module.exports = function() {
    var router = require('express').Router();
    var pool = require('../../config/passport_config/db')();

    router.get('/:rid', function(req,res){
        sql = 'SELECT * FROM restaurant WHERE Restaurant_Code = ?';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [req.params.rid], function(err, results) {
                res.render('restaurant/main', {'myRestaurant' : results[0], 'login' : req.user});                
                conn.release();
            });
        });     
    });

    router.get('/:rid/info', function(req, res) {
        sql = 'SELECT * FROM restaurant WHERE Restaurant_Code = ?';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [req.params.rid], function(err, results) {
                res.render('restaurant/info', {'myRestaurant' : results[0], 'login' : req.user});                
                conn.release();
            });
        }); 
    });

    router.post('/:rid/info', function(req, res) {
        var updateRestaurant = {
            Signboard : req.body.rname,
            Location : req.body.location,
            Category : req.body.category,
            openTime : req.body.opentime,
            closeTime : req.body.closetime,
            NumberOfTable : req.body.numoftable,
            BusineddStatus : req.body.status,
        };

        var sql = 'UPDATE restaurant SET ? WHERE Restaurant_Code = ' + req.params.rid;
        pool.getConnection(function(err, conn) {
            conn.query(sql, updateRestaurant, function(err, restaurant) {       
                    req.session.save(function() {
                        res.redirect('/restaurant/' + req.params.rid + '/info');
                    });
                conn.release();
            });
        });       
    });

    return router;
}