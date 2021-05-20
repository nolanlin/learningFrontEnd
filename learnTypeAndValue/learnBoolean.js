// 假值 - 布尔强制类型转换均为false
var a = undefined;
var b = null;
var c = +0;
-0;
var d = NaN;
var e = "";
false;

// Boolean 隐式强制类型转换 - 5种

// if 语句
if (!a) {
  console.log(!a); // true
}

// for语句的第二个表达式
for (let i = 0; i < 1 && !b; i++) {
  console.log(!b); // true
}

// while(..), do..while(..)
while (!c) {
  console.log(!c); // true
  break;
}

// ?:
console.log(!d ? true : false); // true

// || && 左边的操作数
console.log(!e && true); // true
