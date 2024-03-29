# Browser - 路白、大巫

## BOM - Browser Object Model

- 浏览器提供的 API，比如
  [window](https://github.com/nolanlin/learningFrontEnd/blob/main/learnBrowser/assets/window%E5%AF%B9%E8%B1%A1.jpg),
  [location](https://github.com/nolanlin/learningFrontEnd/blob/main/learnBrowser/assets/location%E5%AF%B9%E8%B1%A1.png),
  [navigator](https://github.com/nolanlin/learningFrontEnd/blob/main/learnBrowser/assets/navigator%E5%AF%B9%E8%B1%A1.png),
  [screen](https://github.com/nolanlin/learningFrontEnd/blob/main/learnBrowser/assets/screen%E5%AF%B9%E8%B1%A1.png),
  [history](https://github.com/nolanlin/learningFrontEnd/blob/main/learnBrowser/assets/history%E5%AF%B9%E8%B1%A1.png)

## 浏览器事件

1. 三个阶段：捕获、目标、冒泡

```js
// addEventListener 第三个参数，true为捕获，false为冒泡，默认是false
// e.target.nodeName 指当前点击的元素, e.currentTarget.nodeName绑定监听事件的元素
window.addEventListener(
  "click",
  function (e) {
    console.log("window 捕获", e.target.nodeName, e.currentTarget.nodeName);
  },
  true
);
parent.addEventListener(
  "click",
  function (e) {
    console.log("parent 冒泡", e.target.nodeName, e.currentTarget.nodeName);
  },
  false
);
```

2. 阻止事件传播

```js
// e.stopPropagation() 不仅可用于冒泡，也可用于捕获
window.addEventListener(
  "click",
  function (e) {
    e.stopPropagation();
  },
  true
);
window.addEventListener(
  "click",
  function (e) {
    // Invoking this method prevents event from reaching any registered event listeners after the current one finishes running and, when dispatched in a tree, also prevents event from reaching any other objects.
    // 如果有多个相同类型事件的事件监听函数绑定到同⼀个元素，当该类型的事件触发时，它们会按照被添加的顺序执⾏。如果其中某个监听函数执⾏了 event.stopImmediatePropagation() ⽅法， 则当前元素剩下的监听函数将不会被执⾏。
    e.stopImmediatePropagation();
  },
  true
);
```

3. 阻止默认行为

- e.preventDefault();

4. IE 兼容性

- [BomEvent](https://github.com/nolanlin/learningFrontEnd/blob/main/learnBrowser/js/BomEvent.js)

5. 从输入 URL 到页面最终的呈现，都发生了什么？

- 1. Prompt for unload. 对前一页进行卸载。
- 2. Redirect. 发起请求。
- 3. App cache. 先在浏览器缓存里找 html，再到操作系统下找。
- 4. DNS. 根据域名查找对应的 IP 地址，到本地 DNS 服务器（电信、联通等）找，再到根 DNS 服务器去查找。
- 5. TCP/IP. 3 次握手，4 次挥手。
- 6. Request. HTTP 请求。
- 7. Response. HTTP 响应。
- 8. Processing. 文档解析和 DOM 加载。
- 9. OnLoad. 触发 OnLoad 事件，呈现页面。
