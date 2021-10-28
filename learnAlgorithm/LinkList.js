// 实现链表：head => node1 => node2 => ... => null
class LinkList {
  constructor() {
    this.length = 0;
    this.head = null; // 可以用作链表是否为空的判断
  }
  // 返回索引对应的元素
  getElementAt(position) {
    if (position < 0 || position >= this.length) return null;
    let current = this.head;
    for (let i = 0; i < position; i++) {
      current = current.next;
    }
    return current;
  }
  // 添加节点
  append(element) {
    // 生成复杂元素no
    let node = new Node(element);
    // 判断链表是否为空
    if (this.head == null) {
      this.head = node;
    } else {
      // 找到尾巴
      let current = this.getElementAt(this.length - 1);
      current.next = node;
    }
    this.length++;
  }
  // 指定位置添加节点
  insert(position, element) {
    if (position < 0 || position > this.length) return false;
    let node = new Node(element);
    if (position === 0) {
      node.next = this.head;
      this.head = node;
    } else {
      let previous = this.getElementAt(position - 1);
      node.next = previous.next;
      previous.next = node;
    }
    this.length++;
    return true;
  }
  // 删除指定位置的元素
  removeAt(position) {
    if (position < 0 || position > this.length) return false;
    let current = this.head;
    if (position === 0) {
      this.head = current.next;
    } else {
      let previous = this.getElementAt(position - 1);
      current = previous.next;
      previous.next = current.next;
    }
    this.length--;
    return current.element;
  }
  // 查找给定元素的索引
  indexOf(element) {
    let current = this.head;
    for (let i = 0; i < this.length; i++) {
      if (current.element === element) return i;
      current = current.next;
    }
    return -1;
  }
  // ......
}

// 组装标准链表节点的辅助类
class Node {
  constructor(element) {
    this.element = element;
    this.next = null;
  }
}

// 双向链表
// 实现链表：head <=> node1 <=> node2 <=> ... <=> null
// tail prev
class DoubleLinkList extends LinkList {}
