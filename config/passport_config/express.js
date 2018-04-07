module.exports = function() {
    var express = require('express');
    var session = require('express-session');
    var MySQLStore = require('express-mysql-session')(session);
    var bodyParser = require('body-parser');
    
    var app = express();
    
    // set view
    app.set('views',  './views/passport_views');
    app.set("view engine", 'ejs');
    
    // set middlewares
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(session({
        secret : 'asd123123fasdfasfdasdf',
        resave: false,
        saveUninitialized: true,
        store:new MySQLStore({
            host : 'us-cdbr-iron-east-05.cleardb.net',
            port : 3306,
            user : 'b07725d6c368d8',
            password : 'caa62f50',
            database : 'heroku_0623ff804c82489'
        })
    }));
    
    return app;
}

