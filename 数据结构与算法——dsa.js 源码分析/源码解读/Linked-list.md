# Linked-list

## 前言

在我们日常开发中经常需要用到不定长的数据存储结构进行存储，在JS中自带的Array虽然可以实现我们想要的功能，但是Array有他的天生缺陷：由于Array的物理存储空间是一片连续的，所以添加数据与数据删除操作都比较消耗性能，但是也正因为它是一片连续的存储空间，对于数据的查找的效率是相当高的！

## 优缺点

相比于Array，Linked-list 在物理存储上有很大的不同。Linked-list 的每个节点都是独立存储的，并且在每个节点中不仅包含了自身节点的值，还同时包含了先对自身前一节点的引用和后一节点的引用。

### 优点

正是因为存储空间的特别，数据的增删操作变得相对来是更加简单，性能更高！只需要改变节点中的引用即可！

### 缺点

也正是因为存储的不连续性，数据查找相对与Array 较为缓慢！

## 源码解析

### 节点

链表的产生源于节点：

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.previous = null;
  }
}
```

对于节点而言：只需保存自身值以及向前的引用和向后引用即可！

两个引用时该数据结构的关键，就像人的左右手一样，多个人手拉手就形成了一个人链。

### 链表构造函数

每个链表只需保存一个头节点即可，但是为了提升性能问题，这里同时也保存了尾节点和链表的长度。

```javascript
constructor() {
  this.first = null; // head/root element
  this.last = null; // last element of the list
  this.size = 0; // total number of elements in the list
}
```

这里简单的说明一下为什么保存链表的长度可以大大提高性能：

我们的确可以写一个函数去遍历链表得到长度，但是每一次遍历都是耗时操作，且时没有意义的、重复的操作。如果把链表的长度保存为对象的数据成员，将长度的更新交由链表的增删操作，那么每次想要获得长的只需要调用该属性即可，不仅简单明了，而且优化了性能！

```javascript
/**
 * Alias for size
 */
get length() {
  return this.size;
}
/**
 * Adds element to the begining of the list. Similar to Array.unshift
 * Runtime: O(1)
 * @param {any} value
 */
addFirst(value) {
  const newNode = new Node(value);
  newNode.next = this.first;
  if (this.first) {
    this.first.previous = newNode;
  } else {
    this.last = newNode;
  }
  this.first = newNode; // update head
  this.size += 1;
  return newNode;
}
/**
 * Adds element to the end of the list (tail). Similar to Array.push
 * Using the element last reference instead of navigating through the list,
 * we can reduced from linear to a constant runtime.
 * Runtime: O(1)
 * @param {any} value node's value
 * @returns {Node} newly created node
 */
addLast(value) {
  const newNode = new Node(value);
  if (this.first) {
    newNode.previous = this.last;
    this.last.next = newNode;
    this.last = newNode;
  } else {
    this.first = newNode;
    this.last = newNode;
  }
  this.size += 1;
  return newNode;
}
/**
 * Insert new element at the given position (index)
 *
 * @param {any} value new node's value
 * @param {Number} position position to insert element
 * @returns {Node} new node or 'undefined' if the index is out of bound.
 */
add(value, position = 0) {
  if (position === 0) { // <1>
    return this.addFirst(value);
  }
  if (position === this.size) { // <2>
    return this.addLast(value);
  }
  const current = this.get(position);
  if (current) {
    const newNode = new Node(value); // <3>
    newNode.previous = current.previous; // <4>
    newNode.next = current; // <5>
    current.previous.next = newNode; // <6>
    current.previous = newNode; // <7>
    this.size += 1;
    return newNode;
  }
  return undefined;
}
/**
 * Search by value. It finds first occurrence  of
 * the element matching the value.
 * Runtime: O(n)
 * @example: assuming a linked list with: a -> b -> c
 *  linkedList.indexOf('b') // ↪️ 1
 *  linkedList.indexOf('z') // ↪️ undefined
 * @param {any} value
 * @returns {number} return index or undefined
 */
indexOf(value) {
  return this.find((current, position) => {
    if (current.value === value) {
      return position;
    }
    return undefined;
  });
}
/**
 * Search by index
 * Runtime: O(n)
 * @example: assuming a linked list with: a -> b -> c
 *  linkedList.get(1) // ↪️ 'b'
 *  linkedList.get(40) // ↪️ undefined
 * @param {Number} index position of the element
 * @returns {Node} element at the specified position in this list.
 */
get(index = 0) {
  return this.find((current, position) => {
    if (position === index) {
      return current;
    }
    return undefined;
  });
}
/**
 * Iterate through the list until callback returns a truthy value
 * @example see #get and  #indexOf
 * @param {Function} callback evaluates current node and index.
 *  If any value other than undefined it's returned it will stop the search.
 * @returns {any} callbacks's return value or undefined
 */
find(callback) {
  for (let current = this.first, position = 0; // <1>
    current; // <2>
    position += 1, current = current.next) { // <3>
    const result = callback(current, position); // <4>
    if (result !== undefined) {
      return result; // <5>
    }
  }
  return undefined; // not found
}
// end::find[]
```



## 实际用处

## 总结

当我们的数据需要大量的增删操作的时候，这时我们就有必要考虑使用链表结构了！因为链表在操作数据的增删时性能比Array高很多！