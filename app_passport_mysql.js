var app = require('./config/passport_config/express')();
var passport = require('./config/passport_config/passport')(app);
var auth = require('./routes/passport_routes/auth')(passport);


app.get('/welcome', function(req, res) {
    if(req.user && req.user.displayName) {
        res.send(`
            <h1>Hello, ${req.user.displayName}</h1>
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

// set routes
app.use('/auth/', auth);

app.listen(3004, function() {
    console.log('Connect 3004 port!!!');
});