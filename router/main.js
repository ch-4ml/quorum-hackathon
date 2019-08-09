var express = require('express');
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
    res.render('login.html');
});

router.post('/login_process', function (req, res) {
    const user = {
        insertedID: req.body.userID,
        insertedPW: req.body.userPW
    };
    
    var sql = `select * from testdb where userID = '${user.insertedID}' and userPW = '${user.insertedPW}'`;
    myConnection.query(sql, function (err, results) {
        if (results) {
            req.session.user = {
                user: results[0].userID,
                id: results[0].id,
                dnum: results[0].status
            };
            res.redirect('/');
        } else {
            console.log("로그인 실패");
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
    var data;
    var distinct_num;
    if (req.body.name === '법인고객') {
        distinct_num = 1;
        data = { dnum: distinct_num };
    } else if (req.body.name === '일반고객') {
        distinct_num = 2;
        data = { dnum: distinct_num };
    } else { // 은행
        distinct_num = 0;
        data = { dnum: distinct_num };
    }
    res.render('register.html', { data: data })
});

router.post('/register_process', function (req, res) {
    console.log(req.body.distinct_num)
    var userID = req.body.userID;
    var userPW = req.body.userPW;
    var status = req.body.distinct_num;
    var sql = 'insert into testdb (userID, userPW, status) values (?, ?, ?)';
    myConnection.query(sql, [userID, userPW, status], function (err, data) {
        if (err) {
            console.log('Register Err :' + err);
        }
    });
    res.redirect('/');
});
module.exports = router;
