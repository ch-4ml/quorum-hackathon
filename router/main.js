var express = require('express');
var router_main = express.Router();
var fs = require('fs');

router_main.get('/', function (req, res) {

    var template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
<p>
<a href="/?id=item">상품</a>
</p>
<p>
<a href="/?id=login">로그인</a>
</p>
</body>
</html>`
    res.end(template);
});

module.exports = router_main;