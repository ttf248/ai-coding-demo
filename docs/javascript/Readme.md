# 什么是 JavaScript？

## 📖 概述

JavaScript 是 Web 的编程语言，几乎所有现代网页都使用它。它也是一种多范式语言，支持事件驱动、函数式和面向对象编程。JavaScript 不仅在浏览器中运行，也可以在服务器端（Node.js）和移动应用中运行。

## 🌟 核心特性

### 1. **动态类型**
- 变量类型在运行时确定
- 灵活的类型转换
- 弱类型系统

### 2. **原型链继承**
- 基于原型的继承模型
- 每个对象都有原型
- 动态对象系统

### 3. **事件驱动**
- 异步编程模型
- 事件监听和回调
- Promise 和 async/await

### 4. **函数是一等公民**
- 函数可以赋值给变量
- 函数可以作为参数传递
- 闭包特性

## 💻 基础语法

### 1. 变量与作用域

```javascript
// var, let, const
var functionScope = "函数作用域"
let blockScope = "块级作用域"
const constant = "常量"

// 作用域
{
  let blockVar = "只在块内可见"
}
```

### 2. 函数

```javascript
// 函数声明
function greet(name) {
  return `Hello, ${name}!`
}

// 函数表达式
const add = function(a, b) {
  return a + b
}

// 箭头函数
const multiply = (a, b) => a * b

// 默认参数
function power(base, exponent = 2) {
  return Math.pow(base, exponent)
}
```

### 3. 对象与数组

```javascript
// 对象
const user = {
  name: "Alice",
  age: 25,
  greet() {
    return `Hi, I'm ${this.name}`
  }
}

// 数组
const numbers = [1, 2, 3, 4, 5]
const doubled = numbers.map(n => n * 2)

// 解构
const { name, age } = user
const [first, second] = numbers
```

### 4. 异步编程

```javascript
// Promise
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("data"), 1000)
  })
}

// async/await
async function getData() {
  try {
    const data = await fetchData()
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}
```

## 🎯 现代特性（ES6+）

- 箭头函数
- 模板字符串
- 解构赋值
- 扩展运算符
- Promise
- async/await
- 类（Class）
- 模块（Module）
- Map 和 Set
- Generator

## ✅ 优缺点

### 优点
- ✅ 学习门槛低
- ✅ 社区庞大，资源丰富
- ✅ 跨平台运行（Web、Server、Mobile）
- ✅ 生态系统极其丰富
- ✅ 不断演进（每年新特性）

### 缺点
- ❌ 动态类型可能导致运行时错误
- ❌ 浏览器兼容性问题（需转译）
- ❌ 异步编程复杂（Callback Hell）

## 🎯 适用场景

- Web 前端开发
- 后端开发（Node.js）
- 移动应用（React Native、Ionic）
- 桌面应用（Electron）
- 游戏开发
- IoT 开发

## 📚 学习资源

- [MDN JavaScript 指南](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
- [JavaScript 高级程序设计](https://book.douban.com/subject/10546125/)
- [JavaScript 权威指南](https://book.douban.com/subject/2228378/)

## 🔗 相关链接

- 在线预览：[JavaScript Demo](what-is-javascript-demo.html)
- 规范：[ECMAScript](https://tc39.es/ecma262/)
- 在线运行：[JSFiddle](https://jsfiddle.net/)
- 练习平台：[LeetCode](https://leetcode.cn/)
