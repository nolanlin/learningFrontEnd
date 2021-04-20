# Promise-路白
## 课程目标
1. 掌握PromiseA+规范并实现Promise
2. 掌握async await
3. 掌握Generator

## 知识要点

### Promise
[Promises/A+规范](https://promisesaplus.com/)
#### 术语
1. promise 是对象或函数
2. thenable 定义了then方法
3. value 状态fulfilled时的值 *any legal JavaScript value*
4. reason 状态rejected时的值
5. exception throw异常值

#### 规范
##### 状态
1. 三个状态：pending, fulfilled, rejected
2. 状态流转（**fulfilled,rejected为最终态，不可变**）：
- pending -> resolve(value) -> fulfilled
- pending -> reject(reason) -> rejected

##### then方法
`promise.then(onFulfilled, onRejected)`
1. onFulfilled, onRejected 忽略非函数类型（第6点继续解释）
2. 当且仅当promise变成fulfilled时，才可调用onFulfilled，value是参数，且onFulfilled仅可被调用1次
3. 当且仅当promise变成rejected时，才可调用onRejected，reason是参数，且onRejected仅可被调用1次
4. onFulfilled, onRejected 应当是微任务（queueMicrotask）
> *onFulfilled or onRejected must not be called until the execution context stack contains only platform code*
5. then 可被多次调用
- 所有onFulfilled, onRejected回调按照then的注册顺序依次执行
> *If/when promise is fulfilled, all respective onFulfilled callbacks must execute in the order of their originating calls to then.*
> *If/when promise is rejected, all respective onRejected callbacks must execute in the order of their originating calls to then.*
6. then 必须返回promise，以下简称为promise2
> `promise2 = promise1.then(onFulfilled, onRejected);`
- onFulfilled, onRejected 正常返回x，执行*the Promise Resolution Procedure*这段处理逻辑（也就是，有正常的return）
> *If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x)*
- onFulfilled, onRejected 抛异常，则promise2的状态是rejected且带有reason
- onFulfilled 非函数且promise1状态是fulfilled，则promise2的状态是fulfilled带有promise1的value
- onRejected 非函数且promise1状态是rejected，则promise2的状态是rejected带有promise1的reason

##### The Promise Resolution Procedure
`[[Resolve]](promise2, x)` 
> *The promise resolution procedure is an abstract operation taking as input a promise and a value, which we denote as [[Resolve]](promise, x)*
1. 若promise2和x相等，则promise2为rejected，reason是TypeError
2. 若x是promise，那就得看此时x的状态：
- x是pending，则promise2必须保持pending直到x是fulfilled或rejected
- x是fulfilled，则fulfill promise2 with the same value
- x是rejected，则reject promise2 with the same reason
3. 若x是对象或函数：
- Let then be x.then
- 若x.then抛出异常e，那么reject promise with e as the reason
- 若then是函数，那么then.call(x, resolvePromiseFn, rejectPromiseFn)，相当于x.then(resolvePromiseFn, rejectPromiseFn)，有以下情况：
> *If then is a function, call it with x as this, first argument resolvePromise, and second argument rejectPromise*
- 3.1. 若resolvePromise被唤起，入参是value y，那么运行[[Resolve]](promise, y)
> *If/when resolvePromise is called with a value y, run [[Resolve]](promise, y)*
- 3.2. 若rejectPromise被唤起，入参是reason r，那么reject promise with r
> *If/when rejectPromise is called with a reason r, reject promise with r*
- 3.3. 若resolvePromise和rejectPromise都被唤起，或多次用同个参数唤起，则第一次唤起优先，其他忽略。
- 3.4. 若then抛出异常e，若resolvePromise或rejectPromise已经被唤起，则忽略异常。其他情况，则reject promise with e as the reason
- 3.5. 若then不是一个函数，则fulfill promise with x
4. 若x不是对象或函数，则fulfill promise with x

### Generator
#### 概念
- 是ES6提供的一种异步编程解决方案
- 状态机，封装了多个内部状态
- 遍历器对象的生成函数
#### 特性
1. 每当执行完一条yield语句后函数就会自动停止执行, 直到再次调用next();
2. yield关键字只可在生成器内部使用，在其他地方使用会导致程序抛出错误;
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
> babel编译后
```js
var _marked = /*#__PURE__*/regeneratorRuntime.mark(generator);
function generator() {
  var list, _i, _list, i;
  return regeneratorRuntime.wrap(function generator$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          list = [1, 2];
          _i = 0, _list = list;
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