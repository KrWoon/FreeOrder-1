module.exports = function() {
    var router = require('express').Router();
    var conn = require('../../config/passport_config/db')();

    router.get('/add', function(req, res) {
        var sql = 'SELECT email,name FROM tempUser';
         conn.query(sql, function(err, rows, fields) {
             if(err) {
                 console.log(err);
                 res.status(500).send('Internal Server Error');
             } else {
                res.render('home/add', { 'topics' : rows, 'login' : req.user });
             }
         });
     });
    
     router.post('/add', function(req, res) {
        var email = req.body.email;
        var name = req.body.name;
        var password = 111111;
    
        var sql = 'INSERT INTO tempUser (email, name, password) VALUES(?, ?, ?)';
        conn.query(sql, [email, name, password], function(err, rows, fields) {
            if(err) {
                console.log(err);
                res.status(500).send('DB error');
            } else {
                res.redirect('/home/'+rows.insertId);
            }
        });
     });
    
    
     router.get('/:uid/edit', function(req,res){
        var sql = 'SELECT uid,email,name FROM tempUser';
        conn.query(sql, function(err, rows, fields) {         
           var uid = req.params.uid;
           if(uid) {
               var sql = 'SELECT * FROM tempUser WHERE uid=?';
               conn.query(sql, [uid], function(err, row, fields) {
                   res.render('home/edit', {'topics' : rows, 'user' : row[0], 'login' : req.user});
               });
           } else {
               consol.elog('There is no uid');
           }        
        });
    });
    
    router.post('/:uid/edit', function(req,res){
        var email = req.body.email;
        var name = req.body.name;
        var uid = req.params.uid;
        var password = 111111;
    
        var sql = 'UPDATE tempUser SET email=?, name=?, password=? WHERE uid=?';
        conn.query(sql, [email, name, password, uid], function(err, rows, fields) {
            if(err) {
                console.log(err);
                res.status(500).send('DB error');
            } else {
                res.redirect('/home/' + uid);
            }
        });
    });
    
    
    router.get('/:uid/delete', function(req,res){
        var sql = 'SELECT uid,email,name FROM tempUser';
        var uid = req.params.uid;
        conn.query(sql, function(err, rows, fields) {   
            var sql = 'SELECT * FROM tempUser WHERE uid=?';
            conn.query(sql, [uid], function(err, row, fields) {
                if(row.length === 0) {
                    console.log('There is no record');
                } else {
                    res.render('home/delete', {'topics' : rows, 'user' : row[0], 'login' : req.user});
                }
            });        
        });
    });
    
    router.post('/:uid/delete', function(req,res){
        var uid = req.params.uid;
        var sql = 'DELETE FROM tempUser WHERE uid=?';
    
        conn.query(sql, [uid], function(err, rows, fields) { 
            res.redirect('/home');
        });
    });
    
    
    router.get(['/', '/:uid'], function(req,res){
         var sql = 'SELECT uid,email,name FROM tempUser';
         conn.query(sql, function(err, rows, fields) {         
            var uid = req.params.uid;
            if(uid) {
                var sql = 'SELECT * FROM tempUser WHERE uid=?';
                conn.query(sql, [uid], function(err, row, fields) {
                    res.render('home/home', {'topics' : rows, 'user' : row[0], 'login' : req.user});
                });
            } else {
                res.render('home/home', { 'topics' : rows, 'user' : 'None', 'login' : req.user});
            }        
         });
     });

     return router;
}