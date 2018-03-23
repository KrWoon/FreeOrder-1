var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var mysql = require('mysql');

// connect database
var conn = mysql.createConnection({
    host : 'us-cdbr-iron-east-05.cleardb.net',
    user : 'b07725d6c368d8',
    password : 'caa62f50',
    database : 'heroku_0623ff804c82489'
});
conn.connect();

router.get('/', function(req,res){
    res.sendFile(path.join(__dirname, '../../public/join.html'))
})

router.post('/', function(req,res){
    var body = req.body;
    var email = body.email;
    var name = body.name;
    var passwd = body.password;

    var query = conn.query('insert into tempUser (email, name, password) values ("' + email + '","' + name + '","' + passwd + '")', function(err, rows) {
        if(err) { throw err;}
        res.render('welcome.ejs', {'name' : name, 'id': rows.insertId})
    })
})


module.exports = router;