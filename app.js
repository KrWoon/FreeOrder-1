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

server.listen('3000');

io.on('connection', (socket) => {
    console.log('Socket Cunnect');

    socket.on('disconnect', function(){
        console.log('Socket Disconnected');
    });
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
var passport = require('./config/passport_config/passport')(app);
var auth = require('./routes/passport_routes/auth')(passport);
app.use('/auth/', auth);
var form = require('./routes/passport_routes/form')();
app.use('/form', form);
var index = require('./routes/passport_routes/index')();
app.use('/index', index);
var restaurant = require('./routes/passport_routes/restaurant')();
app.use('/restaurant', restaurant);
var menu = require('./routes/passport_routes/menu')(io);
app.use('/menu', menu);

var order = require('./routes/passport_routes/order')();
app.use('/order', order);


// start server
// var port = process.env.PORT || 3000;
// app.listen(port, function() {
//     console.log('Server On!');
// });