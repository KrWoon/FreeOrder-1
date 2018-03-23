// import modules
var express = require('express');
var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();

// router
var main = require('./router/main');

// connect database
var conn = mysql.createConnection({
    host : 'us-cdbr-iron-east-05.cleardb.net',
    user : 'b07725d6c368d8',
    password : 'caa62f50',
    database : 'heroku_0623ff804c82489'
});
conn.connect();

// router use
app.use ('/main', main);

// set model

// set view
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", 'ejs');

// set middlewares
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// set routes


// route URL
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/main.html");
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/email_post', function(req,res) {
    console.log(req.body.email);
    //res.send("<h1>Welcome! " + req.body.email + "</h1>");
    res.render('email', {'email' : req.body.email});
});

app.post('/ajax_send_email', function(req, res){
    var email = req.body.email;
    var responseData = {};

    var query = conn.query('select name from tempUser where email="' + email + '"', function (err, rows) {
        if (err) throw err;
        if (rows[0]) {
            console.log(rows[0])
            responseData.result = "ok";
            responseData.name = rows[0].name;
        } else {
            responseData.result = "none";
            responseData.name = "";
        }
        res.json(responseData)
    })
})


// start server
var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('Server On!');
});