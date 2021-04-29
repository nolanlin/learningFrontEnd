# Module-波比

## 理解

- 思想：把逻辑分块，各自封装，相互独立，每个块自行决定对外暴露什么，同时自行决定引入执行哪些外部代码。

### 解决的问题

1. 变量冲突，命名空间的污染。
2. 模块之间的通信。

### 优点

1. 把复杂问题拆分，关注分离。
2. 大型软件开发的技术基础：

- 更优雅的代码管理
- 替换、复用、拓展
- 变量、行为内聚，对外暴露通信接口

### 发展历程

#### CommonJS

- Node.js，2009 年推出时，实现的一套模块化规范。

##### 概念及应用

```js
// index.js
require("./moduleA");
var m = require("./moduleB");
console.log(m);
// moduleA.js
var m = require("./moduleB");
setTimeout(() => console.log(m), 1000);
// moduleB.js
var m = new Date().getTime();
module.exports = m;
```

- 每个 JS 文件就是一个模块，每个模块内部可以使用 require 函数来引入，使用 module.exports 函数对模块进行导出。
- **同步加载模块。**
- **仅能运行于 Node.js 环境中。**

#### AMD (Asynchronous Module Definition)

- 受到 CommonJS 模块化规范的启发，逐渐发展起的适应浏览器端的模块开发规范。

##### 解决的问题

- 页面因同步加载导致停止响应，需异步加载。

##### 概念及应用

```js
// index.js
require(["moduleA", "moduleB"], function (moduleA, moduleB) {
  console.log(moduleB);
});
// moduleA.js
define(function (require) {
  var m = require("moduleB");
  setTimeout(() => console.log(m), 1000);
});
// moduleB.js
define(function (require) {
  var m = new Date().getTime();
  return m;
});
```

```html
<html>
  <!-- 此处必须加载 require.js 之类的 AMD 模块化库之后才可以继续加载模块-->
  <script src="/require.js"></script>
  <!-- 只需要加载⼊⼝模块即可 -->
  <script src="/index.js"></script>
</html>
```

- 每个 JS 文件就是一个模块，使用 define 函数进行定义模块，回调函数接受 require 方法，用来加载其他模块。
- index.js 入口文件使用 require 方法，第一个参数是依赖数组，第二个参数是回调函数，函数的入参是一一对应依赖数组的模块对象。
- html 需提前加载模块化库。
- **异步加载模块。**
- **仅能运行于加载了 AMD 类库的浏览器中。**

#### UMD (Universal Module Definition)

- 同时兼容 AMD 和 CommonJS 语法的开发规范。

##### 概念及应用

```js
(function (self, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    // 当前环境是 CommonJS 规范环境
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    // 当前环境是 AMD 规范环境
    define(factory);
  } else {
    // 什么环境都不是，直接挂在全局对象上
    self.umdModule = factory();
  }
})(this, function () {
  return function () {
    return Math.random();
  };
});
```

#### ESModule (EcmaScript Module)

- 从 JS Core 语法层面制定的解释器规范，而浏览器、Node.js 等是在解释器的基础上封装的环境相关的 API，如 global 对象、window 对象等。

##### 概念及应用

```js
// index.js
import './moduleA';
import m from './moduleB';
console.log(m);
// moduleA.js
import m from './moduleB';
setTimeout(()) => console.log(m), 1000);
// moduleB.js
var m = new Date().getTime();
export default m;
```

- 通过 import 和 export 两个关键词来对模块进⾏导⼊与导出。
- 因运行环境的版本高低（比如旧版本浏览器，旧版本 Node.js），可用工具 **babel**，把 JS Core 中⾼版本规范的语法，按照相同语义在静态阶段转化为低版本规范的语法，使得旧版运行环境内的 JS 解释器也能解析。
