class Stack {
  constructor() {
    this.items = [];
  }

  // 添加新元素到栈
  push(element) {
    this.items.push(element);
  }

  // 移出栈顶元素
  pop() {
    return this.items.pop();
  }

  // 获取栈顶元素
  peek() {
    return this.items[this.items.length - 1];
  }

  // 判断空
  isEmpty() {
    return this.items.length === 0;
  }

  // 清除
  clear() {
    this.items = [];
  }

  // 长度
  size() {
    return this.items.length;
  }
}

// 扩展
// 判断括号有效性（自闭合）
// '{}[]'true, '{{}[]'false, '[{()}]'true
const isValid = function (s) {
  const stack = new Stack();
  const map = {
    "}": "{",
    "]": "[",
    ")": "(",
  };
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    stack.push(char);
    if (stack.size < 2) continue;
    const theLastOne = stack[stack.size - 1];
    const theLastTwo = stack[stack.size - 2];
    if (map[theLastTwo] === theLastOne) {
      stack.pop();
      stack.pop();
    }
  }

  return stack.size === 0;
};
