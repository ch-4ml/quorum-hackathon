var express = require('express');
var app = express();

// view 경로 설정
app.set('views', __dirname + '/views');

// 화면 engine을 ejs로 설정
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// 기본 path를 /public으로 설정(css, javascript 등의 파일 사용을 위해)
app.use(express.static(__dirname + '/public'));

var mainRouter = require('./router/main');
app.use(mainRouter);



app.listen(3000, function() {
    console.log('서버 가동');
});