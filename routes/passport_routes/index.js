module.exports = function() {
    var router = require('express').Router();
    var pool = require('../../config/passport_config/db')();
    var multer = require('multer');
    var FCM = require('fcm-push');
    
    router.get('/', function(req, res){
        res.json({'login' : req.user});
    }); 

    // display restuarnats
    router.get('/restaurants', function(req, res){
        var sql = 'SELECT Signboard, Restaurant_Code FROM restaurant WHERE Manager_Code = ? AND Use_Code = \'Y\'';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [req.user.Manager_Code], function(err, restaurants) {  
                conn.release();    
                res.json({'login' : req.user, 'restaurants' : restaurants});
            });
        });     
    }); 

    // display applications
    router.get('/applications', function(req, res){
        var sql = 'SELECT * FROM application WHERE Manager_Code = ? AND Use_Code = \'Y\'';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [req.user.Manager_Code], function(err, applications) {   
                conn.release();   
                res.json({'login' : req.user, 'applications' : applications});
            });
        });     
    }); 

    // display applications
    router.get('/admins', function(req, res){
        var sql = 'SELECT Application_Code, Restaurant_Name, Businesslicense, Address, Email, application.Manager_Code FROM application JOIN manager ON application.Manager_Code = manager.Manager_Code WHERE application.Use_Code = \'Y\'';
        pool.getConnection(function(err, conn) {
            conn.query(sql, [], function(err, admins) { 
                conn.release();   
                res.json({'login' : req.user, 'admins' : admins});
            });
        });     
    }); 

    
    var upload = {
        insertImage:function (data, callback) {
            pool.getConnection(function(err, conn) {
                conn.query("INSERT INTO users (UserID, UserName, UserLocation) VALUES (0, ?, 'N')", [data], function(err, row) {
                    if(err) {console.log('error db')}
                    return conn.release();
                })
            });            
        }
    };

    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './public/images/')
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname)
        }
    });

    var uploads = multer({ storage: storage }).single('image');


    router.post('/upload', function (req, res, next) {
        uploads(req, res, function (err) {
            // if(err){
            //     return res.end('Error Upload file')
            // }
    
            upload.insertImage(req.file.filename, function (err, rows) {
                if(err){
                    res.end(err)
                } else {
                    res.json('db complete');
                }
            })
            res.json(req.file);
        })
    });

    // accept order and push message to mobile
    router.post('/push', function(req, res) {
        // req.on('data', (data) => {
        //     inputdata = JSON.parse(data);
        // });
        
        // req.on('end', () => {
        //     console.log(inputdata.Token);
        // });


        /** 아래는 푸시메시지 발송절차 */

        //var serverKey = 'AAAAsA86ukc:APA91bHf-9yxdx-iTff1-xsWn2AWibinaLe0vTVJM322e-y1xNKeuHaFFICBL97wl_38lrxHjCx4g3iE6l5fSMBvi84pUqfG3QZCxXM1i7dPQlxZJrSwlMmDLy6hls4TnI01-ERfjZ-d';
        var serverKey = 'AAAAz8FUF8Y:APA91bGFPY5QzMXzFP6TeHg0fBF4DF0GIaBKIrX3wVjRcOk3Sag2RUeO3ZvlROrAVb1XN6_9LV3Y6FfU4XC61qGbYJs6ZevrNYg9tkb-XH7ZF02NghfPoPkxJ63zPwe4UjGDhBjdWNp-';
        var client_token = 'dIXL2_Y-FA0:APA91bFoHvAX94ByYdP_dGhbhx10T9lkswKZibU_maLClo14K_I08av8-DIMXkH-TznXYpKzWQ8r-rqzxu_Tpmky47AYpSPcnPwrVgBX9aqQzlHLDtPMpAwPp8boxhXegkE4hMagj0ru';
    
        /** 발송할 Push 메시지 내용 */
        var push_data = {
            // 수신대상
            to: client_token,
            // App에게 전달할 데이터
            data: {
                num1: 2000
            },
            // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
            notification: {
                title: "Hello Node",
                body: "Node로 발송하는 Push 메시지 입니다."
            }
        };

        var fcm = new FCM(serverKey);

        fcm.send(push_data, function(err, response) {
            if (err) {
                console.error('Push메시지 발송에 실패했습니다.');
                console.error(err);
                return;
            }

            console.log('Push메시지가 발송되었습니다.');
            console.log(response);
        });
    });

    return router;
}