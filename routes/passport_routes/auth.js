module.exports = function(passport) {
    var router = require('express').Router();
    var bkfd2Password = require('pbkdf2-password');
    var hasher = bkfd2Password();
    var pool = require('../../config/passport_config/db')();

    router.get('/register', function(req, res){ 
        res.render('auth/register');
    });
    
    router.get('/login', function(req, res) {
        res.render('auth/login');
    });
    
    router.post('/logout', function(req, res) {
        req.logout();
        req.session.save(function() {
            res.json({Logout: 'Logout Complete!'});
        });
    });

    // 회원가입
    router.post('/register', function(req, res) { 
        // 중복 아이디 체크
        var checkSql = 'SELECT * FROM manager WHERE Email = ? AND Use_Code = \'Y\'';
        pool.getConnection(function(err, checkConn) {
            checkConn.query(checkSql, [req.body.username], function(err, rows, fields) {
                // db에 아이디가 없다면
                if(!rows[0]) {
                    // 비밀번호랑 비밀번호확인이 같으면 입력
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
                                            res.redirect('/auth/login');
                                        });
                                    }
                                    conn.release();
                                });     
                            });               
                        });      
                     }
                     else {
                        req.session.save(function() {
                            res.write('<script type="text/javascript"> alert("Input password correctly"); </script>')
                            res.write('<script language=\"javascript\"> history.back(); </script>') 
                            // res.redirect('/auth/register');
                        });
                     }
                } else {
                    console.log('ID already exists');
                    req.session.save(function() {
                        res.write('<script type="text/javascript"> alert("ID already exists"); </script>')
                        res.write('<script language=\"javascript\"> history.back(); </script>') 
                        // res.redirect('/auth/register');
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