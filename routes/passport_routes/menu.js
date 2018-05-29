module.exports = function (io) {
    var router = require('express').Router();
    var pool = require('../../config/passport_config/db')();

    // get menus
    router.get('/:rid', function (req, res) {
        var sql = 'SELECT Menu_Code, Menu_Name, Price, CookingTime FROM menu WHERE Restaurant_Code = ? AND Use_Code = \'Y\'';
        pool.getConnection(function (err, conn) {
            if(err) throw err;
            conn.query(sql, [req.params.rid], function (err, menus) {
                if(err) throw err;
                conn.release();
                res.json(menus);
            });
        });        
    });

    // get options
    router.get('/option/:rid', function (req, res) {
        var sql = 'SELECT MenuOption_Code, MenuOption_Name, Price FROM menuoption WHERE Restaurant_Code = ? AND Use_Code = \'Y\'';
        pool.getConnection(function (err, conn) {
            if(err) throw err;
            conn.query(sql, [req.params.rid], function (err, options) {
                if(err) throw err;
                conn.release();
                res.json(options);
            });
        });
    });

    // get details
    router.get('/details/:mid', function (req, res) {
        var sql = 'SELECT Menu_Code, menuoption.MenuOption_Code FROM menuoption INNER JOIN menu_menuoption ON menuoption.MenuOption_Code = menu_menuoption.MenuOption_Code WHERE Menu_Code = ?';
        pool.getConnection(function (err, conn) {
            if(err) throw err;
            conn.query(sql, [req.params.mid], function (err, details) {
                if(err) throw err;
                conn.release();
                res.json(details);
            });
        });
    });

    // add new menu
    router.post('/:rid', function (req, res) {
        var newMenu = {
            Restaurant_Code: req.params.rid,
            Menu_Name: req.body.Menu_Name,
            Price: req.body.Price,
            CookingTime: req.body.CookingTime
        };

        var sql = 'INSERT INTO menu SET ?';
        pool.getConnection(function (err, conn) {
            conn.query(sql, newMenu, function (err, results) {
                if (err) {
                    conn.release();
                    console.log(err);
                    res.status(500);
                } else {
                    req.session.save(function () {
                        conn.release();
                        res.json({menu: 'New Menu is added!'})
                    });
                }
            });
        });
    });


    // add new option
    router.post('/option/:rid', function (req, res) {
        var newOption = {
            Restaurant_Code: req.params.rid,
            MenuOption_Name: req.body.MenuOption_Name,
            Price: req.body.Price
        };

        var sql = 'INSERT INTO menuoption SET ?';
        pool.getConnection(function (err, conn) {
            conn.query(sql, newOption, function (err, results) {
                if (err) {
                    conn.release();
                    console.log(err);
                    res.status(500);
                } else {
                    req.session.save(function () {
                        conn.release();
                        res.json({option: 'New Option is added!'})
                    });
                }
            });
        });
    });

    // add details except duplication
    router.post('/details/:mid', function (req, res) {
        console.log(req.body);

        pool.getConnection(function (err, conn) {     
            if(err) throw err;

            var sql = 'DELETE FROM menu_menuoption WHERE Menu_Code = ?';

            conn.query(sql, [req.body[0].Menu_Code], function(err, result) {
                if(err) throw err;

                req.session.save(function () {
                    sql = 'INSERT INTO menu_menuoption (Menu_Code, MenuOption_Code) VALUES(?, ?)';

                    for(var i=0; i<req.body.length; i++) {
                        conn.query(sql, [req.body[i].Menu_Code, req.body[i].MenuOption_Code], function (err, details) {
                            if(err) throw err;
                            console.log('complete');
                        });
                    }            
                    conn.release();
                    res.json("Detail option save complete");
                });
            });
        });
    });

    // delete menu
    router.delete('/:mid', function (req, res) {
        var mid = req.params.mid;
        // var sql = 'UPDATE menu SET Use_Code = \'N\' WHERE Menu_Code = ?';
        var sql = 'DELETE FROM menu WHERE Menu_Code = ?';

        pool.getConnection(function (err, conn) {
            conn.query(sql, [mid], function (err, results) {
                if(err) throw err;
                req.session.save(function () {
                    conn.release();
                    res.json({menu : 'Delete Menu Complete!'});
                });
            });
        });
    });

    // delete option
    router.delete('/option/:mid', function (req, res) {
        var mid = req.params.mid;
        // var sql = 'UPDATE menuoption SET Use_Code = \'N\' WHERE MenuOption_Code = ?';
        var sql = 'DELETE FROM menuoption WHERE MenuOption_Code = ?';

        pool.getConnection(function (err, conn) {
            conn.query(sql, [mid], function (err, results) {
                if(err) throw err;
                req.session.save(function () {
                    conn.release();
                    res.json({option : 'Delete Option Complete!'});
                });
            });
        });
    });

    return router;
}