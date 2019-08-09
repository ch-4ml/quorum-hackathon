var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var myConnection = mysql.createConnection(require('../dbItem'));
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

//은행에 등록된 채권 조건으로 조회
router.get('/selected_item', function (req, res) {
    var sql = 'select id, item, category, val from bankdb where status = 1';
    myConnection.query(sql, function (err, results) {
        if (err) {
            console.log('bankdb ' + err);
        }
        var data = {
            bonds: results,
            userData: req.session.user
        }
        res.render('select_item.html', { data: data });
    });
});
//조건에 부합하는 채권 로드
router.post('/select_process', function (req, res) {
    console.log(req.body.min)
    var stmt = "";
    const id = req.body.item;
    const min = parseInt(req.body.min);
    const max = parseInt(req.body.max);
    for (i = 0; i < req.body.item.length; i++) {
        stmt = stmt + `id = ${id[i]}`;
        if (i < req.body.item.length - 1) stmt = stmt + " OR ";
    }
    var sql = `select id, item, category, val from bankdb where (val between ${min} AND ${max}) AND (` + stmt + ')';
    console.log(sql);
    myConnection.query(sql, function (err, results) {
        if (err) {
            console.log('bankdb ' + err);
        }
        data = {
            bonds: results,
            userData: req.session.user
        }
        res.render('item_list.html', { data: data })
    });

});
//투자자의 채권 구매 신청
router.post('/sell_item', function (req, res) {
    console.log(req.body)
    var stmt = "";
    const id = req.body.item;
    for (i = 0; i < req.body.item.length; i++) {
        stmt = stmt + `id = ${id[i]}`;
        if (i < req.body.item.length - 1) stmt = stmt + " OR ";
    }
    var sql = `UPDATE bankdb SET status = 1, investor = "${req.session.user.id}", proposal = ${req.body.proposal} where ${stmt}`;
    myConnection.query(sql, function (err, results) {
        if (err) {
            console.log('bankdb update ' + err);
        }
        console.log(results);
    });
    res.redirect('/');
});

//수정
router.get('/item_proposal', function (req, res) {
    var sql_1 = `SELECT investor, proposal FROM bankdb WHERE status=2 GROUP BY investor, proposal`;
    myConnection.query(sql_1, function (err, results_1) {
        if (err) {

        }
        // 수정
        var sql_2 = `SELECT id, item, val, category, investor, proposal FROM bankdb WHERE status = 2`;
        myConnection.query(sql_2, function (err, results_2) {
            if (err) {
                console.log('bankdb_investor load ' + err)
            }
            data = {
                investData: results_1,
                loanData: results_2,
                userData: req.session.user
            };

            res.render('item_proposal.html', { data: data })
        });
    });
});
//매입 기관의 채권 구매 신청
router.post('/build_item', function (req, res) {

    var stmt = "";
    const id = req.body.loanedData;
    for (i = 0; i < req.body.loanedData.length; i++) {
        stmt = stmt + `id = ${id[i]}`;
        if (i < req.body.loanedData.length - 1) stmt = stmt + " OR ";
    }
    var sql = `UPDATE bankdb SET status = 3, requestor = ${req.session.user.id} where ${stmt}`
    myConnection.query(sql, function (err, results) {
        if (err) {
            console.log('item unselled ' + err);
        }
        res.redirect('/');
    });
});

//은행의 채권 등록
router.get('/item_enroll', function (req, res) {
    var sql = `SELECT * FROM bankdb WHERE status=0`;
    myConnection.query(sql, function (err, results) {
        if (err) {
            console.log('bankdb 전체 Data Load 실패');
        }
        data = {
            bonds: results,
            userData: req.session.user,
        }
        res.render('all_item.html', { data: data });
    });
});
//은행의 채권 등록
router.post('/show_item', function (req, res) {
    console.log(req.body.item)
    var stmt = "";
    const id = req.body.item;
    for (i = 0; i < req.body.item.length; i++) {
        stmt = stmt + `id = ${id[i]}`;
        if (i < req.body.item.length - 1) stmt = stmt + " OR ";
    }
    var sql = `UPDATE bankdb SET status = 1 where ${stmt}`
    myConnection.query(sql, function (err, results) {
        if (err) {
            console.log('item unselled ' + err);
        }
        res.redirect('/');
    });
    console.log('채권 블록체인 등록')
});
//채권 판매 허가
router.get('/sell_confirm', function(req, res) {
    var sql = `SELECT * FROM bankdb WHERE status = 3`;
    myConnection.query(sql, function(err, results) {
        if(err) {
            console.log('매입기관 허가 절차 Err')
        }
        data ={
            bonds:results,
            userData:req.session.user
        }
        res.render('confirm.html', {data:data});
    });
});

router.post('/confirm_complete', function(req, res) {
    console.log(req.body)
    var stmt = "";
    const id = req.body.item;
    for (i = 0; i < req.body.item.length; i++) {
        stmt = stmt + `id = ${id[i]}`;
        if (i < req.body.item.length - 1) stmt = stmt + " OR ";
    }
    var sql = `UPDATE bankdb SET status = 4 where ${stmt}`
    myConnection.query(sql, function (err, results) {
        if (err) {
            console.log('confirmation_err ' + err);
        }
        res.redirect('/');
    });
});
//매입기관의 채권-> 투자자 판매
router.get('/item_sell_to_investor', function(req, res) {
    var sql = `SELECT id, item, category, val, proposal, investor, creditor FROM bankdb WHERE status = 4`;
    myConnection.query(sql, function(err, results) {
        if(err) {
            console.log('Data from bank to company Err');
        }
        data = {
            bonds:results,
            userData:req.session.user
        }
        res.render('sell_to_client.html', {data:data})
    });
});

router.post('/confirm', function(req, res) {
    console.log(req.body)
    var stmt = "";
    const id = req.body.item;
    for (i = 0; i < req.body.item.length; i++) {
        stmt = stmt + `id = ${id[i]}`;
        if (i < req.body.item.length - 1) stmt = stmt + " OR ";
    }
    var sql = `UPDATE bankdb SET status = 5, com_proposal= ${req.body.com_proposal} where id = ${req.body.item}`;
    console.log(sql)
    myConnection.query(sql, function(err, results) {
        if(err) {
            console.log('매입기관에서 투자자 채권 판매 Err');
        }
        res.redirect('/');
    });
});

router.get('/contract', function(req, res) {
    var sql = `SELECT * FROM bankdb WHERE status = 5`;
    myConnection.query(sql, function(err, results) {
        if(err) {
            console.log('매입 확인 load 불가')
        }
        data = {
            bonds: results,
            userData: req.session.user
        }
        res.render('contract.html');
    });
});
// router.post('/complete', function(req, res) {
//     var sql = `UPDATE bankdb SET status = 6 where id = `
// })
module.exports = router;