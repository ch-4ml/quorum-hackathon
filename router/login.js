var express = require('express');
var router_login = express.Router();
var fs = require('fs');

router_login.get('/', function (req, res) {
    fs.readFile('경로', function() {

    })
});

module.exports = router_login;