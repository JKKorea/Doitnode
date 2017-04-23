var express = require('express');
var http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000); // port를 환경변수를 쓰거나 없으면 3000

app.use(function(req, res, next){
    console.log('첫번째 미들웨어 호출됨');
    
    req.user = 'mike';
    
    next(); // 다음 미들웨어가 받아서 처리.
}); // 미들웨어 등록

app.use(function(req, res, next){
    console.log('2번째 미들웨어 호출됨');
    
    //res.send('<h1>서버에서 응답한 결과입니다 : ' + req.user + '</h1>'); 
    
    var person = {name:'소녀시대', age:20};
    //res.send(person);
    
    var personStr = JSON.stringify(person);
//    res.send(personStr);
    res.writeHead(200, {"Content-Type": "application/json; charset=utf8"});
    res.write(personStr);
    res.end();
}); // 미들웨어 등록


var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('익스프레스로 웹 서버를 실행함 : ' + app.get('port'));
});