// 实现new
function Player(name) {
  this.name = name;
}
function objectCreate() {
  const constructor = [].shift.call(arguments);
  const obj = Object.create(constructor.prototype);
  const resultObj = constructor.apply(obj, arguments);
  return typeof resultObj === "object" ? resultObj : obj;
}
const whitePlayer = objectCreate(Player, "white");
console.log(whitePlayer);

// 练习题
// 1.
function foo() {
  console.log(this.a); // console what
}
var a = 2;
(function () {
  "use strict"; // 迷惑大家的
  foo();
})();

// 2.
var name = "the window";

var object = {
  name: "My Object",
  getName: function () {
    return this.name;
  },
};
object.getName(); // console what ?
object.getName(); // console what ?
(object.getName = object.getName)(); // console what ?
(object.getName, object.getName)(); // console what ?

// 3.
var x = 3;
var obj3 = {
  x: 1,
  getX: function () {
    var x = 5;
    return (function () {
      return this.x;
    })(); // ⚠️
  },
};
console.log(obj3.getX()); // console what?

// 4.
function a(x) {
  this.x = x;
  return this;
}
var x = a(5); // 替换为 let 再试试
var y = a(6); // 替换为 let 再试试 // 再换回 var，但是去掉 y 的情况，再试试

console.log(x.x); // console what ?
console.log(y.x); // console what ?

// 等价于
window.x = 5;
window.x = window;

window.x = 6;
window.y = window;

console.log(x.x); // void 0 其实执行的是 Number(6).x
console.log(y.x); // 6
