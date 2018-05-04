var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var cors = require('cors')
var logger = require('morgan');
var path = require('path');
    
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
app.use(cors());
app.use(logger('dev'));


// set static files
app.use(express.static(path.join(__dirname, 'public')));


// set routes
var passport = require('./config/passport_config/passport')(app);
var auth = require('./routes/passport_routes/auth')(passport);
app.use('/auth/', auth);
var form = require('./routes/passport_routes/form')();
app.use('/form', form);
var index = require('./routes/passport_routes/index')();
app.use('/', index);
var restaurant = require('./routes/passport_routes/restaurant')();
app.use('/restaurant', restaurant);
var menu = require('./routes/passport_routes/menu')();
app.use('/menu', menu);



// start server
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Server On!');
});