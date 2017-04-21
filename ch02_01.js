console.log('안녕하세요.');

console.log('숫자입니다. %d', 10);
console.log('안녕하세요. %s', 'hi');

var person = {
	name : 'jk',
	age : 26
};

console.log('javascript object. %j', person);

console.dir(person);

console.time('duration_time');

var result = 0;
for (var i = 0; i <10000; i++){
	result += i;
}

console.timeEnd('duration_time');

console.log('file name : %s', __filename);
console.log('path : %s', __dirname);
