var express = require('express');
var app = express();

var mainRouter = require('./router/main');
app.use(mainRouter);



app.listen(3000, function() {
    console.log('서버 가동');
});