var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var cors = require('cors')
var logger = require('morgan');
var path = require('path');
var history = require('connect-history-api-fallback');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function() {
    console.log('Server On!');
});

// set view
app.set('views',  './views/passport_views');
app.set("view engine", 'ejs');

 // set middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
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
app.use(logger('dev'));
app.use(history());


// set static files
app.use(express.static(path.join(__dirname, 'public')));


// set routes
var passport = require('./config/passport')(app);
var auth = require('./routes/auth')(passport);
app.use('/auth/', auth);
var form = require('./routes/form')();
app.use('/form', form);
var index = require('./routes/index')();
app.use('/index', index);
var restaurant = require('./routes/restaurant')();
app.use('/restaurant', restaurant);
var menu = require('./routes/menu')(io);
app.use('/menu', menu);

var order = require('./routes/order')(io);
app.use('/order', order);


