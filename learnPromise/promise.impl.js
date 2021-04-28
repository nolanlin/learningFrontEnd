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
      // onFulfilled 非函数且 promise1 状态是 fulfilled，则 promise2 的状态是 fulfilled 带有 promise1 的 value
      let onFulfilledFnFilter = this.isFunction(onFulfilledFn)
        ? onFulfilledFn
        : (value) => value;
      // onRejected 非函数且 promise1 状态是 rejected，则 promise2 的状态是 rejected 带有 promise1 的 reason
      let onRejectedFnFilter = this.isFunction(onRejectedFn)
        ? onRejectedFn
        : (reason) => {
            throw reason;
          };
      let fulfilledProgram = () => {
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
  catch(errFn) {
    return this.then(null, errFn);
  }
  finally(fn) {
    if (!this.isFunction(fn)) {
      return;
    }
    return this.then(
      (value) => MyPromise.resolve(fn()).then(() => value),
      (reason) =>
        MyPromise.resolve(fn()).then(() => {
          throw reason;
        })
    );
  }
  objsToPromise(obj) {
    return MyPromise.resolve(obj);
  }
  static all(objs) {
    return new MyPromise((resolve, reject) => {
      const length = objs.length;
      let count = 0;
      let resultArray = [];
      let fulfilledCount = 0;
      let rejectedCount = 0;
      let firstRejectedIndex = -1;
      let resultFn = () => {
        if (fulfilledCount === length && rejectedCount === 0) {
          // 均为 fulfilled 状态
          const fulfilledArray = Array.from(resultArray, (obj) => {
            return obj.valueOrReason;
          });
          if (fulfilledArray.length === 1) {
            resolve(fulfilledArray[0]);
          } else {
            resolve(fulfilledArray);
          }
        } else if (rejectedCount > 0) {
          // 至少一个rejected，返回第一个rejected的reason
          reject(resultArray[firstRejectedIndex].valueOrReason);
        } else {
          // 没有rejected，且存在pending，则不处理
        }
      };
      let countFn = (index, state, valueOrReason) => {
        resultArray[index] = { state, valueOrReason };
        count++;
        if (state === FULFILLED) {
          fulfilledCount++;
        } else if (state === REJECTED) {
          if (firstRejectedIndex < 0) {
            firstRejectedIndex = index;
          }
          rejectedCount++;
        }
        // 循环结束
        if (count === length) {
          resultFn();
        }
      };
      for (let [index, obj] of objs.entries()) {
        let o = obj;
        if (
          !(
            o !== null &&
            (typeof o === "function" || typeof o === "object") &&
            typeof o.then === "function"
          )
        ) {
          o = this.objsToPromise(o);
        }
        o.then(
          (value) => {
            countFn(index, FULFILLED, value);
          },
          (reason) => {
            countFn(index, REJECTED, reason);
          }
        );
      }
    });
  }
  static allSettled(objs) {
    return new MyPromise((resolve, reject) => {
      const length = objs.length;
      let count = 0;
      let resultArray = [];
      let fulfilledCount = 0;
      let rejectedCount = 0;
      let resultFn = () => {
        if (fulfilledCount + rejectedCount === length) {
          const finalResultArray = Array.from(resultArray, (obj) => {
            if (obj.state === FULFILLED) {
              return { status: obj.state, value: obj.valueOrReason };
            } else {
              return { status: obj.state, reason: obj.valueOrReason };
            }
          });
          resolve(finalResultArray);
        }
      };
      let countFn = (index, state, valueOrReason) => {
        resultArray[index] = { state, valueOrReason };
        count++;
        if (state === FULFILLED) {
          fulfilledCount++;
        } else if (state === REJECTED) {
          rejectedCount++;
        }
        // 循环结束
        if (count === length) {
          resultFn();
        }
      };
      for (let [index, obj] of objs.entries()) {
        let o = obj;
        if (
          !(
            o !== null &&
            (typeof o === "function" || typeof o === "object") &&
            typeof o.then === "function"
          )
        ) {
          o = this.objsToPromise(o);
        }
        o.then(
          (value) => {
            countFn(index, FULFILLED, value);
          },
          (reason) => {
            countFn(index, REJECTED, reason);
          }
        );
      }
    });
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

// const p1 = new MyPromise((s, r) => {
//   setTimeout(() => {
//     console.log("执行1");
//     r(1);
//   }, 1000);
// });
// // p1.then(
// //   (v) => console.log(v, "fulfilled"),
// //   (r) => console.log(r, "rejected")
// // ).finally(() => console.log("finally"));
// const p2 = new MyPromise((s, r) => {
//   setTimeout(() => {
//     // console.log("执行2");
//     s(2);
//   }, 500);
// });
// const p3 = MyPromise.resolve(23);
// const pAll = MyPromise.allSettled([p1, p2, p3]);
// pAll.then(
//   (v) => console.log(v),
//   (r) => console.log(r)
// );
