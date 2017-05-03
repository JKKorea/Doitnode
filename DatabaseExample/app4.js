var express = require('express')
  , http = require('http')
  , path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static')
  , errorHandler = require('errorhandler');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
var expressSession = require('express-session');
 
// mongoose 모듈 사용
var mongoose = require('mongoose');


var app = express();

// 기본 속성 설정
app.set('port', process.env.PORT || 3000);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));
 
// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));


//===== 데이터베이스 연결 =====//

var UserModel;
var database;
var UserSchema;

function connectDB(){
    var databaseUrl = 'mongodb://localhost:27017/local';
    
    console.log('데이터베이스 연결을 시도합니다.');
    mongoose.Promise = global.Promise;
    
    mongoose.connect(databaseUrl);
    database = mongoose.connection;
    
    database.on('error', console.error.bind(console, 'mongoose 연결 에러.'));

    database.on('open', function(){
        console.log('데이터베이스에 연결됨 : ' + databaseUrl);
        
        UserSchema = mongoose.Schema({
            id: {type:String, required:true, unique:true},
            password: {type:String, required:true},
            name: {type:String, index:'hashed'},
            age: {type:Number, 'default':-1},
            created_at: {type:Date, index:{unique:false}, 'default':Date.now()},
            updated_at: {type:Date, index:{unique:false}, 'default':Date.now()}
        });
        
        console.log('UserSchema 정의함.');

        // 스키마에 static으로 findById 메소드 추가
        UserSchema.static('findById', function(id, callback){
            return this.find({id:id}, callback);
        });
        
        /*
        UserSchema.statics.findById = function(id, callback){
            return this.find({id:id}, callback);
        }
        */
        
        UserSchema.static('findAll', function(callback){
            return this.find({}, callback);
        });
        
        UserModel = mongoose.model('users2', UserSchema);
        console.log('UserModel 정의함.');
    }); // event 등록   

    
    // 연결 끊어졌을 때 5초 후 재연결
	database.on('disconnected', function() {
        console.log('연결이 끊어졌습니다. 5초 후 재연결합니다.');
        setInterval(connectDB, 5000);
    });
    
}

//===== 라우팅 함수 등록 =====//

var router = express.Router();

router.route('/process/login').post(function(req, res){
    console.log('/process/login 라우팅 함수 호출됨.');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log('요청 파라미터 : '+ paramId+', '+ paramPassword);
    
    if (database){ // database와 연결이 되어있음.
        authUser(database, paramId, paramPassword, function(err, docs){
            if (err){
                console.log('에러 발생.');
                res.writeHead(200, {"Content-Type":"text/html; charset=utf8"});
                res.write('<h1>에러 발생</h1>');
                res.end();
                return;
            }
            
            if (docs) {
                console.dir(docs);
                
                res.writeHead(200, {"Content-Type":"text/html; charset=utf8"});
                res.write('<h1>사용자 로그인 성공</h1>');
                res.write('<div><p>사용자 :'+ docs[0].name+ '</p></div>');
                res.write('<br><br><a href="/public/login.html">다시 로그인하기</a>');
                res.end();
            } else {
                console.log('에러 발생.');
                res.writeHead(200, {"Content-Type":"text/html; charset=utf8"});
                res.write('<h1>사용자 데이터 조회 안됨.</h1>');
                res.end();
            }
        });
    } else {
        console.log('에러 발생.');
        res.writeHead(200, {"Content-Type":"text/html; charset=utf8"});
        res.write('<h1>데이터베이스 연결 안됨.</h1>');
        res.end();
    }
});

router.route('/process/adduser').post(function(req, res){
    console.log('/process/adduser 라우팅 함수 호출됨.');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;

    console.log('요청 파라미터 : '+ paramId+', '+ paramPassword+', '+ paramName);
    
    if (database){ // database와 연결이 되어있음.
        addUser(database, paramId, paramPassword, paramName, function(err, result){
            if (err){
                console.log('에러 발생.');
                res.writeHead(200, {"Content-Type":"text/html; charset=utf8"});
                res.write('<h1>에러 발생</h1>');
                res.end();
                return;
            }
            
            if (result) {
                console.dir(result);
                
                res.writeHead(200, {"Content-Type":"text/html; charset=utf8"});
                res.write('<h1>사용자 추가ㅣ 성공</h1>');
                res.write('<div><p>사용자 :'+ paramName+ '</p></div>');
                res.end();
            } else {
                console.log('에러 발생.');
                res.writeHead(200, {"Content-Type":"text/html; charset=utf8"});
                res.write('<h1>사용자 추가 안됨.</h1>');
                res.end();
            }
        })
    } else {
            console.log('에러 발생.');
            res.writeHead(200, {"Content-Type":"text/html; charset=utf8"});
            res.write('<h1>데이터베이스 연결 안됨.</h1>');
            res.end();
    }      
});

router.route('/process/listuser').post(function(req, res){
    console.log('/process/listuser 라우팅 함수 호출됨');
    
    if (database){
        UserModel.findAll(function(err, results){
            if (err){
                console.log('에러 발생.');
                res.writeHead(200, {"Content-Type":"text/html; charset=utf8"});
                res.write('<h1>에러 발생</h1>');
                res.end();
                return;
            }
            
            if (results) {
                console.dir(results);
                
                res.writeHead(200, {"Content-Type":"text/html; charset=utf8"});
                res.write("<h3>사용자 리스트</h3>");
                res.write("<div><ul>");
                
                for( var i = 0; i < results.length; i++){
                    var curId = results[i]._doc.id;
                    var curName = results[i]._doc.name;
                    res.write("    <li>#"+ i + " -> " + curId+ ", "+ curName+ "</li>");
                }
                
                res.write("</ul></div>");
                res.end();
            } else {
                console.log('에러 발생.');
                res.writeHead(200, {"Content-Type":"text/html; charset=utf8"});
                res.write('<h1>조회된 사용자 없음.</h1>');
                res.end();
            }
        });
    } else {
        console.log('에러 발생.');
        res.writeHead(200, {"Content-Type":"text/html; charset=utf8"});
        res.write('<h1>데이터베이스 연결 안됨.</h1>');
        res.end();
    }
});


app.use('/',router);

var authUser = function(db, id, password, callback){
    console.log('authUser 호출됨 : '+ id+', '+ password);
    
    
    UserModel.findById(id, function(err, results){
        if (err){
            callback(err, null);
            return;
        }
        
        console.log('아이디 %s로 검색됨.');
        if (results.length > 0){
            if (results[0]._doc.password === password){
                console.log('비밀번호 일치함.');
                callback(null, results);
            } else {
                console.log('비밀번호 일치하지 않음.');
                callback(null, null);
            }
        } else {
            console.log('아이디 일치하는 사용자 없음.');
            callback(null, null);
        }
    });
};

var addUser = function(db, id, password, name, callback){
    console.log('addUser 호출됨 : ' +id +', '+ password + ', '+name);
    
    var user = new UserModel({"id":id, "password":password, "name":name});
    
    user.save(function(err){
        if(err){
            callback(err, null);
            return;
        }
        
        console.log('사용자 데이터 추가함.');
        callback(null, user);
  });
};


// 404 에러 페이지 처리
var errorHandler = expressErrorHandler({
   static: {
       '404': './public/404.html'
   } 
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('익스프레스로 웹 서버를 실행함 : '+app.get('port'));
    
    connectDB();
});