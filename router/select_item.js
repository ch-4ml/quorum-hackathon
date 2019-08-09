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
// const loanData;

// function setLoanData(data) {
//     loanData = data;
// }

// function getLoanData() {
//     return loanData;
// }

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
//function
var unique_array1 = [];
var unique_array2 = [];
function uniqueArray1(results) {
    for (i = 0; i < results.length; i++) {

        unique_array1[i] = results[i].investor

    }
    return unique_array1;
}
function uniqueArray2(results) {
    for (i = 0; i < results.length; i++) {

        unique_array2[i] = results[i].proposal

    }
    return unique_array2;
}
function fn_jsonArray1(investor_array1) {
    var keyArray = new Array();
    var investor = new Object();
    for (i = 0; i < investor_array1.length; i++) {
        if (investor_array1[i] != null && investor_array1[i] != undefined && investor_array1[i] != "") {
            keyArray.push({ investor: investor_array1[i] });
        }
    }
    return keyArray;
}
function fn_jsonArray2(investor_array2) {
    var keyArray = new Array();
    var investor = new Object();
    for (i = 0; i < investor_array2.length; i++) {
        if (investor_array2[i] != null && investor_array2[i] != undefined && investor_array2[i] != "") {
            console.log(investor_array2[i])
            keyArray.push({ proposal: investor_array2[i] });
        }
    }
    return keyArray;
}

// var investedJson = fn_jsonArray();

// function fn_jsonMake() {
//     var keyArray = new Array();
//     var investor = new Object();
//     for (i = 0; i < investedJson.length; i++) {
//         for (j = 0; j < results.length; j++) {
//             // if (results[i] != null && results[i] != undefined && results[i] != "") {}
//             if (investedJson[i].investor == results[j].investor) {
//                 console.log(investedJson[0].investor)
//                 console.log(results[2].investor)
//                 keyArray.add({ item: results[j].item });



//             }
//         }
//     }
//     console.log(keyArray)
//     return keyArray;
// }
// var investJson = fn_jsonMake();
// console.log(investJson)


router.get('/selected_item', function (req, res) {
    console.log(req.body)
    var sql = 'select item, category from bankdb where status = 0';
    myConnection.query(sql, function (err, results) {
        if (err) {
            console.log('bankdb ' + err);
        }
        data_send = {
            item_name: results,
            item_leng: results.length,
            userData: req.session.user,
        }
        res.render('select_item.html', { data: data_send })
    });
});

router.post('/select_process', function (req, res) {
    console.log(req.body)
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
    var sql = `SELECT * from bankdb where val between ${req.body.min} AND ${req.body.max} AND (${condition})  AND (status = 0)`;
    console.log(sql) 
    myConnection.query(sql, function (err, results) {
        if (err) {
            console.log('bankdb ' + err);
        }
        loan_data = {
            item_data: results,
            userData: req.session.user,
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
        var list = ""
        var i = 0;
        while (i < enrolled_all.enrolled_item.length) {
            list = list + `item = ` + `"${enrolled_all.enrolled_item[i].item}"`;
            if (i != enrolled_all.enrolled_item.length - 1) {
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

router.get('/item_proposal', function (req, res) {
    var sql = `SELECT investor, proposal FROM bankdb GROUP BY investor, proposal`; 
    myConnection.query(sql, function(err, results) {
        
    })


    // var sql_2 = `SELECT item, val, category,investor, proposal FROM bankdb WHERE status = 1`;
    // myConnection.query(sql_2, function (err, results) {
    //     if (err) {
    //         console.log('bankdb_investor load ' + err)
    //     }
    //     // 중복 투자자 제거 함수
    //     var unique_index = uniqueArray1(results);
    //     var investor_array1 = unique_index.filter(function (value, index, self) {
    //         return self.indexOf(value) === index;
    //     });
    //     var unique_index = uniqueArray2(results);
    //     var investor_array2 = unique_index.filter(function (value, index, self) {
    //         return self.indexOf(value) === index;
    //     });
    //     var investedJson = fn_jsonArray1(investor_array1);
    //     var investedPro = fn_jsonArray2(investor_array2);
    //     build_item = {
    //         item_data: results,
    //         investor: investedJson,
    //         proposal: investedPro,
    //         userData: req.session.user,
    //     }
    //     res.render('item_proposal.html', { data: build_item });
    });
});

router.post('/build_item', function(req, res) {
    console.log(req.body)
    res.send();
})
module.exports = router;