var express = require('express');
var path = require('path');
var mysql = require('mysql');

var app = express();

//app.set("view engine", 'ejs');
//app.use(express.static(path.join(__dirname, 'public')));

var conn = mysql.createConnection({
    host : 'us-cdbr-iron-east-05.cleardb.net',
    user : 'b07725d6c368d8',
    password : 'caa62f50',
    database : 'heroku_0623ff804c82489'
});

conn.connect();

app.get('/', function (req, res) {
    conn.query('SELECT * FROM pac;', function(err, rows, fields) {
        if(err) {
            console.log('error', err);
        }
        res.send(['Hello World!!! Ji Woon 2!!', rows]);
    });
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('Server On!');
});