module.exports = function() {
    var router = require('express').Router();
    var pool = require('../../config/passport_config/db')();

    router.get('/:id', function(req,res){
        sql = 'SELECT * FROM restaurant WHERE Restaurant_Code = ?'
        pool.getConnection(function(err, conn) {
            conn.query(sql, [req.params.id], function(err, results) {
                res.render('restaurant/main', {'my' : results[0]});                
                conn.release();
            });
        });     
    });

    return router;
}