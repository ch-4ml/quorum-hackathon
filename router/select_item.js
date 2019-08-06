var express = require('express');
var router = express.Router();
var fs = require('fs');
var http = require('http');
var url = require('url');
var mysql = require('mysql');
var myConnection = mysql.createConnection(require('../dbItem'));
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
    console.log('MySQL Connection Complete_select_item');
});


router.get('/select_item', function (req, res) {
    console.log('Select_item 접속')
    res.render('select_item.html');
});

router.post('/select_process', function(req, res) {
    console.log('Select_process 접속')
    console.log(req.body.item)
    // itemInfo = {
    //     item_a: req.body.item_a,
    //     item_b: req.body.item_b,
    //     item_c: req.body.item_c,
    //     min: req.body.min,
    //     max: req.body.max
    // }
    var sql = `select * from bankdb where value between ${req.body.min} AND ${req.body.max}`;
    console.log(sql);
    myConnection.query(sql, function (err, results) {
        if(err) {
            console.log('bankdb Err' + err);
        }
        console.log(results[0].item)
        res.render('item_list.html', {data:results})
    });
});

module.exports = router;

