var a = " abc1-def2 ";
var b = " qwe1-rty2 ";

// 获取：长度 .length
{
  console.log("length", a.length); // 11
}

// 查找：字符串指定位置上的字符
// String.prototype.charAt(pos:number)
{
  console.log("charAt", a.charAt(3)); // c
}

// 查找：指定字符串的位置
// String.prototype.indexOf(str:string, start?:number)
{
  console.log("indexOf", a.indexOf("c")); // 3
  console.log("indexOf", a.indexOf("c", 4)); // -1
  console.log("indexOf", a.indexOf("c", -4)); // 3
}

// 截取：字符串
{
  {
    // String.prototype.substring(start:number, end?:number)
    // start < 0: start = 0, end < 0: end = 0
    console.log("substring", a.substring(2)); // bc1-def2
    console.log("substring", a.substring(2, 4)); // bc

    console.log("substring", a.substring(2, -4)); // a      (a.substring(2, 0))
    console.log("substring", a.substring(-4, -4)); // ''    (a.substring(0, 0))
    console.log("substring", a.substring(-4, 4)); //  abc   (a.substring(0, -4))
  }
  {
    // String.prototype.substr(start:number, length?:number)
    // start < 0：start = a.length + start
    console.log("substr", a.substr(2, 4)); // bc1-

    console.log("substr", a.substr(2, -4)); // ''
    console.log("substr", a.substr(-4, 4)); // ef2
    console.log("substr", a.substr(a.length + -4, 4)); // ef2
  }
  {
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
  }
}

// 转换：大小写
{
  console.log("toUpperCase", a.toUpperCase()); //  ABC1-DEF2
  console.log("toLowerCase", a.toLowerCase()); //  abc1-def2
}

// 去除：字符串前后空格
{
  console.log("trim", a.trim()); // abc1-def2
}

// 连接
{
  console.log("concat", a.concat(b)); //  abc1-def2  qwe1-rty2
}

// 分割：返回数组
{
  console.log("split", a.split("-")); // [ ' abc1', 'def2 ' ]
}

// 替换
{
  // String.prototype.replace(str:string, replaceStr:string)
  console.log("replace", a.replace("abc", "omg")); //  omg1-def2
  // String.prototype.replace(str:string, replacer:function)
  console.log(
    "replace",
    a.replace("abc", (v) => v.toUpperCase())
  ); //  ABC1-def2
}

// 以上方法均不改变原字符串的值，而是返回一个新的字符串
console.log(a); //  abc1-def2

// ###########################################################

// 数组方法借用（非复杂字符Unicode）

// 每个字符之间插入值
{
  console.log("Array.join", Array.prototype.join.call(a, "=")); //  =a=b=c=1=-=d=e=f=2=
}

// 单个字符处理
{
  console.log(
    "Array.map",
    Array.prototype.map
      .call(a, (v) => {
        if (v === "a" || v === "c") return v.toUpperCase();
        else return v.toLowerCase();
      })
      .join("")
  ); //  AbC1-def2
}

// 字符串反转
{
  console.log("split,reverse,join", a.split("").reverse().join("")); //  2fed-1cba
}
