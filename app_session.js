var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    secret : 'asd123123fasdfasfdasdf',
    resave: false,
    saveUninitialized: true
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
    res.redirect('/welcome');
});

app.get('/welcome', function(req, res) {
    if(req.session.displayName) {
        res.send(`
            <h1>Hello, ${req.session.displayName}</h1>
            <a href="/auth/logout"> Logout </a>
        `);
    } else {
        res.send(`
            <h1> Login, please </h1>
            <a href="/auth/login"> Login </a>
        `)
    }
});

app.post('/auth/login', function(req, res) {
    var user = {
        userid: 'asd',
        password: '111',
        displayName:'Jiwoon'
    };

    var uid = req.body.userid;
    var pwd = req.body.password;

    //로그인 성공
    if(uid === user.userid && pwd === user.password) {
        req.session.displayName = user.displayName;
        res.redirect('/welcome');
    } else {
        res.send('Who are you? <a href="/auth/login"> Login </a>');
    }
});

app.listen(3004, function() {
    console.log('Connect 3004 port!!!');
});