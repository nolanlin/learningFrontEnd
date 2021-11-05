# 算法 - 云隐

## 数据结构

- 数组、链表、栈、队列、哈希、树

### 数组&链表

- 查找：数组连续，效率高。可以迅速定位到数组中某一个节点位置。而链表则需要通过前一个元素指向下一个。
- 插入：数组中元素插入会引起被插入位后所有元素索引的改变，而链表只需要改变某一个节点的 next。
- [实现链表](https://github.com/nolanlin/learningFrontEnd/tree/main/learnAlgorithm/LinkList.js)：head => node1 => node2 => ... => null

### 栈&队列

- 执行顺序的不同：栈-先入后出，队列-先进先出
- [实现栈](https://github.com/nolanlin/learningFrontEnd/tree/main/learnAlgorithm/Stack.js)

### 哈希

- 键值对，快速查找定位
- [哈希](https://github.com/nolanlin/learningFrontEnd/tree/main/learnAlgorithm/Hash.js)

### 树

- 优先广度、优先深度
- 前序遍历（中左右），中序遍历（左中右），后序遍历（左右中）
- [树](https://github.com/nolanlin/learningFrontEnd/tree/main/learnAlgorithm/Tree.js)

## 算法复杂度

- 时间复杂度、空间复杂度

### 时间复杂度

1. 关注点在循环次数最多的代码块。
2. 最大值原则 - 存在多个循环，总复杂度等于最大的代码块复杂度。
3. 乘法原则 - 嵌套代码复杂度等于嵌套内院代码块复杂度的乘积。

- [时间复杂度](https://github.com/nolanlin/learningFrontEnd/tree/main/learnAlgorithm/TimeComplexity.js)
