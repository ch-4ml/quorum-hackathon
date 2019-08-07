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
        res.render('select_item.html', { item_send: data_send })
    });
});

router.post('/select_process', function (req, res) {
    console.log('Select_process 접속')
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
    console.log('bankdb변경 & company db로 전달')
    console.log(req.session.user.user);
    var retrieved_data = JSON.parse(req.body.selected_item_list);
    enrolled_all = {
        enrolled_item: retrieved_data,
        enrolled_value: req.body.total_item_value,
        value_proposal: req.body.proposal,
        investor: req.session.user.user
    }
    function callSum(enrolled_all) {
        var list=""
        var i = 0;
        while (i < enrolled_all.enrolled_item.length) {
            list = list + `item = ` + `"${enrolled_all.enrolled_item[i].item}"`;
            if (i != enrolled_all.enrolled_item.length-1) {
                list = list + ` OR `
            }
            i++;
        }
        return list;
    }
    var condition = callSum(enrolled_all);
    var sql = `UPDATE bankdb SET status = 1, investor = "${enrolled_all.investor}", proposal = ${enrolled_all.value_proposal} where ${condition}`;
    console.log(sql);
    myConnection.query(sql, function (err, results) {
        if (err) {
            console.log('bankdb update ' + err);
        }
        console.log(results);
    });

    res.redirect('/')
});

router.get('/item_proposal', function(req, res) {
    var sql = `SELECT item, val, category, proposal FROM bankdb WHERE status = 1 AND investor = "kshyeon123"`;
    myConnection.query(sql, function(err, results) {
         if(err) {
            console.log('bankdb_investor load ' + err)
        }
        build_item = {
            item_data:results,
        }
        console.log(build_item.item_data)
        res.render('company_index.html', {data:build_item});
    });
});
module.exports = router;

