var app = require('./config/passport_config/express')();

// set routes
var passport = require('./config/passport_config/passport')(app);
var auth = require('./routes/passport_routes/auth')(passport);
app.use('/auth/', auth);
var form = require('./routes/passport_routes/form')();
app.use('/form', form);
var index = require('./routes/passport_routes/index')();
app.use('/', index);
var restaurant = require('./routes/passport_routes/restaurant')();
app.use('/restaurant', restaurant);
var menu = require('./routes/passport_routes/menu')();
app.use('/menu', menu);

var movies = require('./routes/movies');
app.use('/api/movies', movies);


// start server
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Server On!');
});