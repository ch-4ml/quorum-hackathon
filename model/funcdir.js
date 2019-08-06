var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var myConnection = mysql.createConnection(require('../dbConfig'));

myConnection.connect(function (err) {
    if (err) {
        console.log("DB접속 " + err);
        return;
    }
    console.log('MySQL Connection Complete');
});

// class Model_func {
//     callSQL(user) {
//         var sql = `select userID, userPW from testdb where status = ${user.distinct_num}`;
// //         return new Promise((resolve, reject) => {
// //             myConnection.promise().query(sql, [userID, userPW]).then(results => {
// //                 resolve(results);
// //             }).catch(err => {
// //                 reject(err);
// //             });
// //         });
// //     }
// // }
    //     myConnection.query(sql, function (err, results) {
    //     if (user.distinct_num == 1) {
    //         myConnection.query(sql, function (err, results) {
    //             console.log(results[0]);
    //             if (err) {
    //                 console.log('MySQL Err 1: ' + err);
    //             }
    //             if (results[0].userID == user.insertedID) {
    //                 console.log('ID확인');
    //                 if (results[0].userPW == user.insertedPW) {
    //                     console.log('환영합니다. 기업고객님');

    //                 } else {
    //                     console.log('비밀번호를 확인해주세요.')

    //                 }
    //             } else {
    //                 console.log('ID를 확인해주세요.');
    //             }
    //         })
    //     } else if (user.distinct_num == 0) {
    //         myConnection.query(sql, function (err, results) {
    //             console.log(results);
    //             if (err) {
    //                 console.log('MySQL Err 1: ' + err);
    //             }
    //             if (results[0].userID == user.insertedID) {
    //                 console.log('ID확인');
    //                 if (results[0].userPW == user.insertedPW) {
    //                     console.log('환영합니다. 개인고객님');
    //                     res.redirect('/')
    //                 } else {
    //                     console.log('비밀번호를 확인해주세요.')
    //                     res.redirect('/')
    //                 }
    //             } else {
    //                 console.log('ID를 확인해주세요.');
    //             }
    //         })
    //     } else {
    //         console.log('이도저도 아닌 값');
    //     }
    // }
// }
// function callSQL(distinct_num) {
//     var sql = `select userID, userPW from testdb where status = ${distinct_num}`;
//     if (distinct_num == 1) {
//         myConnection.query(sql, function (err, results) {
//             console.log(results[0]);
//             if (err) {
//                 console.log('MySQL Err 1: ' + err);
//             }
//             if (results[0].userID == insertedID) {
//                 console.log('ID확인');
//                 if (results[0].userPW == insertedPW) {
//                     console.log('환영합니다. 기업고객님');
//                     res.redirect('/')
//                 } else {
//                     console.log('비밀번호를 확인해주세요.')
//                     res.redirect('/')
//                 }
//             } else {
//                 console.log('ID를 확인해주세요.');
//             }
//         })
//     } else if (distinct_num == 0) {
//         myConnection.query(sql, function (err, results) {
//             console.log(results);
//             if (err) {
//                 console.log('MySQL Err 1: ' + err);
//             }
//             if (results[0].userID == insertedID) {
//                 console.log('ID확인');
//                 if (results[0].userPW == insertedPW) {
//                     console.log('환영합니다. 개인고객님');
//                     res.redirect('/')
//                 } else {
//                     console.log('비밀번호를 확인해주세요.')
//                     res.redirect('/')
//                 }
//             } else {
//                 console.log('ID를 확인해주세요.');
//             }
//         })
//     } else {
//         console.log('이도저도 아닌 값');
//     }
// }

module.exports = new Model_func;