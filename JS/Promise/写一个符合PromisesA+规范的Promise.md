# 写一个符合Promises/A+规范的Promise

## 前言

随着浏览器端异步操作复杂程度的日益增加，以及以 Evented I/O 为核心思想的 NodeJS 的持续火爆，Promise、Async 等异步操作封装由于解决了异步编程上面临的诸多挑战，得到了越来越广泛的应用。本文旨在剖析 Promise 的内部机制，从实现原理层面深入探讨，从而达到“知其然且知其所以然”，在使用 Promise 上更加熟练自如。如果你还不太了解 Promise，推荐阅读下 [promisejs.org](https://www.promisejs.org/) 的介绍。

## 是什么

Promise 是一种对异步操作的封装，可以通过独立的接口添加在异步操作执行成功、失败时执行的方法。主流的规范是 [Promises/A+](http://promisesaplus.com/)。

Promise 较通常的回调、事件/消息，在处理异步操作时具有显著的优势。其中最为重要的一点是：Promise 在语义上代表了异步操作的主体。这种准确、清晰的定位极大推动了它在编程中的普及，因为具有单一职责，而且将份内事做到极致的事物总是具有病毒式的传染力。分离输入输出参数、错误冒泡、串行/并行控制流等特性都成为 Promise 横扫异步操作编程领域的重要砝码，以至于 ES6 都将其收录，并已在 Chrome、Firefox 等现代浏览器中实现。

## 内部机制

自从看到 Promise 的 API，我对它的实现就充满了深深的好奇，一直有心窥其究竟。接下来，将首先从最简单的基础实现开始，由浅入深的逐步探索，剖析每一个 feature 后面的故事。

### 基础实现

对于Promise的基本功能，就是要实现基本的异步便同步：

```javascript
function _Promise(handle) {
  const _this = this;

  _this.value = null;
  _this.error = null;

  _this.onFulfilledCallback = undefined;
  _this.onRejectedCallback = undefined;

  function resolve(value) {
    if (_this.onFulfilledCallback) {
      _this.onFulfilledCallback(value);
    }
  }
  function reject(error) {
    if (_this.onRejectedCallback) {
      _this.onRejectedCallback(error);
    }
  }

  try {
    handle(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

_Promise.prototype.then = function(onFulfilled, onRejected) {
  const _this = this;
  _this.onFulfilledCallback = onFulfilled;
  _this.onRejectedCallback = onRejected;
};
```

测试代码：

```javascript
new _Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(123);
  }, 1000);
}).then(data => {
  console.log(data);
});

// 隔一秒后输出：
// 123
```



### 支持同步任务



```javascript
function resolve(value) {
  setTimeout(() => {
    if (_this.onFulfilledCallback) {
      _this.onFulfilledCallback(value);
    }
  });
}
function reject(error) {
  setTimeout(() => {
    if (_this.onRejectedCallback) {
      _this.onRejectedCallback(error);
    }
  });
}
```

测试代码：

```javascript
new _Promise((resolve, reject) => {
  resolve(2);
}).then(data => {
  console.log(1);
  console.log(data);
});
```







### 添加状态

