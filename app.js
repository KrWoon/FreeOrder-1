// import modules
var express = require('express');
var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var app = express();

// connect database
var conn = mysql.createConnection({
    host : 'us-cdbr-iron-east-05.cleardb.net',
    user : 'b07725d6c368d8',
    password : 'caa62f50',
    database : 'heroku_0623ff804c82489'
});
conn.connect();

// set model

// set view
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", 'ejs');

// set middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// set routes


var data = {count:0};
app.get('/', function (req, res) {
    data.count++;
    res.render('my_first_ejs',data);
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/email_post', function(req,res) {
    console.log(req.body.email);
    res.send("<h1>Welcome! " + req.body.email + "</h1>");
});


// start server
var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('Server On!');
});