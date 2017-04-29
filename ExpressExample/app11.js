var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());

var router = express.Router();

router.route('/process/setUserCookie').get(function(req, res){
    console.log('/process/setUserCookie 라우팅 함수 호출됨.');
    
    res.cookie('user', {
        id:'mike',
        name:'소녀시대',
        authorized:true
    });
    
    res.redirect('/process/showCookie');
});

router.route('/process/showCookie').get(function(req, res){
    console.log('/process/showCookie 라우팅 함수 호출됨');
    
    res.send(req.cookies);
});


router.route('/process/login/:name').post(function(req, res){
    console.log('/process/login 라우팅 함수에서 받음.');
    
    var paramName = req.params.name;
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    
    res.writeHead(200, {"Content-Type":"text/html; charset=utf8"});
    res.write("<h1>서버에서 로그인 응답</h1>");
    res.write("<div><p>" + paramName +"</p></div>");
    res.write("<div><p>" + paramId+"</p></div>");
    res.write("<div><p>" + paramPassword+"</p></div>");
    res.end();
});

app.use('/',router);
app.all('*', function(req, res){
    res.status(404).se nd('<h1>요청하신 페이지는 없어요.</h1>');
});

app.use(function(req, res, next){
    console.log('첫번째 미들웨어 호출됨');
    
    var userAgent = req.header('User-Agent');
    var paramId = req.body.id || req.query.id;
    
    res.send('<h3>서버에서 응답. User-Agent -> '+ userAgent+'</h3><h3>Param Name->'+paramId +'</h3>');
});

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('익스프레스로 웹 서버를 실행함 : '+app.get('port'));
});