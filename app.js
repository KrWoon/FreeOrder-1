var express = require('express');
var path = require('path');

var app = express();

app.set("view engine", 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

var data={count:0};
app.get('/', function (req, res) {
    data.count++;
    res.render('my_first_ejs', data);
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Server On!');
});