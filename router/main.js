var express = require('express');
var router = express.Router();
var fs = require('fs');
var http = require('http');
var app = express();
var url = require('url');


router.get('/', function (req, res) {
    res.render('index.html');
});

router.get('/login', function (req, res) {
    res.send('login')
});

router.get('/select_item', function (req, res) {
   
})

module.exports = router;
