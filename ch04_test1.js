var url = require('url');

var urlStr = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=pop';

var curUrl = url.parse(urlStr);
console.dir(curUrl);

console.log('query ->' + curUrl.query);

var curStr = url.format(curUrl);
console.log('url ->' + curStr);

var querystring = require('querystring');
var params = querystring.parse(curUrl.query);
console.log('검색어 : ' + params.query);
