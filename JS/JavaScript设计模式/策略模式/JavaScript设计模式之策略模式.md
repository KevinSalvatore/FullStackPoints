# JavaScript 设计模式之策略模式

## 前言

> 在软体工程中，设计模式（design pattern）是对软体设计中普遍存在（反复出现）的各种问题，所提出的解决方案。
>
> 设计模式并不直接用来完成程式码的编写，而是描述在各种不同情况下，要怎么解决问题的一种方案。
>
> 设计模式能使不稳定转为相对稳定、具体转为相对抽象，避免会引起麻烦的紧耦合，以增强软体设计面对并适应变化的能力
>
> ——[维基百科](<https://zh.wikipedia.org/wiki/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F_(%E8%AE%A1%E7%AE%97%E6%9C%BA)>)

设计模式是一种软件开发的思想，有益于降低代码的耦合性，增强代码的健壮性。往往在大型项目中用的比较多。

今天就来介绍一种可以替代选择运算的设计模式——策略模式。

## 介绍

> 策略模式作为一种软件设计模式，指对象有某个行为，但是在不同的场景中，该行为有不同的实现算法。比如每个人都要“交个人所得税”，但是“在美国交个人所得税”和“在中国交个人所得税”就有不同的算税方法。
>
> 策略模式：
>
> - 定义了一族算法（业务规则）；
> - 封装了每个算法；
> - 这族的算法可互换代替（interchangeable）。
>
> ——[维基百科](https://zh.wikipedia.org/wiki/%E7%AD%96%E7%95%A5%E6%A8%A1%E5%BC%8F)

![](./images/Strategy_Pattern_in_UML.png)

可以看出，为应对不同场景所导致算法不同，基于工厂模式将各个算法进行封装成类，再进行使用，这就是策略模式。

## 案例

我们来一个例子，一般情况下，如果我们要做数据合法性验证，很多时候都是按照 swith 语句来判断（也可以是 if，elseif，else 的结构），但是这就带来几个问题：

- 如果增加需求的话，我们还要再次修改这段代码以增加逻辑。
- 在进行单元测试的时候也会越来越复杂。

代码如下：

```javascript
validator = {
  validate: function(value, type) {
    switch (type) {
      case "isNonEmpty ": {
        return true;
      }
      case "isNumber ": {
        return true;
        break;
      }
      case "isAlphaNum ": {
        return true;
      }
      default: {
        return true;
      }
    }
  }
};
//  测试
alert(validator.validate("123", "isNonEmpty"));
```

那如何来避免上述代码中的问题呢，根据策略模式，我们可以将相同的工作代码单独封装成不同的类，然后通过统一的策略处理类来处理，OK，我们先来定义策略处理类，代码如下：

```javascript
var validator = {
  // 所有可以的验证规则处理类存放的地方，后面会单独定义
  types: {},
  // 验证类型所对应的错误消息
  messages: [],
  // 当然需要使用的验证类型
  config: {},
  // 暴露的公开验证方法
  // 传入的参数是 key => value对
  validate: function(data) {
    var i, msg, type, checker, result_ok;
    // 清空所有的错误信息
    this.messages = [];
    for (i in data) {
      if (data.hasOwnProperty(i)) {
        type = this.config[i]; // 根据key查询是否有存在的验证规则
        checker = this.types[type]; // 获取验证规则的验证类
        if (!type) {
          continue; // 如果验证规则不存在，则不处理
        }
        if (!checker) {
          // 如果验证规则类不存在，抛出异常
          throw {
            name: "ValidationError",
            message: "No handler to validate type " + type
          };
        }
        result_ok = checker.validate(data[i]); // 使用查到到的单个验证类进行验证
        if (!result_ok) {
          msg = "Invalid value for *" + i + "*, " + checker.instructions;
          this.messages.push(msg);
        }
      }
    }
    return this.hasErrors();
  },
  // helper
  hasErrors: function() {
    return this.messages.length !== 0;
  }
};
```

然后剩下的工作，就是定义 types 里存放的各种验证类了，我们这里只举几个例子：

```javascript
// 验证给定的值是否不为空
validator.types.isNonEmpty = {
  validate: function(value) {
    return value !== "";
  },
  instructions: "传入的值不能为空"
};

// 验证给定的值是否是数字
validator.types.isNumber = {
  validate: function(value) {
    return !isNaN(value);
  },
  instructions: "传入的值只能是合法的数字，例如：1, 3.14 or 2010"
};

// 验证给定的值是否只是字母或数字
validator.types.isAlphaNum = {
  validate: function(value) {
    return !/[^a-z0-9]/i.test(value);
  },
  instructions: "传入的值只能保护字母和数字，不能包含特殊字符"
};
```

使用的时候，我们首先要定义需要验证的数据集合，然后还需要定义每种数据需要验证的规则类型，代码如下：

```javascript
var data = {
  first_name: "Tom",
  last_name: "Xu",
  age: "unknown",
  username: "TomXu"
};

validator.config = {
  first_name: "isNonEmpty",
  age: "isNumber",
  username: "isAlphaNum"
};
```

最后，获取验证结果的代码就简单了：

```javascript
validator.validate(data);

if (validator.hasErrors()) {
  console.log(validator.messages.join("\n"));
}
```

## 总结

策略模式定义了一系列算法，从概念上来说，所有的这些算法都是做相同的事情，只是实现不同，他可以以相同的方式调用所有的方法，减少了各种算法类与使用算法类之间的耦合。

从另外一个层面上来说，单独定义算法类，也方便了单元测试，因为可以通过自己的算法进行单独测试。

实践中，不仅可以封装算法，也可以用来封装几乎任何类型的规则，是要在分析过程中需要在不同时间应用不同的业务规则，就可以考虑是要策略模式来处理各种变化。

-EFO-

---

笔者专门在 github 上创建了一个仓库，用于记录平时学习全栈开发中的技巧、难点、易错点，欢迎大家点击下方链接浏览。如果觉得还不错，就请给个小星星吧！👍

---

2019/04/24

[AJie](https://github.com/KevinSalvatore/FullStackPoints.git)
