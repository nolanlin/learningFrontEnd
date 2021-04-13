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
2. 状态流转：
pending -> resolve(value) -> fulfilled *最终态，不可变*
pending -> reject(reason) -> rejected *最终态，不可变*

##### then方法
(```)
promise.then(onFulfilled, onRejected)
(```)
