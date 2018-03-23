var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mysql');

// connect database
var conn = mysql.createConnection({
    host : 'us-cdbr-iron-east-05.cleardb.net',
    user : 'b07725d6c368d8',
    password : 'caa62f50',
    database : 'heroku_0623ff804c82489'
});
conn.connect();


router.post('/form', function(req,res) {
    console.log(req.body.email);
    //res.send("<h1>Welcome! " + req.body.email + "</h1>");
    res.render('email.ejs', {'email' : req.body.email});
});

router.post('/ajax', function(req, res){
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

module.exports = router;