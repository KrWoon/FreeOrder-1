var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require('pbkdf2-password');

var hasher = bkfd2Password();
var app = express();

app.use(bodyParser.urlencoded({extended:false}));
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

app.get('/auth/login', function(req, res) {
    var output = `
    <h1> Login </h1>
    <form action="/auth/login" method="post">
        <p>
            <input type="text" name="userid" placeholder="ID">
        </p>
        <p>
            <input type="password" name="password" placeholder="Password">
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    `;    
    res.send(output);
});

app.get('/auth/logout', function(req, res) {
    delete req.session.displayName;
    req.session.save(function() {
        res.redirect('/welcome');
    });
});

app.get('/welcome', function(req, res) {
    if(req.session.displayName) {
        res.send(`
            <h1>Hello, ${req.session.displayName}</h1>
            <a href="/auth/logout"> Logout </a>
        `);
    } else {
        res.send(`
            <h1> Welcome </h1>
            <ul>
                <li><a href="/auth/login"> Login </a> </li>
                <li><a href="/auth/register"> Register </a> </li>
            </ul>
        `)
    }
});

app.get('/auth/register', function(req, res){ 
    var output = `
    <h1> Register </h1>
    <form action="/auth/register" method="post">
        <p>
            <input type="text" name="userid" placeholder="ID">
        </p>
        <p>
            <input type="password" name="password" placeholder="Password">
        </p>
        <p>
            <input type="text" name="username" placeholder="Name">
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    `;    
    res.send(output);
});

var users = [
    {
        userid: 'asd',
        password: 'VESwWQAv2ZqfpUL5fA1V+VYuws4uFn22tnRStdFbSlOjiv1dULqorgMgAbGBMVp1/xA4VYmmaLhoWQNFZCniPajeJN57lmkSH4HemH5ZkF16Vcb5nByI5gRsnd8ILejcMoiI9A7TwsnmjmlIntvrojAL1LUtMb4f3diofVq/9Aw=',
        salt:'kLGTUcjjjc2ULaNpkuWWHm0Cjb4MLWw22FJzbSuCUIaKhYs46MjenZOrB7uz0RQl4pA7LIr0C0SVXsaYKCuFJQ==',
        displayName:'Jiwoon'
    },
    {
        userid: 'qwe',
        password: 'b18333470bd0cec2fe1ec599c4ac8895',
        salt:'asdfasdfasg234',
        displayName:'QWE'
    }
];

app.post('/auth/register', function(req, res) {  
    hasher({password:req.body.password}, function(err, pass, salt, hash) {
        var user = {
            userid:req.body.userid,
            password:hash,
            salt:salt,
            displayName:req.body.username
        };
        users.push(user);
        req.session.displayName = user.displayName;
        req.session.save(function() {
            res.redirect('/welcome');
        });
    });      
});

app.post('/auth/login', function(req, res) {
    var uid = req.body.userid;
    var pwd = req.body.password;

    for(var i=0; i<users.length; i++) {
        var user = users[i];
        //로그인 성공
        if(uid === user.userid) {
            return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash) {
                if(hash === user.password) {
                    req.session.displayName = user.displayName;
                    req.session.save(function() {
                        res.redirect('/welcome');
                    });
                } else {
                    res.send('Who are you? <a href="/auth/login"> Login </a>');  
                }
            });
        }
        // if(uid === user.userid && md5(pwd+user.salt) === user.password) {
        //     req.session.displayName = user.displayName;
        //     return req.session.save(function() {
        //         res.redirect('/welcome');
        //     });
        // }
    }    
    res.send('Who are you? <a href="/auth/login"> Login </a>');    
});

app.listen(3004, function() {
    console.log('Connect 3004 port!!!');
});