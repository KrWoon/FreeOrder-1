module.exports = function(passport) {
    var router = require('express').Router();
    var bkfd2Password = require('pbkdf2-password');
    var hasher = bkfd2Password();
    var pool = require('../config/db')();
    
    router.post('/logout', function(req, res) {
        req.logout();
        req.session.save(function() {
            res.json({Logout: 'Logout Complete!'});
        });
    });

    // Sign Up
    router.post('/register', function(req, res) { 
        // Check duplicated ID
        var checkSql = 'SELECT * FROM manager WHERE Email = ? AND Use_Code = \'Y\'';
        pool.getConnection(function(err, checkConn) {
            checkConn.query(checkSql, [req.body.username], function(err, rows, fields) {
                // If there is no ID in database
                if(!rows[0]) {
                    // "password" and "confirm password" is same
                    if(req.body.password == req.body.confirmPassword) {
                        hasher({password:req.body.password}, function(err, pass, salt, hash) {
                            var newuser = {
                                manager_name: req.body.realname,
                                email: req.body.username,
                                manager_pw: hash,
                                salt: salt,
                                power: 0
                            };                         
                            
                            var sql = 'INSERT INTO manager SET ?';
                            pool.getConnection(function(err, conn) {
                                conn.query(sql, newuser, function(err, rows, fields) {
                                    if(err) {
                                        console.log(err);
                                        res.status(500);
                                    } else {
                                        req.session.save(function() {
                                            res.json('success');
                                        });
                                    }
                                    conn.release();
                                });     
                            });               
                        });      
                     }
                     else {
                        req.session.save(function() {
                            res.json('password');
                        });
                     }
                } else {
                    req.session.save(function() {
                        res.json('id');
                    });
                }
                checkConn.release();
            });
        });
    });

    router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFalsh: false
    }));
        
    return router;
}