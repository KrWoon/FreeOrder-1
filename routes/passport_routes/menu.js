module.exports = function () {
    var router = require('express').Router();
    var pool = require('../../config/passport_config/db')();

    // router.get(['/:rid', '/:rid/:mid/detail'], function (req, res) {
    //     var sql = 'SELECT * FROM menu WHERE Restaurant_Code = ? AND Use_Code = \'Y\'';
    //     pool.getConnection(function (err, conn) {
    //         conn.query(sql, [req.params.rid], function (err, menus) {
    //             sql = 'SELECT * FROM menuoption WHERE Restaurant_Code = ? AND Use_Code = \'Y\'';

    //             conn.query(sql, [req.params.rid], function (err, options) {
    //                 if (req.params.mid) {
    //                     sql = 'SELECT * FROM menuoption INNER JOIN menu_menuoption ON menuoption.MenuOption_Code = menu_menuoption.MenuOption_Code WHERE menu_menuoption.Menu_Code = ? AND menu_menuoption.Use_Code = \'Y\''

    //                     conn.query(sql, [req.params.mid], function (err, menuDetails) {
    //                         res.render('menu/mLayout', { 'menu': menus, 'menuDetail': menuDetails, 'menuOption': options, 'r_Code': req.params.rid, 'm_Code': req.params.mid, 'login' : req.user });
    //                     });
    //                 } else {
    //                     res.render('menu/mLayout', { 'menu': menus, 'menuOption': options, 'r_Code': req.params.rid, 'm_Code': 'None', 'login' : req.user  });
    //                 }
    //             });
    //             conn.release();
    //         });
    //     });
    // });

    router.get('/:rid', function (req, res) {
        var sql = 'SELECT Menu_Code, Menu_Name, Price, Delay FROM menu WHERE Restaurant_Code = ? AND Use_Code = \'Y\'';
        pool.getConnection(function (err, conn) {
            conn.query(sql, [req.params.rid], function (err, menus) {
                conn.release();
                res.json(menus);
            });
        });
    });

    router.get('/option/:rid', function (req, res) {
        var sql = 'SELECT MenuOption_Code, MenuOption_Name, Price FROM menuoption WHERE Restaurant_Code = ? AND Use_Code = \'Y\'';
        pool.getConnection(function (err, conn) {
            conn.query(sql, [req.params.rid], function (err, options) {
                conn.release();
                res.json(options);
            });
        });
    });

    router.get('/details/:mid', function (req, res) {
        var sql = 'SELECT menuoption.MenuOption_Code, menuoption.MenuOption_Name, menuoption.Price FROM menuoption INNER JOIN menu_menuoption ON menuoption.MenuOption_Code = menu_menuoption.MenuOption_Code WHERE Menu_Code = ?';
        pool.getConnection(function (err, conn) {
            conn.query(sql, [req.params.mid], function (err, details) {
                conn.release();
                res.json(details);
            });
        });
    });

    router.post('/:rid', function (req, res) {
        var newMenu = {
            Restaurant_Code: req.params.rid,
            Menu_Name: req.body.Menu_Name,
            Price: req.body.Price,
            Delay: req.body.Delay
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

    router.post('/:rid/:mid/detail/add', function (req, res) {
        var details = req.body.detail;
        var sql = 'DELETE FROM menu_menuoption WHERE Menu_Code = ? AND Use_Code = \'Y\'';

        pool.getConnection(function (err, conn) {
            conn.query(sql, [req.params.mid], function (err, results) {
                if (details) {
                    if (!Array.isArray(details)) {
                        details = [details];
                    }

                    for (var i = 0; i < details.length; i++) {
                        var newDetail = {
                            Menu_Code: req.params.mid,
                            MenuOption_Code: details[i]
                        };

                        sql = 'INSERT INTO menu_menuoption SET ?';
                        conn.query(sql, newDetail, function (err, results) {
                            if (err) {
                                console.log('db err');
                                res.status(500);
                            }
                        });
                    }

                    req.session.save(function () {
                        res.redirect('/menu/' + req.params.rid + '/' + req.params.mid + '/detail');
                    });
                } else {
                    req.session.save(function () {
                        res.redirect('/menu/' + req.params.rid + '/' + req.params.mid + '/detail');
                    });
                }

                conn.release();
            });
        });
    });

    router.delete('/:mid', function (req, res) {
        var mid = req.params.mid;
        // var sql = 'UPDATE menu SET Use_Code = \'N\' WHERE Menu_Code = ?';
        var sql = 'DELETE FROM menu WHERE Menu_Code = ?';

        pool.getConnection(function (err, conn) {
            conn.query(sql, [mid], function (err, results) {
                req.session.save(function () {
                    conn.release();
                    res.json({menu : 'Delete Menu Complete!'});
                });
            });
        });
    });

    router.delete('/option/:mid', function (req, res) {
        var mid = req.params.mid;
        // var sql = 'UPDATE menuoption SET Use_Code = \'N\' WHERE MenuOption_Code = ?';
        var sql = 'DELETE FROM menuoption WHERE MenuOption_Code = ?';

        pool.getConnection(function (err, conn) {
            conn.query(sql, [mid], function (err, results) {
                req.session.save(function () {
                    conn.release();
                    res.json({option : 'Delete Option Complete!'});
                });
            });
        });
    });

    return router;
}