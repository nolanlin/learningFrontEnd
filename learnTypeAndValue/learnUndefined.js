// 从未赋值
var a;
console.log(a); // undefined
console.log(void 0); // undefined

// ES6, 如果函数参数被省略或者值为undefined，则取该参数的默认值：
function func(a = 1, b = a + 2) {
  console.log(a, b, arguments);
}
func(); // 1 3 [Arguments] {}
func(undefined); // 1 3 [Arguments] { '0': undefined }
func(2); // 2 4 [Arguments] { '0': 2 }
func(void 0, 2); // 1 2 [Arguments] { '0': undefined, '1': 2 }
func(null); // null 2 [Arguments] { '0': null }  *(null+2会隐式强制转换为0)
