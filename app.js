var express = require('express');
var path = require('path');
var mysql = require('mysql');

var app = express();

app.set("view engine", 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

var conn = mysql.createConnection({
    host : 'us-cdbr-iron-east-05.cleardb.net',
    user : 'b07725d6c368d8',
    password : 'caa62f50',
    database : 'heroku_0623ff804c82489'
});

conn.connect();


app.get('/', function (req, res) {
    conn.query('SELECT * FROM heroku_0623ff804c82489.pac;', function(err, rows, fields) {
        if(err) {
            res.send('error');
        }
        res.send(['Hello World!!! Ji Woon!!', rows]);
    });
});

conn.end();

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Server On!');
});