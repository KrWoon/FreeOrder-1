module.exports = function(app) {
    var pool = require('./db')();
    var bkfd2Password = require('pbkdf2-password');
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var hasher = bkfd2Password();

    app.use(passport.initialize());
    app.use(passport.session());

    // 로그인
    passport.serializeUser(function(user, done) {
        done(null, user.Email);
    });
    passport.deserializeUser(function(email, done) {
        var sql = 'SELECT * FROM manager WHERE Email=?';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [email], function(err, results, fields) {
                if(!results[0]) {
                    conn.release();
                    return done(null, false);
                } else {
                    conn.release();
                    return done(null, results[0]);
                }
            });
        });
    });
    passport.use(new LocalStrategy(
        function(username, password, done) {
            var email = username;
            var pwd = password;

            var sql = 'SELECT * FROM manager WHERE Email=?';
            pool.getConnection(function(err, conn) {
                conn.query(sql, [email], function(err, results, fields) {
                    if(!results[0]) {
                        conn.release();
                        return done(null, false);
                    }
                    
                    var user = results[0];
                    return hasher({password:pwd, salt:user.Salt}, function(err, pass, salt, hash) {
                        if(hash === user.Manager_PW) {
                            done(null, user);
                        } else {
                            done(null, false);
                        }
                        conn.release();
                    });            
                });
            });
        }
    ));
    return passport;
}