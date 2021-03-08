/**
 * 依照Promises/A+规范 https://promisesaplus.com/#point-9
 * 思考：
 * 1. 如何用？
 * 2. 定义Terminology
 *  2.1. state: pending, fulfilled, rejected
 * 3. 思考resolve、then的执行过程
 * 4. 参照规范，条件输出
 */
class CustomPromise{
  constructor(handleFunc){
    this.state = 'pending';
    this.value = undefined;
    this.exception = undefined;
    this.reason = undefined;

    this.fulfilledList = [];
    handleFunc(this.triggerOnFulfilled.bind(this));
  }
  triggerOnFulfilled(val) {
    if(this.state !== 'pending') return;
    setTimeout(() => {
      this.state = 'fulfilled';
      this.value = val;
      this.fulfilledList.forEach(item => item(val));
      this.fulfilledList = [];
    }, 0);
  }
}

const createPromise = function(number){
  return new CustomPromise((onFulfilled, onReject)=>{
    if(number > 1000){
      onFulfilled(number);
    }else{
      onReject(number);
    }
  });
}
const promiseInstance = createPromise(1200);
promiseInstance.catch(function(error){
  console.error('reject promise', error);
}).then(function(number){
  console.log('fulfilled promise', number);
})