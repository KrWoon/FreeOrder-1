var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');

app.use(cookieParser('asdfsadf1231564asdf!@#'));

var products = {
    1:{title : 'The history of web 1'},
    2:{title : 'The next web'}
};

app.get('/products', function(req,res) {
    var output = '';
    for(var name in products) {
        output += `
        <li>
            <a href="/cart/${name}">${products[name].title}</a>
        </li>`
    }
    res.send(`<h1>Products</h1>
    <ul>${output}</ul>
    <a href="/cart">Cart</a>`);
});

app.get('/cart/:id', function(req, res) {
    var id = req.params.id;
    // 카트 아이디 있으면
    if(req.signedCookies.cart) {
        var cart = req.signedCookies.cart;
    } else {
        var cart = {};
    }
    // 카트의 갯수가 아직 없으면 0으로 설정
    if(!cart[id]) {
        cart[id] = 0;
    }

    cart[id] = parseInt(cart[id]) + 1;
    res.cookie('cart', cart, {signed:true});
    console.log(cart);
    res.redirect('/cart');
});

app.get('/cart', function(req, res) {
    var cart = req.signedCookies.cart;

    if(!cart) {
        res.send('Empty!');
    } else {
        var output = '';
        for(var id in cart) {
            output += `
            <li> 
                ${products[id].title} (${cart[id]})
            </li>`
        }
    }
    res.send(`
    <h1>Cart</h1>
    <ul>${output}</ul> 
    <a href="/products"> Products List </a>`);
});

app.get('/count', function(req, res) {
    if(req.signedCookies.count) {
        var count = parseInt(req.signedCookies.count);
    } else {
        var count = 0;
    }

    count = count + 1;
    res.cookie('count', count, {signed:true});
    res.send('count : ' + count);
})

app.listen(3003, function() {
    console.log('Connect 3003 port!!!');
});