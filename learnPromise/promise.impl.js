// queueMicrotask()需在浏览器端运行
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
class MyPromise {
  constructor(executor) {
    this._state = PENDING;
    this.value = null;
    this.reason = null;
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
    this.thenPendingCallbackList.forEach((fnObject) =>
      this.then(fnObject.onFulfilledFn, fnObject.onRejectedFn)
    );
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
    // 当executor里的程序是异步时，调用then方法，此时state还是pending，需要存储回调方法。
    if (this.state === PENDING) {
      this.thenPendingCallbackList.push({ onFulfilledFn, onRejectedFn });
    } else {
      queueMicrotask(() => {
        const promise2 = new MyPromise((resolve, reject) => {
          if (this.state === FULFILLED) {
            // onFulfilled 非函数且 promise1 状态是 fulfilled，则 promise2 的状态是 fulfilled 带有 promise1 的 value
            if (!this.isFunction(onFulfilledFn)) {
              resolve(this.value);
            }
            // onFulfilled抛异常，则 promise2 的状态是 rejected 且带有 reason
            const onFulfilledResult = null;
            try {
              onFulfilledResult = onFulfilledFn(this.value);
            } catch (e) {
              reject(e);
            }
            this.promiseResolutionProcedure(
              promise2,
              onFulfilledResult,
              resolve,
              reject
            );
          } else if (this.state === REJECTED) {
            // onRejected 非函数且 promise1 状态是 rejected，则 promise2 的状态是 rejected 带有 promise1 的 reason
            if (!this.isFunction(onRejectedFn)) {
              reject(this.reason);
            }
            // onRejected 抛异常，则 promise2 的状态是 rejected 且带有 reason
            const onRejectedResult = null;
            try {
              onRejectedResult = onRejectedFn(this.reason);
            } catch (e) {
              reject(e);
            }
            this.promiseResolutionProcedure(
              promise2,
              onRejectedResult,
              resolve,
              reject
            );
          }
        });
        return promise2;
      });
    }
  }
  promiseResolutionProcedure(promise, x, resolve, reject) {
    if (promise === x) {
      reject(new TypeError());
    }
    if (x && (this.isFunction(x) || this.isObject(x))) {
      if (typeof x.then === "function") {
        let called = false;
        try {
          let then = x.then;
          then.call(
            x,
            (y) => {
              if (called) return;
              called = true;
              promiseResolutionProcedure(promise, y, resolve, reject);
            },
            (r) => {
              if (called) return;
              called = true;
              promiseResolutionProcedure(promise, r, resolve, reject);
            }
          );
        } catch (e) {
          if (called) return;
          called = true;
          reject(e);
        }
      } else {
        resolve(x);
      }
    } else {
      resolve(x);
    }
  }
}
const promiseInstance = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    console.log(2);
    resolve(1);
  }, 0);
});
promiseInstance.then(
  (v) => {
    console.log(v);
  },
  (e) => {
    console.error(e);
  }
);
const promiseInstance2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(2);
    resolve(1);
  }, 0);
});
promiseInstance2.then(
  (v) => {
    console.log(v);
  },
  (e) => {
    console.error(e);
  }
);
