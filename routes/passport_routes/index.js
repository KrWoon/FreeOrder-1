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
                if(err) console.log(err);
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


    // accept order and push message to mobile
    router.post('/push', function(req, res) {
        /** 아래는 푸시메시지 발송절차 */
        var serverKey = 'AAAAz8FUF8Y:APA91bGFPY5QzMXzFP6TeHg0fBF4DF0GIaBKIrX3wVjRcOk3Sag2RUeO3ZvlROrAVb1XN6_9LV3Y6FfU4XC61qGbYJs6ZevrNYg9tkb-XH7ZF02NghfPoPkxJ63zPwe4UjGDhBjdWNp-';
        var client_token = 'dIXL2_Y-FA0:APA91bFoHvAX94ByYdP_dGhbhx10T9lkswKZibU_maLClo14K_I08av8-DIMXkH-TznXYpKzWQ8r-rqzxu_Tpmky47AYpSPcnPwrVgBX9aqQzlHLDtPMpAwPp8boxhXegkE4hMagj0ru';
    
        /** 발송할 Push 메시지 내용 */
        var push_data = {
            // 수신대상
            to: client_token,
            // App에게 전달할 데이터
            data: {
                order: "Accept"
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