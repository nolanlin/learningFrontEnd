var a = " abc1-def2 ";
var b = " qwe1-rty2 ";

// 获取长度 .length
console.log("length", a.length); // 11

// 找到指定字符串的位置 String.prototype.indexOf(str:string, start?:number)
console.log("indexOf", a.indexOf("c")); // 3
console.log("indexOf", a.indexOf("c", 4)); // -1
console.log("indexOf", a.indexOf("c", -4)); // 3

// 截取字符串
// String.prototype.substring(start:number, end?:number)
// start < 0: start = 0, end < 0: end = 0
console.log("substring", a.substring(2)); // bc1-def2
console.log("substring", a.substring(2, 4)); // bc

console.log("substring", a.substring(2, -4)); // a      (a.substring(2, 0))
console.log("substring", a.substring(-4, -4)); // ''    (a.substring(0, 0))
console.log("substring", a.substring(-4, 4)); //  abc   (a.substring(0, -4))

// String.prototype.substr(start:number, length?:number)
// start < 0：start = a.length + start
console.log("substr", a.substr(2, 4)); // bc1-

console.log("substr", a.substr(2, -4)); // ''
console.log("substr", a.substr(-4, 4)); // ef2
console.log("substr", a.substr(a.length + -4, 4)); // ef2

// String.prototype.slice(start?:number, end?:number)
// start < 0: start = a.length + start, end < 0: end = a.length + end
console.log("slice", a.slice()); //  abc1-def2
console.log("slice", a.slice(2)); // bc1-def2
console.log("slice", a.slice(2, 4)); // bc

console.log("slice", a.slice(2, -4)); // bc1-d
console.log("slice", a.slice(2, a.length + -4)); // bc1-d

console.log("slice", a.slice(-5, -4)); // d
console.log("slice", a.slice(a.length + -5, a.length + -4)); // d

console.log("slice", a.slice(-4, 4)); // ''
console.log("slice", a.slice(a.length + -4, 4)); // ''
