/**
 * 依照Promises/A+规范 https://promisesaplus.com/
 * 思考：
 * 1. 如何用？
 * 2. 定义Terminology
 *  2.1. state: pending, fulfilled, rejected
 * 3. 思考resolve、reject、then的执行过程
 *  3.1. executor是同步执行，then是微任务，用setTimeout来模拟then的微任务队列行为
 *  3.2. then是一个收集onFullfilled和onRejected回调方法的过程
 *  3.3. resolve和reject应当在then注册之后执行收集到的回调函数
 * 4. 参照规范，条件输出
 */
class CustomPromise {
  constructor (handleFunc) {
    this.state = 'pending';
    this.value = undefined;
    this.exception = undefined;
    this.reason = undefined;

    this.fulfilledList = [];
    this.rejectedList = [];
    handleFunc(this.triggerResolve.bind(this));
  }
  
  triggerResolve(val) {
    if (this.state !== 'pending') return;
    setTimeout(() => {
      this.state = 'fulfilled';
      this.value = val;
      this.fulfilledList.forEach(item => item(val));
      this.fulfilledList = [];
    }, 0);
  }

  then(onFulfilled, onRejected){
    const { state, value, reason } = this
    return new CustomPromise((nextResolve, nextReject) => {
      function onFinalFulfilled(val){
        if(typeof onFulfilled !== 'function'){
          nextResolve(val);
        }else{
          const res = onFulfilled(val);
          if(res && typeof res.then === 'function'){
            res.then(nextResolve);
          }else{
            nextResolve(res);
          }
        }
      }
      switch(state){
        case 'pending': {
          this.fulfilledList.push(onFinalFulfilled);
          break;
        }
      }
    })
  }

  static all(list) {
    return new CustomPromise((resolve, reject) => {
      let count = 0;
      const values = [];
      for (const [i, customPromiseInstance] of list.entries()) {
        customPromiseInstance
          .then(
            res => {
              values[i] = res;
              count++;
              if (count === list.length) resolve(values);
            },
            err => {
              reject(err);
            }
          )
      }
    });
  }
} 

const createPromise = function (number) {
  return new CustomPromise((resolve, reject) => {
    if (number > 1000) {
      resolve(number);
    } else {
      reject(number);
    }
  });
}
const promiseInstance = createPromise(1200);
promiseInstance.then(function (number) {
  console.log('fulfilled promise 1', number);
  return number;
}).then(function (number) {
  console.log('fulfilled promise 2', number);
  return number;
}).then(function (number) {
  console.log('fulfilled promise 3', number);
  return number;
})
promiseInstance.then(function (number) {
  console.log('fulfilled promise 4', number);
  return number;
}).then(function (number) {
  console.log('fulfilled promise 5', number);
  return number;
})
// ....
setTimeout(() => {
  promiseInstance.then(function (number) {
    console.log('fulfilled promise 6', number);
    return number;
  })
}, 0);