# 对于 Function.call()的深入理解

> Function 作为 JavaScript 的内置对象，拥有以下两个方法：
>
> - Function.call();
> - Function.apply();
>
> 这两个方法所实现的功能都是相同的：**将函数作为对想象的方法调用。**（引用自《JavaScript 权威指南》P.768 Function.call()）。这两者的不同之处在于参数的类型不一样。
>
> 具体二者不同之处不是本文的重点，读者若想了解可以自行搜索。

---

**言归正传，本文将通过实现类似 Function.call()的功能函数来深入解释其函数内部的运行机制！**

## Function.call()的需求分析

在研究该函数内部的运行机制之前，我们先来了解以下该函数具体是要实现什么样的功能？

根据《JavaScript 权威指南》P.768 有关 Function.call(thisobj, args...)的描述，其详细解释如下：

> call()将指定的函数 function 作为对象 thisobj 的方法来调用，并传入参数列表中 thisobj 之后的参数。返回的是调用 function 的返回值。在函数体内，关键字 this 指代 thisobj 对象，如果 thisobj 位 null，则使用全局对象。

也就是说 call()函数将会用 thisobj 来调用指定的函数 function，并返回结果。

## Function.prototype.myCall()方法设计

在有了上述描述之后，我们就可以着手设计方法了！我们先写一下伪代码：

```
Function.prototype.myCall = function(obj) {
    let object = 如果有传入对象obj传入则保留obj，否则为全局对象
    在object上添加一个临时的属性fn
    将this赋值给fn	//让this所指向的对象（函数的调用者）成为object的一个属性。
    传参给object.fn()，并且执行该方法，将返回值保留。
    删除object上的临时属性fn。
    返回之前保留的保留值。
}
```

## Function.prototype.myCall()的实现

有了之前的设计之后，就是依葫芦画瓢，将伪代码进行实现。具体实现如下：

```javascript
Function.prototype.myCall = function(obj) {
  let object = obj || window;
  object.fn = this;
  var args = [...arguments].slice(1);
  let result = object.fn(...args);
  delete object.fn;
  return result;
};
```

## Function.prototype.myCall()的测试

这里将会用列出两个例子，一方面是为了测试 myCall()的功能实现，另一方面是为了加深对于 call()函数的理解！

1. 案例一是一个简单的函数调用，即用 fn2()这个函数对象，调用 fn1(a)这个方法，具体代码如下：

   ```javascript
   function fn1(a) {
     console.log(a);
   }
   
   function fn2() {
     console.log("*");
   }
   
   fn1.myCall(fn2, "HelloWorld!"); //输出HelloWorld!
   ```

   在这段代码 中，最终我们是要运行 fn1.myCall(fn2, "HelloWorld!")。

   在运行这段代码的时候，myCall()函数中的 this 指向调用者 fn1。myCall()的第一个参数接收了 arguments 的第一个参数，也就是 fn2，并且赋给了 object 变量。我们将 this 所指向的对象添加为 objec 的临时属性 fn。之后执行 object.fn()函数，实际上就是执行了临时添加在 object 上的 this 对象，也就是这里的 fn1。我们将传入的 arguments 从第二个开始传入到 object.fn()中并且执行，将返回值保留。最后销毁临时属性 fn，返回保留值。

2. 案例二是 myCall 的连环调用，具体代码如下：

   ```javascript
   function fn1() {
     console.log(1);
   }
   function fn2() {
     console.log(2);
   }
   
   fn1.myCall.myCall(fn2); //输出2
   ```

   这段代码理解起来说复杂也不复杂，关键是要理解是谁在调用谁的关系。

   - 首先函数从左往右进行执行，先查找**fn1.myCall**.myCall(fn2);中的粗体部分。

     在执行前半段的时候，实际上是一个对象属性查找的过程，最终依据原型链（在这里默认读者明白什么是原型链了，如果不清楚原型链，请自行查找资料）查找到存在在原型链中的 Function.prototype.myCall 属性，其实际就是一个方法。所以上述代码实际上可以与另一句代码相等：

     ```javascript
     //这两句代码的意思是一样的！
     fn1.myCall.myCall(fn2);
     Function.prototype.myCall.myCall(fn2);
     ```

   - 这里我们就直接用 Function.prototype.myCall.**myCall(fn2)**进行解释。

     第二步将执行后半段粗体部分。

     - 先将 fn2 赋给临时变量 object。
     - this 所指向的对象就是一个函数对象：Function.prototype.myCall()。所以赋给 object.fn 临时属性指向的就是 Function.prototype.myCall()方法。
     - 由于 arguments 长度为 1，所以直接执行 object.fn()方法，也就是 object.myCall()，**也就是 fn2.myCall()**。
     - fn2.myCall()实际上执行的是 window.fn2()，具体执行过程就不再熬述了，故输出了 2，没有返回值。
     - 销毁临时属性 fn。
     - 函数执行完毕。

     这里我们将一些帮助理解的测试代码给大家粘贴一下：

     ```javascript
     fn1.myCall.myCall(fn2); //输出2
     Function.prototype.myCall.myCall(fn2); //输出2
     fn2.myCall(); //输出2
     ```

---

_2019/03/29_

[_AJie_](https://github.com/KevinSalvatore/AJie_JS.git)
