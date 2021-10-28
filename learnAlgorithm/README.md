# 算法 - 云隐

## 数据结构

- 数组、链表、栈、树

### 数组&链表

- 查找：数组连续，效率高。可以迅速定位到数组中某一个节点位置。而链表则需要通过前一个元素指向下一个。
- 插入：数组中元素插入会引起被插入位后所有元素索引的改变，而链表只需要改变某一个节点的 next。
- [实现链表](https://github.com/nolanlin/learningFrontEnd/tree/main/learnAlgorithm/LinkList.js)：head => node1 => node2 => ... => null

```js
class LinkList {
  constructor() {
    this.length = 0;
    this.head = null;
  }
  getElementAt(position) {} // 返回索引对应的元素
  append(element) {} // 添加节点
  insert(position, element) {} // 指定位置添加节点
  removeAt(position) {} // 删除指定位置的元素
  indexOf(element) {} // 查找给定元素的索引
  // ......
}
```
