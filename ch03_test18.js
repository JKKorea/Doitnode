function Person(name, age){
    this.name = name;
    this.age = age;
}

Person.prototype.walk = function(speed){
    console.log(speed + 'km 속도로 걸어갑니다.');
};

var person3 = new Person('소녀시대',20);
person3.walk(10);