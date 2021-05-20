var a = 523.1553;

// 保留小数
{
  console.log("toFixed", a.toFixed(2)); // 523.16
  console.log("toFixed", typeof a.toFixed(2)); // string
}

// 保留有效位数
{
  console.log("toPrecision", a.toPrecision(5)); // 523.16
  console.log("toPrecision", typeof a.toPrecision(5)); // string
}

// 判断是否整数
{
  console.log("Number.isInteger", Number.isInteger(a)); // false
  console.log("Number.isInteger", Number.isInteger(a.toPrecision(3))); // false
  console.log("Number.isInteger", Number.isInteger(a.toFixed(0))); // false
  console.log("Number.isInteger", Number.isInteger(523)); // true
  if (!Number.isInteger) {
    Number.isInteger = function (num) {
      return typeof num == "number" && num % 1 == 0;
    };
  }
}
