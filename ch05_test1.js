var http = require('http');

var server = http.createServer();
console.log(server);

var host = 'localhost';
var port = 3000;
server.listen(port, host, '50000', function(){
    console.log('웹서버가 실행되었습니다 -> ' + host + ':' + port);
});