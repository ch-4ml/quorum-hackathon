var express = require('express');
var router = express.Router();
var fs = require('fs');
var http = require('http');
var url = require('url');
var router = express.Router();
var mysql = require('mysql');
var myConnection = mysql.createConnection(require('../dbConfig'));

//session 설정
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
    var data = {
        userData: req.session.user,
    }
    console.log(data.userData)
    res.render('index.html', { data: data });
});

router.get('/login', function (req, res) {
    res.render('access_select_login.html');
});

router.post('/access_Selection', function (req, res) {
    if (req.body.name === '법인고객') {
        var distinct_group = 'company';
        var distinct_num = 1;
        const data = {
            dnum: distinct_num,
            dgroup: distinct_group,
        }
        res.render('login.html', { data: data })

    } else if (req.body.name === '일반고객') {
        var distinct_group = 'client';
        var distinct_num = 0;
        const data = {
            dnum: distinct_num,
            dgroup: distinct_group,
        }
        res.render('login.html', { data: data })
    } else {
        console.log('에러');
    }
});

router.post('/login_process', function (req, res) {
    const user = {
        insertedID: req.body.userID,
        insertedPW: req.body.userPW,
        distinct_num: req.body.distinct_num,
        distinct_group: req.body.distinct_group,
    }
    /*session이 없을 경우 */
    var sql = `select userID, userPW from testdb where groups = '${user.distinct_group}'`;
    console.log(sql)
    myConnection.query(sql, function (err, results) {
        if (user.distinct_group === 'company') {
            if (results[0].userID == user.insertedID && results[0].userPW == user.insertedPW) {
                console.log('법인고객 Login');
                req.session.user = {
                    user: user.insertedID,
                    dnum: user.distinct_num,
                    dgrp: user.distinct_group,
                }
                res.redirect('/');
            } else {
                console.log('login 실패');
            }
        } else if (user.distinct_group === 'client') {
            if (results[0].userID == user.insertedID && results[0].userPW == user.insertedPW) {
                console.log('개인고객 Login');
                req.session.user = {
                    user: user.insertedID,
                    dnum: user.distinct_num,
                    dgrp: user.distinct_group,
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
        var distinct_group = 'company';
        var distinct_num = 1;
        const data = {
            dgroup: distinct_group,
            dnum: distinct_num,
        }
        res.render('register.html', { data: data })

    } else if (req.body.name === '일반고객') {
        var distinct_group = 'client';
        var distinct_num = 0;
        const data = {
            dgroup: distinct_group,
            dnum: distinct_num,
        }
        res.render('register.html', { data: data })
    } else {
        //은행 분류 코드
        var distinct_group = 'bank';
        var distinct_num = 2;
        const data = {
            dgroup: distinct_group,
            dnum: distinct_num,
        }
        res.render('register.html', { data: data })
    }
});
router.post('/register_process', function (req, res) {
    console.log(req.body.distinct_num)
    console.log(req.body)
    if (req.body.distinct_num == 1) {
        var userID = req.body.userID;
        var userPW = req.body.userPW;
        var groups = req.body.distinct_group;
        var status = 1;
        var sql = 'insert into testdb (userID, userPW, groups, status) values (?, ?, ?, ?)';
        myConnection.query(sql, [userID, userPW, groups, status], function (err, data) {
            if (err) {
                console.log('Register Err :' + err);
            }

        });
    } else if (req.body.distinct_num == 0) {
        var userID = req.body.userID;
        var userPW = req.body.userPW;
        var groups = req.body.distinct_group;
        var status = 0;
        var sql = 'insert into testdb (userID, userPW, groups, status) values (?, ?, ?, ?)';
        myConnection.query(sql, [userID, userPW, groups, status], function (err, data) {
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
