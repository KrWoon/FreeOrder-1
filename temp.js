// import modules
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');

// connect database
var conn = mysql.createConnection({
    host : 'us-cdbr-iron-east-05.cleardb.net',
    user : 'b07725d6c368d8',
    password : 'caa62f50',
    database : 'heroku_0623ff804c82489'
});
conn.connect();

// start server
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Server On!');
});