var express = require('express');
var router = express.Router();
var fs = require('fs');
var http = require('http');
var url = require('url');
var router = express.Router();
var mysql = require('mysql');
var myConnection = mysql.createConnection(require('../dbConfig'));
// var callFunc = require('../model/funcdir.js');


//session 설정
// app.use(session({secret: 'ssshhhhh'}));
const session = require('express-session');
const FileStore = require('session-file-store')(session);

router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
}));

myConnection.connect(function (err) {
    if (err) {
        console.log("DB접속 " + err);
        return;
    }
    console.log('MySQL Connection Complete_main');
});

router.get('/', function (req, res) {
    //로그인 상태 확인
    var loggined;
    if (req.session.user) {
        data = {
            loggined: true,
        }
    } else {
        data = {
            loggined: false,
        }
    }
    console.log(req.session.user);
    res.render('index.html', { data: data });
    // res.render('index.html');
});

router.get('/login', function (req, res) {
    res.render('access_select_login.html');
});

router.post('/access_Selection', function (req, res) {
    if (req.body.name === '법인고객') {
        var distinct_num = 1;
        const data = {
            dnum: distinct_num
        }
        res.render('login.html', { data: data })

    } else if (req.body.name === '일반고객') {
        var distinct_num = 0;
        const data = {
            dnum: distinct_num
        }
        res.render('login.html', { data: data })
    } else {
        console.log('에러');
    }
});

router.post('/login_process', function (req, res) {
    console.log(req.body);
    //session이 있을 경우 index.html
    const user = {
        insertedID: req.body.userID,
        insertedPW: req.body.userPW,
        distinct_num: req.body.distinct_num,
    }
    /*session이 없을 경우 */
    var sql = `select userID, userPW from testdb where status = ${user.distinct_num}`;
    myConnection.query(sql, function (err, results) {
        if (user.distinct_num == 1) {
            if (results[0].userID == user.insertedID && results[0].userPW == user.insertedPW) {
                console.log('법인고객 Login');
                req.session.user = {
                    user: user.insertedID,
                }
                res.redirect('/');
            } else {
                console.log('login 실패');
            }
        } else if (user.distinct_num == 0) {
            if (results[0].userID == user.insertedID && results[0].userPW == user.insertedPW) {
                console.log('개인고객 Login');
                req.session.user = {
                    user: user.insertedID,
                }
                res.redirect('/');
            } else {
                console.log('login 실패');
            }
        } else {
            console.log("????");
        }
    });
});
//Test 해볼 것
//     callFunc.callSQL(user).then(result => {
//         console.log('result: ', result[0][0]);
//         if(result[0][0] != undefined) {
//             console.log('Already Loggined');
//             res.redirect('/index.html');
//         } else {
//             req.session.user = {
//                 user: result[0][0].insertedID,
//             }
//         }
//         res.render('/index.html', {data:data} )
//     });
// });
router.get('/logout', function (req, res) {
    if (req.session.user) {
        req.session.destroy(err => {
            console.log('세션 삭제 실패: ', err);
            return;
        });
        console.log('세션 삭제 성공');
        res.redirect('/');
    }
})

router.get('/register', function (req, res) {
    res.render('access_select_register.html');
});
router.post('/register_Selection', function (req, res) {
    console.log(req.body);
    if (req.body.name === '법인고객') {
        var distinct_num = 1;
        const data = {
            dnum: distinct_num,
        }
        res.render('register.html', { data: data })

    } else if (req.body.name === '일반고객') {
        var distinct_num = 0;
        const data = {
            dnum: distinct_num,
        }
        res.render('register.html', { data: data })
    } else {
        console.log('????');
    }
});
router.post('/register_process', function (req, res) {
    console.log(req.body.distinct_num)
    if (req.body.distinct_num == 1) {
        var userID = req.body.userID;
        var userPW = req.body.userPW;
        var status = 1;
        var sql = 'insert into testdb (userID, userPW, status) values (?, ?, ?)';
        myConnection.query(sql, [userID, userPW, status], function (err, data) {
            if (err) {
                console.log('Register Err :' + err);
            }

        });
    } else if (req.body.distinct_num == 0) {
        var userID = req.body.userID;
        var userPW = req.body.userPW;
        var status = 0;
        var sql = 'insert into testdb (userID, userPW, status) values (?, ?, ?)';
        myConnection.query(sql, [userID, userPW, status], function (err, data) {
            if (err) {
                console.log('Register Err :' + err);
            }

        });
    } else {
        console.log('Register Err ---');
    }
    res.redirect('/');
});
module.exports = router;
