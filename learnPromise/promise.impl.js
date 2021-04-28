const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
class MyPromise {
  constructor(executor) {
    this._state = PENDING;
    this.value = null;
    this.reason = null;
    this.onFulfilledCallbackList = [];
    this.onRejectedCallbackList = [];
    this.thenPendingCallbackList = [];
    try {
      executor(this.resolveFn.bind(this), this.rejectFn.bind(this));
    } catch (e) {
      this.rejectFn(e);
    }
  }
  get state() {
    return this._state;
  }
  set state(newState) {
    this._state = newState;
    switch (this._state) {
      case FULFILLED:
        this.onFulfilledCallbackList.forEach((fn) => fn());
        break;
      case REJECTED:
        this.onRejectedCallbackList.forEach((fn) => fn());
        break;
    }
  }
  resolveFn(value) {
    if (this.state === PENDING) {
      this.value = value;
      this.state = FULFILLED;
    }
  }
  rejectFn(reason) {
    if (this.state === PENDING) {
      this.reason = reason;
      this.state = REJECTED;
    }
  }
  isFunction(fn) {
    return typeof fn === "function";
  }
  isObject(fn) {
    return typeof fn === "object";
  }
  then(onFulfilledFn, onRejectedFn) {
    let promise2 = new MyPromise((resolve, reject) => {
      let onFulfilledFnFilter = this.isFunction(onFulfilledFn)
        ? onFulfilledFn
        : (value) => value;
      let onRejectedFnFilter = this.isFunction(onRejectedFn)
        ? onRejectedFn
        : (reason) => {
            throw reason;
          };
      let fulfilledProgram = () => {
        // onFulfilled 非函数且 promise1 状态是 fulfilled，则 promise2 的状态是 fulfilled 带有 promise1 的 value
        queueMicrotask(() => {
          // onFulfilled抛异常，则 promise2 的状态是 rejected 且带有 reason
          try {
            let x = onFulfilledFnFilter(this.value);
            this.promiseResolutionProcedure(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };
      let rejectedProgram = () => {
        // onRejected 非函数且 promise1 状态是 rejected，则 promise2 的状态是 rejected 带有 promise1 的 reason
        queueMicrotask(() => {
          // onRejected 抛异常，则 promise2 的状态是 rejected 且带有 reason
          try {
            let x = onRejectedFnFilter(this.reason);
            this.promiseResolutionProcedure(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };
      switch (this.state) {
        case FULFILLED:
          fulfilledProgram();
          break;
        case REJECTED:
          rejectedProgram();
          break;
        case PENDING:
          // 当executor里的程序是异步时，调用then方法，此时state还是pending，需要存储回调方法。
          this.onFulfilledCallbackList.push(fulfilledProgram);
          this.onRejectedCallbackList.push(rejectedProgram);
          break;
      }
    });
    return promise2;
  }
  promiseResolutionProcedure(promise, x, resolve, reject) {
    if (promise === x) {
      reject(new TypeError());
    }
    let called;
    if (x !== null && (this.isFunction(x) || this.isObject(x))) {
      try {
        let then = x.then;
        if (this.isFunction(then)) {
          then.call(
            x,
            (y) => {
              if (called) return;
              called = true;
              this.promiseResolutionProcedure(x, y, resolve, reject);
            },
            (r) => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } else {
          resolve(x);
        }
      } catch (e) {
        if (called) return;
        called = true;
        reject(e);
      }
    } else {
      resolve(x);
    }
  }
  static resolve(value) {
    return new MyPromise((resolve, reject) => {
      resolve(value);
    });
  }
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
  static catch(errFn) {
    return this.then(null, errFn);
  }
}
// npm install -g promises-aplus-tests
// promises-aplus-tests promise.impl.js
module.exports = {
  deferred: () => {
    let resolve;
    let reject;
    const promise = new MyPromise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return {
      promise,
      reject,
      resolve,
    };
  },
  rejected: (reason) => MyPromise.reject(reason),
  resolved: (value) => MyPromise.resolve(value),
};
