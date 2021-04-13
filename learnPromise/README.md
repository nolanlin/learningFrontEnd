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
1. onFulfilled, onRejected 忽略非函数类型
2. 当且仅当promise变成fulfilled时，才可调用onFulfilled，value是参数，且onFulfilled仅可被调用1次
3. 当且仅当promise变成rejected时，才可调用onRejected，reason是参数，且onRejected仅可被调用1次
4. onFulfilled, onRejected 应当是微任务（queueMicrotask）
> *onFulfilled or onRejected must not be called until the execution context stack contains only platform code*
5. 