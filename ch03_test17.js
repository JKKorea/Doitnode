function add(a, b, callback){
    var result = a + b;
    callback(result);

    var count = 0; // Clojure
    var history = function(){
        count++;
        return count + ' : ' + a + '+' + b+'='+result;  
    };
    return history;
}

var add_history = add(20, 10, function(result){
   console.log('더하기 결과 : ' + result); 
});

console.log('add_history의 자료형 : ' + typeof(add_history));

console.log('결과값으로 받은 함수 실행: ' + add_history());
console.log('결과값으로 받은 함수 실행: ' + add_history());
console.log('결과값으로 받은 함수 실행: ' + add_history());