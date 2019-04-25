# 手撸 JavaScript 模板引擎

## 前言

当下前端充斥着各种各样的开发框架：React，Vue 等等。然而大多数这些框架的设计模式是采用了一数据为核心的 MVVM 模式。MVC 的开发模式已经离我们渐行渐远。

对于 MVVM 模式来说，最核心的部件就是一个围绕数据的模板引擎。

模板引擎分为前端和后端

- 前端常用的模板引擎如：mustache.js，渲染是在客户端完成的；
- 后端的模板引擎如：微信小程序，渲染就是在服务器完成的；

今天我们就来深入研究一下客户端模板引擎的实现！

## 需求分析

模板引擎分为两个部分：

- 模板结构，用于规定渲染页面的结构
- 数据源，用于填充模板内的数据

由此我们就可以写下我们的第一行代码：

```javascript
/**
 * @param {String} template
 * @param {Object} data
 * @returns {String}
 * @description render the template with the data source
 */
function TemplateEngine(template, data) {
  return;
}
```

假如我这里有如下模板需要渲染：

```javascript
var template =
  "<div>" +
  "<p>Name<span><% this.name %></span></p>" +
  "<p>Gender<span>" +
  "<% if(this.gender === 'male') { %>" +
  "Male" +
  "<% } else { %> " +
  "Female" +
  "<% } %>" +
  "</span></p>" +
  "</div>";
```

数据源：

```javascript
var data = {
  name: "AJie",
  gender: "male"
};
```

需要的渲染结果：

```html
<div>
  <p>Name<span>AJie</span></p>
  <p>Gender<span>Male</span></p>
</div>
```

## 实现思路

我们先将数据源和渲染结果放在一边，先来看看我们的模板。

假若你是浏览器，你会将模板最终渲染成为什么样子呢？当你去除掉字符串的引号以及<% %>之后，答案渐渐的就浮出水面了。

```pseudocode
<div>
  <p>Name<span>this.name</span></p>
  <p>Gender<span>
  if(this.gender === 'male') {
  Male
  } else {
  Female
  }
  </span></p>
</div>"
```

我们现在来分析一下上面这段代码，不难发现，只要是之前没有包含在<% %>之中的模板字符串，都进行原样输出了；而那些再<% %>中的模板字符串则变成了可执行的 JavaScript 逻辑代码。

因此我们可以先定义一个空数组，用于存储 JavaScript 逻辑代码：

```javascript
var r = [];
r.push("<div><p>Name<span>");
r.push(this.name);
r.push("</span></p><p>Gender<span>");
if (this.gender === "male") {
  r.push(" Male ");
} else {
  r.push(" Female ");
}
r.push("</span></p></div>");
return r.join("");
```

对于原样输出的字符串，我们先将它们封装在 push() 的代码之中，变为 JavaScript 代码，而对于之前的逻辑代码则予以保留。

这么一来，上面的代码就更像是一个函数的函数体了，而调用者正是我们的 data 数据源。其返回值则是我们最终需要的结果——渲染好的字符串！

由此我们可以逐步完善之前的代码：

```javascript
function TemplateEngine(template, data) {
	var code = [];
  ...
  return new Function(code).apply(data);
}
```

_值得注意：_

- new Function ([arg1[, arg2[, ...argN]],] functionBody)

  函数的参数首先出现，而函数体在最后。所有参数都写成字符串形式。

- apply(thisobj, args)

  如果不了解 apply()，还可以查看我之前写的文章：[《Function.call()的需求分析》](https://juejin.im/post/5c9d9924e51d45653a0efc20)

到了这一步的时候，思路渐渐的明了了起来，我们只需要在函数内部写出一个生成可执行 JavaScript 代码的字符串数组即可。

这时候我们就应该想怎么去处理函数内的 template 形参。

有了之前的那些思路铺垫之后，我们不难发现这是一个字符串检索匹配的过程：

1. 初始化 code = "var r=[];\n"
2. 我们先检索模板字符串，依据<% %>将模板字符串划分为几段
3. 将每段按先后顺序 push() 进 code 数组之中
   - 对于没有被<% %>包裹的模板字符串，我们直接将其放在'r.push("' + ... + '");\n'之中，再放进 code 数组。
   - 对于被<% %>包裹的模板字符串，需要判断书语句还是属性：
     - 如果是属性，就放在"r.push(" + 变量 + ")"之中，再放进 code 数组。
     - 如果是语句，就直接放入 code 数组之中。

## 代码实现

结果前面的分析，对于该模板引擎的设计大致已经 OKay 了！

借助于正则做模式字符串匹配进行功能实现：

```javascript
/**
 * @param {String} template
 * @param {Object} data
 * @returns {String}
 * @description render the template with the data source
 */
function TemplateEngine(template, data) {
  var re = /<%([^%>]+)?%>/g,
    reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, //用于匹配语句标识
    code = "var r=[];\n",
    cursor = 0,
    match;
  var add = function(line, js) {
    js
      ? (code += line.match(reExp) ? line + "\n" : "r.push(" + line + ");\n")
      : (code +=
          line != "" ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : "");
    return add;
  };
  while ((match = re.exec(template))) {
    add(template.slice(cursor, match.index))(match[1], true);
    cursor = match.index + match[0].length;
  }
  add(template.substr(cursor, template.length - cursor));
  code += 'return r.join("");';
  return new Function(code.replace(/[\r\t\n]/g, "")).apply(data);
}
```

第一个正则会匹配`<%%>`然后把`<%`和`%>`之间的内容保存下来，第二个正则正好会处理第一个正则保存下来的内容。在`<%`的后面和`%>`的前面可以没有空格，也可以有一个空格，比如`<%name%>`和`<% name %>`应该被认为是一样的，所以为了满足这个需求，前面需要添加一个`( )?`，`( )`表示匹配一个空格，`?`表示前面的重复 0 到 1 次，所以`( )?`的意思就是说可以有一个空格，也可以没有。
在`while`循环中，首先用第一个`re`去匹配（`match = re.exec(tpl)`），然后`<%`和`%>`之间的内容被保存在`match[1]`中，然后用`re2`去匹配（`re2.test(match[1])`）。
注意，`re`把`<%`和`%>`之间的内容全部放在`match[1]`中了，所以如果是`<%name%>`那么`match[1]`中的就是`"name"`，但是如果是`<% name %>`那么`match[1]`中的就是`" name "`，所以需要使用`( )?`来处理一下空格。

## 测试

测试代码如下：

```javascript
console.log(TemplateEngine(template, data));
```

控制台打印输出：

```html
<div>
  <p>Name<span>AJie</span></p>
  <p>Gender<span>Male</span></p>
</div>
```

## 总结

我们始终要记住 MVVM 模式是以数据为驱动的。

所谓模板引擎，简单地说，就是依据页面结构模板和数据源，渲染出真正的页面结构的功能函数。

-EFO-

---

笔者专门在 github 上创建了一个仓库，用于记录平时学习全栈开发中的技巧、难点、易错点，欢迎大家点击下方链接浏览。如果觉得还不错，就请给个小星星吧！👍

---

2019/04/25

[AJie](https://github.com/KevinSalvatore/FullStackPoints.git)
