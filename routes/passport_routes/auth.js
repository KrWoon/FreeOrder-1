module.exports = function(passport) {
    var router = require('express').Router();
    var bkfd2Password = require('pbkdf2-password');
    var hasher = bkfd2Password();
    var conn = require('../../config/passport_config/db')();

    router.get('/register', function(req, res){ 
        res.render('auth/register');
    });
    
    router.get('/login', function(req, res) {
        res.render('auth/login');
    });
    
    router.get('/logout', function(req, res) {
        req.logout();
        req.session.save(function() {
            res.redirect('/home');
        });
    });

    // 회원가입
    router.post('/register', function(req, res) {  
        hasher({password:req.body.password}, function(err, pass, salt, hash) {
            var newuser = {
                authId:'local:'+req.body.username,
                username:req.body.username,
                password:hash,
                salt:salt,
                displayName:req.body.displayname
            };
            
            var sql = 'INSERT INTO users SET ?';
            conn.query(sql, newuser, function(err, rows, fields) {
                if(err) {
                    console.log(err);
                    res.status(500);
                } else {
                    // 회원가입 후 자동 로그인 주석
                    // req.login(newuser, function(err) {
                        req.session.save(function() {
                            res.redirect('/home');
                        });
                    // });
                }
            });        
        });      
    });

    router.post('/login', passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/auth/login',
        failureFalsh: false
    }));
        
    return router;
}