module.exports = function() {
    var router = require('express').Router();
    var pool = require('../config/db')();
    var multer = require('multer');

    // get restaurant info
    router.get('/:rid', function(req,res){
        sql = 'SELECT * FROM restaurant WHERE Restaurant_Code = ? AND Use_Code = \'Y\'';
        pool.getConnection(function(err, conn) {
            if(err) console.log(err);
            conn.query(sql, [req.params.rid], function(err, results) { 
                if(err) throw err;              

                conn.release();
                res.json(results[0]);
            });
        });     
    });

    // update restaurant
    router.put('/:rid', function(req, res) {
        var updateRestaurant = {
            Signboard : req.body.Signboard,
            Address : req.body.Address,
            Category : req.body.Category,
            NumberOfTable : req.body.NumberOfTable,
            openTime : req.body.openTime,
            closeTime : req.body.closeTime,
            Delay : req.body.Delay,
            Latitude : req.body.Latitude,
            Longitude : req.body.Longitude,
            PhoneNumber : req.body.PhoneNumber
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



    // upload image
    var upload = {
        insertImage:function (data, rCode, callback) {
            pool.getConnection(function(err, conn) {
                conn.query("UPDATE restaurant SET ImageName= ? WHERE Restaurant_Code = ?", [data, rCode], function(err, row) {
                    if(err) {console.log('error db')}
                    return conn.release();
                })
            });            
        }
    };

    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './public/images/')
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname)
        }
    });

    var uploads = multer({ storage: storage }).single('image');


    router.post('/upload/:rid', function (req, res, next) {
        uploads(req, res, function (err) {    
            upload.insertImage(req.file.filename, req.params.rid ,function (err, rows) {
                if(err){
                    res.end(err)
                } else {
                    res.json('db complete');
                }
            })
            res.json(req.file);
        })
    });

    return router;
}