# this 指针/闭包/作用域 - 波比

## 4 种规则

### 默认绑定

- 直接使用不带任何修饰的函数引用进行调用的。

1. 赋值调用

```js
const obj1 = {
  a: 1,
  fn: function () {
    console.log(this.a);
  },
};
const fn1 = obj1.fn;
fn1();
```

2. setTimeout

```js
setTimeout(obj1.fn, 1000);
```

3. 函数作为参数传递

```js
function run(fn) {
  fn();
}
run(obj1.fn);
```

4. 一般的匿名函数

```js
var name = "The Window";
var obj = {
  name: "My obj",
  getName: function () {
    return function () {
      console.log(this.name);
    };
  },
};
obj.getName()();
```

5. IIFE

### 隐式绑定

- 当函数引用有上下文对象时，隐式绑定规则会把函数调用中的 this 绑定到这个上下文对象。
- 隐式绑定的 `this` 指的是调用堆栈的**上一级**（`.`前面**一**个）

```js
function fn() {
  console.log(this.a);
}

const obj = {
  a: 1,
};

obj.fn = fn;
obj.fn(); // console what ?
```

### 显式绑定

- call(obj, ...args) && apply(obj, args) && bind(obj, ...args)

### new 绑定

- 使用 new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。

1. 创建（或者说构造）一个全新的对象。
2. 这个新对象会被执行 [[原型]] 连接。
3. 这个新对象会绑定到函数调用的 this。
4. 如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象。

### 优先级

- 「new 绑」 > 「显绑」 > 「隐绑」 > 「默认绑定」
