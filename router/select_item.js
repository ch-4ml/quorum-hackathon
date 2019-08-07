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


router.get('/selected_item', function (req, res) {
    var sql = 'select item from bankdb where status = 0';
    myConnection.query(sql, function (err, results) {
        if (err) {
            console.log('bankdb ' + err);
        }
        data_send = {
            item_name: results,
            item_leng: results.length
        }
        console.log(data_send.item_name)
        res.render('select_item.html', { item_send: data_send })
    });
});

router.post('/select_process', function (req, res) {
    console.log('Select_process 접속')
    console.log(req.body.item)
    var list = "";
    function callSum(req) {
        var i = 0;
        while (i < req.body.item.length) {
            list = list + `item = ` + `"${req.body.item[i]}"`;
            if (i != req.body.item.length - 1) {
                list = list + ` OR `
            }
            i++;
        }
        return list;
    }
    var condition = callSum(req);
    var sql = `SELECT * from bankdb where (val between  ${req.body.min} AND ${req.body.max}) and  (${condition});`;
    myConnection.query(sql, function (err, results) {
        if (err) {
            console.log('bankdb ' + err);
        }
        loan_data = {
            item_data: results,
        }
        res.render('item_list.html', { data: loan_data })
    });

});

router.post('/enroll_item', function (req, res) {
    console.log(req.body)
    console.log(req.body.selected_item_list);
    var json = req.body.selected_item_list;
    var obj = JSON.stringify(json);
    console.log(obj);
    enrolled_item = {
        enrolled_value: req.body.total_item_value,
        enrolled_item: req.body.selected_item_list,
        value_proposal: req.body.proposal
    }
    res.render()
});
module.exports = router;

