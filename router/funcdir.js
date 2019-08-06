var express = require('express');
var router = express.Router();

function section_templateHTML() {
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
    <form method="post" action="/access">
    <input type="submit" id="userCom" name="name" value="법인고객">
    <input type="submit" id="userNor" name="name" value="일반고객"> 
    </form>
</body>
</html>`
    return template;
}

function login_company_templateHTML() {
    var template = `
    <form method="post" action="/login_process_company">
        <p>
            ID
            <input type="text" name="userID" placeholder="login ID">
        </p>
        <p>
            PW
            <input type="password" name="userPW" placeholder="login PW">
        </p>
        <p>
            <button type="submit">submit</button>
        </p>
    </form>`
    return template;
}
function login_normal_templateHTML() {
    var template = `
    <form method="post" action="/login_process_normal">
        <p>
            ID
            <input type="text" name="userID" placeholder="login ID">
        </p>
        <p>
            PW
            <input type="password" name="userPW" placeholder="login PW">
        </p>
        <p>
            <button type="submit">submit</button>
        </p>
    </form>`
    return template;
}

module.exports = router;