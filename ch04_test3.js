process.on('tick', function(count){  // 이벤트 등록
    console.log('tick 이벤트 발생 : ' + count);
});

setTimeout(function(){
    console.log('2초 후에 실행되었음');
    
    process.emit('tick','2'); // 이벤트 발생
},2000);

console.log('2초 후에 실행될 것임.');