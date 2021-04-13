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
`[[Resolve]](promise2, x)` （promise2是then的返回值，x是onFulfilled或onRejected的返回值）
> *The promise resolution procedure is an abstract operation taking as input a promise and a value, which we denote as [[Resolve]](promise, x)*
1. 若promise2和x相等，则promise2为rejected，reason是TypeError
**（什么情况会触发promise2和x相等？）**
2. 
