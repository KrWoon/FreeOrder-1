module.exports = function() {
    var router = require('express').Router();
    var pool = require('../../config/passport_config/db')();
    
    router.get('/', function(req, res){
        if(req.user) {
            var sql = 'SELECT * FROM restaurant WHERE Manager_Code = ? AND Use_Code = \'Y\'';
            pool.getConnection(function(err, conn) {
                conn.query(sql, [req.user.Manager_Code], function(err, restaurants) {
                    
                    sql = 'SELECT * FROM application WHERE Manager_Code = ? AND Use_Code = \'Y\'';
                    conn.query(sql, [req.user.Manager_Code], function(err, applications) {
                        res.render('index', {'login' : req.user, 'restaurants' : restaurants, 'applications' : applications});
                    });

                    conn.release();
                });
            });     
        } else {
            res.render('index', {'login' : req.user});
        }
    }); 

    return router;
}