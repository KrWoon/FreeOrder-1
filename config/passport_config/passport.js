module.exports = function(app) {
    var conn = require('./db')();
    var bkfd2Password = require('pbkdf2-password');
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var hasher = bkfd2Password();

    app.use(passport.initialize());
    app.use(passport.session());

    // 로그인
    passport.serializeUser(function(user, done) {
        done(null, user.authId);
    });
    passport.deserializeUser(function(id, done) {
        var sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, [id], function(err, rows, fields) {
            if(!rows[0]) {
                return done(null, false);
            } else {
                return done(null, rows[0]);
            }
        });
    });
    passport.use(new LocalStrategy(
        function(username, password, done) {
            var uname = username;
            var pwd = password;

            var sql = 'SELECT * FROM users WHERE authId=?';
            conn.query(sql, ['local:'+uname], function(err, rows, fields) {
                if(!rows[0]) {
                    return done(null, false);
                }
                
                var user = rows[0];
                return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash) {
                    if(hash === user.password) {
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                });            
            });
        }
    ));
    return passport;
}