var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs');
var http = require('http');
var url = require('url');
var myConnection = mysql.createConnection(require('../dbConfig'));

myConnection.connect(function (err) {
    if (err) {
        console.log("DB접속 " + err);
        return;
    }
    console.log('MySQL Connection Complete');
});

function access_Selection() {
    var template = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <form method="post" action="/access_Selection">
    <input type="submit" id="userCom" name="name" value="법인고객">
    <input type="submit" id="userNor" name="name" value="일반고객"> 
    </form>
</body>
</html>`
    return template;
}

function login_templateHTML(distinct_num) {
    var template = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <form method="post" action="/login_process">
        <p>
            ID
            <input type="text" name="userID" placeholder="login ID">
        </p>
        <p>
            PW
            <input type="password" name="userPW" placeholder="login PW">
        </p>
        <p>
            <input type="hidden" name="distinct_num" value="${distinct_num}">
        </p>
        <p>
            <button type="submit">submit</button>
        </p>
    </form>
    </body>
    </html>`
    return template;
}

function register_Selection() {
    var template = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <form method="post" action="/register_Selection">
    <input type="submit" id="userCom" name="name" value="법인고객">
    <input type="submit" id="userNor" name="name" value="일반고객"> 
    </form>
</body>
</html>`
    return template;
}

function register_templateHTML(distinct_num) {
    var template =
        `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <form method="post" action="/register_process">
        ID <input type="text" name="userID" id="userID">
        PW <input type="password" name ="userPW" id="userPW">
        <input type="hidden" name="distinct_num" value="${distinct_num}">
        <input type="submit" value="submit">
    </form>
</body>
</html>`
    return template;
}

router.get('/', function (req, res) {
    res.render('index.html');
});

router.get('/login', function (req, res) {
    var template = access_Selection();
    res.end(template);
});

router.post('/access_Selection', function (req, res) {
    if (req.body.name === '법인고객') {
        var distinct_num = 1;
        var template = login_templateHTML(distinct_num);
    } else if (req.body.name === '일반고객') {
        var distinct_num = 0;
        var template = login_templateHTML(distinct_num);
    } else {
        console.log('에러');
    }
    console.log(template);
    res.end(template);
});
router.post('/login_process', function (req, res) {
    console.log(req.body);
    var insertedID = req.body.userID;
    var insertedPW = req.body.userPW;
    var distinct_num = req.body.distinct_num;
    var sql = `select userID, userPW from testdb where status = ${distinct_num}`;
    if (distinct_num == 1) {
        myConnection.query(sql, function (err, results) {
            console.log(results[0]);
            if (err) {
                console.log('MySQL Err 1: ' + err);
            }
            if (results[0].userID == insertedID) {
                console.log('ID확인');
                if (results[0].userPW == insertedPW) {
                    console.log('환영합니다. 기업고객님');
                    res.redirect('/')
                } else {
                    console.log('비밀번호를 확인해주세요.')
                    res.redirect('/')
                }
            } else {
                console.log('ID를 확인해주세요.');
            }
        })
    } else if (distinct_num == 0) {
        myConnection.query(sql, function (err, results) {
            console.log(results);
            if (err) {
                console.log('MySQL Err 1: ' + err);
            }
            if (results[0].userID == insertedID) {
                console.log('ID확인');
                if (results[0].userPW == insertedPW) {
                    console.log('환영합니다. 개인고객님');
                    res.redirect('/')
                } else {
                    console.log('비밀번호를 확인해주세요.')
                    res.redirect('/')
                }
            } else {
                console.log('ID를 확인해주세요.');
            }
        })
    } else {
        console.log('이도저도 아닌 값');
    }
});

router.get('/register', function (req, res) {
    var template = register_Selection();
    res.end(template);
});
router.post('/register_Selection', function (req, res) {
    if (req.body.name === '법인고객') {
        var distinct_num = 1;
        var template = register_templateHTML(distinct_num);

    } else if (req.body.name === '일반고객') {
        var distinct_num = 0;
        var template = register_templateHTML(distinct_num);

    } else {
        console.log('????');
    }
    console.log(req.body.name);
    res.end(template);
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

router.get('/select_item', function (req, res) {
    res.render('select_item.html');
});


module.exports = router;
