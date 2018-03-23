// import modules
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();


// router
var index = require('./router/index');

// set model


// set view
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", 'ejs');


// set middlewares
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


// route URL
app.get('/login', function (req, res) {
    res.render('login');
});


// set routes
app.use (index);


// start server
var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('Server On!');
});