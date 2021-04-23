# Promise-路白

## 课程目标

1. 掌握 PromiseA+规范并实现 Promise
2. 掌握 Generator
3. 掌握 async await

## 知识要点

### Promise

[Promises/A+规范](https://promisesaplus.com/)

#### 术语

1. promise 是对象或函数
2. thenable 定义了 then 方法
3. value 状态 fulfilled 时的值 _any legal JavaScript value_
4. reason 状态 rejected 时的值
5. exception throw 异常值

#### 规范

##### 状态

1. 三个状态：pending, fulfilled, rejected
2. 状态流转（**fulfilled,rejected 为最终态，不可变**）：

- pending -> resolve(value) -> fulfilled
- pending -> reject(reason) -> rejected

##### then 方法

`promise.then(onFulfilled, onRejected)`

1. onFulfilled, onRejected 忽略非函数类型（第 6 点继续解释）
2. 当且仅当 promise 变成 fulfilled 时，才可调用 onFulfilled，value 是参数，且 onFulfilled 仅可被调用 1 次
3. 当且仅当 promise 变成 rejected 时，才可调用 onRejected，reason 是参数，且 onRejected 仅可被调用 1 次
4. onFulfilled, onRejected 应当是微任务（queueMicrotask）
   > _onFulfilled or onRejected must not be called until the execution context stack contains only platform code_
5. then 可被多次调用

- 所有 onFulfilled, onRejected 回调按照 then 的注册顺序依次执行
  > _If/when promise is fulfilled, all respective onFulfilled callbacks must execute in the order of their originating calls to then._ > _If/when promise is rejected, all respective onRejected callbacks must execute in the order of their originating calls to then._

6. then 必须返回 promise，以下简称为 promise2
   > `promise2 = promise1.then(onFulfilled, onRejected);`

- onFulfilled, onRejected 正常返回 x，执行*the Promise Resolution Procedure*这段处理逻辑（也就是，有正常的 return）
  > _If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x)_
- onFulfilled, onRejected 抛异常，则 promise2 的状态是 rejected 且带有 reason
- onFulfilled 非函数且 promise1 状态是 fulfilled，则 promise2 的状态是 fulfilled 带有 promise1 的 value
- onRejected 非函数且 promise1 状态是 rejected，则 promise2 的状态是 rejected 带有 promise1 的 reason

##### The Promise Resolution Procedure

`[[Resolve]](promise2, x)`

> _The promise resolution procedure is an abstract operation taking as input a promise and a value, which we denote as [[Resolve]](promise, x)_

1. 若 promise2 和 x 相等，则 promise2 为 rejected，reason 是 TypeError
2. 若 x 是 promise，那就得看此时 x 的状态：

- x 是 pending，则 promise2 必须保持 pending 直到 x 是 fulfilled 或 rejected
- x 是 fulfilled，则 fulfill promise2 with the same value
- x 是 rejected，则 reject promise2 with the same reason

3. 若 x 是对象或函数：

- Let then be x.then
- 若 x.then 抛出异常 e，那么 reject promise with e as the reason
- 若 then 是函数，那么 then.call(x, resolvePromiseFn, rejectPromiseFn)，相当于 x.then(resolvePromiseFn, rejectPromiseFn)，有以下情况：
  > _If then is a function, call it with x as this, first argument resolvePromise, and second argument rejectPromise_
- 3.1. 若 resolvePromise 被唤起，入参是 value y，那么运行[[Resolve]](promise, y)
  > _If/when resolvePromise is called with a value y, run [[Resolve]](promise, y)_
- 3.2. 若 rejectPromise 被唤起，入参是 reason r，那么 reject promise with r
  > _If/when rejectPromise is called with a reason r, reject promise with r_
- 3.3. 若 resolvePromise 和 rejectPromise 都被唤起，或多次用同个参数唤起，则第一次唤起优先，其他忽略。
- 3.4. 若 then 抛出异常 e，若 resolvePromise 或 rejectPromise 已经被唤起，则忽略异常。其他情况，则 reject promise with e as the reason
- 3.5. 若 then 不是一个函数，则 fulfill promise with x

4. 若 x 不是对象或函数，则 fulfill promise with x

##### 其他特性（非规范内）

###### Promise.prototype.catch()

- `Promise.prototype.then(null, onRejected)`的语法糖

###### Promise.prototype.finally()

- 无论 Promise 的状态是 fulfilled 还是 rejected，最终都会执行，多用于添加清理代码。
- 会原样后传初始的 Promise

###### then,catch,finally 的执行顺序

- executor 是同步，then,catch,finally 均是添加到微任务队列中，待同步代码（宏任务）执行一次后，去微任务队列执行一次，再去宏任务，再去微任务，如此循环...

###### Promise.all()

`const promiseAll = Promise.all([promise1, promise2,...promises])`

- promise1,promise2,...promises，若不是 Promise 对象，会通过 Promise.resolve()转成 Promise 对象
- 当且仅当 promise1,promise2,...promises，均为 fulfilled 状态，才会调用 promiseAll.then()的 onFulfilled 回调函数
- 若 promise1,promise2,...promises，至少有 1 个是 rejected 状态，最终会调用 promiseAll.then()的 onRejected 回调函数
- 若 promise1,promise2,...promises，均没有 rejected 状态，且至少有 1 个是 pending 状态，则最终不会调用 promiseAll.then()的任何回调函数

###### Promise.race()

`const promiseRace = Promise.race([promise1, promise2,...promises])`

- 根据第一个更改状态为 fulfilled 或 rejected 的 promise，包装其 value 或 reason 返回新的 promise 对象
- 第一个之外的其余 promise，将静默执行。

###### Promise 的串行执行

```js
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promiseArray = [promise1, promise2];
// Array.prototype.reduce()
const promiseReduce = promiseArray.reduce((prev, curr) => {
  return prev.then(curr);
}, Promise.resolve());
// async await
async function promisesResolve() {
  for (const promiseInstance of promiseArray) {
    await promiseInstance.then();
  }
}
promisesResolve();
```

###### 可以取消的 promise 类

```js
class CancelToken {
  constructor(cancelFn) {
    this.promise = new Promise((resolve, reject) => {
      cancelFn(resolve, reject);
    });
  }
}
```

### Generator

#### 概念

- 是 ES6 提供的一种异步编程解决方案
- 状态机，封装了多个内部状态
- 遍历器对象的生成函数

#### 特性

1. 每当执行完一条 yield 语句后函数就会自动停止执行, 直到再次调用 next();
2. yield 关键字只可在生成器内部使用，在其他地方使用会导致程序抛出错误;
3. 可以通过函数表达式来创建生成器, 但是不能使用箭头函数

```js
function* generator() {
  const list = [1, 2];
  for (let i of list) {
    yield i;
  }
}
let g = generator();
console.log(g.next()); // {value: 1, done: false}
console.log(g.next()); // {value: 2, done: false}
console.log(g.next()); // {value: undefined, done: true}
```

> babel 编译后

```js
var _marked = /*#__PURE__*/ regeneratorRuntime.mark(generator);
function generator() {
  var list, _i, _list, i;
  return regeneratorRuntime.wrap(function generator$(_context) {
    while (1) {
      switch ((_context.prev = _context.next)) {
        case 0:
          list = [1, 2];
          (_i = 0), (_list = list);
        case 2:
          if (!(_i < _list.length)) {
            _context.next = 9;
            break;
          }
          i = _list[_i];
          _context.next = 6;
          return i;
        case 6:
          _i++;
          _context.next = 2;
          break;
        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}
var g = generator();
console.log(g.next()); // {value: 1, done: false}
console.log(g.next()); // {value: 2, done: false}
console.log(g.next()); // {value: undefined, done: true}
```

### async await

#### 概念

- Generator 函数的语法糖，对 Generator 函数有改进：

1. async 函数的执行，与普通函数一样，不需要 generator.next()
2. async 代替\*号，await 代替 yield，语义更清楚
3. await 命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）
4. async 函数返回值是 Promise 对象，比 Generator 函数返回的 Iterator 对象更好用

#### 其他特性

1. await 关键字期待（但实际上并不要求）一个实现 thenable 接口的对象，但常规的值也可以，则这个值就被当作已经 resolve 的 promise
2. await 不能出现在 async 函数里的嵌套函数中（无论是箭头函数、同步函数声明，还是 IIFE）

```js
function sleep(interval) {
  return new Promise((resolve) => {
    setTimeout(resolve, interval);
  });
}
async function one2FiveInAsync() {
  for (let i = 1; i <= 5; i++) {
    console.log(i);
    await sleep(1000);
  }
}
one2FiveInAsync();
```

> babel 编译后

```js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

function sleep(interval) {
  return new Promise(function (resolve) {
    setTimeout(resolve, interval);
  });
}

function one2FiveInAsync() {
  return _one2FiveInAsync.apply(this, arguments);
}

function _one2FiveInAsync() {
  _one2FiveInAsync = _asyncToGenerator(
    regeneratorRuntime.mark(function _callee() {
      var i;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              i = 1;
            case 1:
              if (!(i <= 5)) {
                _context.next = 8;
                break;
              }
              console.log(i);
              _context.next = 5;
              return sleep(1000);
            case 5:
              i++;
              _context.next = 1;
              break;
            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })
  );
  return _one2FiveInAsync.apply(this, arguments);
}
one2FiveInAsync();
```
