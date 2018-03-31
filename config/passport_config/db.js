module.exports = function() {
    var mysql = require('mysql');

    // connect database
    var pool = mysql.createPool({
        host : 'us-cdbr-iron-east-05.cleardb.net',
        user : 'b07725d6c368d8',
        password : 'caa62f50',
        database : 'heroku_0623ff804c82489'
    });
    
    // conn.connect();

    return pool;
}