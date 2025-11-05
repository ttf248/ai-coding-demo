# 什么是 React？

## 📖 概述

React 是 Facebook（现 Meta）于 2013 年开源的 JavaScript 库，用于构建用户界面，特别是单页应用。它专注于视图层，采用组件化开发模式，使用虚拟 DOM 提高渲染性能。React 已成为前端开发的主流框架之一。

## 🌟 核心特性

### 1. **组件化开发**
- 将 UI 拆分为独立、可复用的组件
- 每个组件管理自己的状态和逻辑
- 支持组件嵌套和组合

### 2. **JSX 语法**
- 在 JavaScript 中写 HTML 语法
- 编译后转换为 `React.createElement()`
- 提供更直观的开发体验

### 3. **虚拟 DOM**
- 内存中维护一份 DOM 树副本
- 数据变化时先更新虚拟 DOM
- 通过 diff 算法高效更新真实 DOM

### 4. **单向数据流**
- 数据从父组件流向子组件
- 通过 props 传递数据
- 通过回调函数处理子组件事件

### 5. **Hooks 特性**
- 在函数组件中使用状态
- `useState` - 状态管理
- `useEffect` - 副作用处理
- `useContext` - 上下文

## 🏗️ 项目结构

```
my-react-app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/     # 组件目录
│   ├── pages/         # 页面组件
│   ├── hooks/         # 自定义 Hooks
│   ├── App.js         # 根组件
│   ├── index.js       # 入口文件
│   └── index.css      # 全局样式
├── package.json
└── README.md
```

## 💻 基本语法

### 1. 函数组件

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}
```

### 2. 类组件

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>
  }
}
```

### 3. 使用 Hooks

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}
```

### 4. 条件渲染

```jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>欢迎回来！</h1>
  }
  return <h1>请登录</h1>
}
```

### 5. 列表渲染

```jsx
function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
```

## 🎯 React Hooks

### useState
```jsx
const [state, setState] = useState(initialValue)
```

### useEffect
```jsx
useEffect(() => {
  // 副作用逻辑
  return () => {
    // 清理逻辑
  }
}, [dependencies])
```

### useContext
```jsx
const value = useContext(MyContext)
```

### 自定义 Hook
```jsx
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  const increment = () => setCount(count + 1)
  return { count, increment }
}
```

## 📦 核心生态

- **React Router**：路由管理
- **Redux/Zustand**：状态管理
- **React Query**：服务器状态管理
- **Next.js**：全栈 React 框架
- **Create React App**：项目脚手架
- **Vite**：新一代构建工具
- **React Native**：跨平台移动开发

## 🚀 开发流程

### 1. 创建项目
```bash
# 使用 Create React App
npx create-react-app my-app
cd my-app
npm start

# 使用 Vite（推荐）
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

### 2. 构建项目
```bash
npm run build
```

### 3. 项目结构示例

**App.js**
```jsx
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>React Demo</h1>
      <p>Counter: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}

export default App
```

## ✅ 优缺点

### 优点
- ✅ 生态丰富，资料完善
- ✅ 组件化开发，代码复用性强
- ✅ 虚拟 DOM 提升性能
- ✅ Hooks 让函数组件更强大
- ✅ 支持 TypeScript
- ✅ 活跃的社区支持

### 缺点
- ❌ 学习曲线较陡峭（JSX、Hooks 等概念）
- ❌ 需要配置大量工具（构建、测试等）
- ❌ 更新速度快，文档有时跟不上
- ❌ 过度灵活可能导致代码结构混乱

## 🎯 适用场景

- 大型复杂单页应用
- 需要丰富生态系统的项目
- 对性能要求较高的应用
- 需要 TypeScript 支持的项目
- 团队有 React 开发经验

## 📚 学习资源

- [React 官方文档](https://react.dev/)
- [React 中文文档](https://react.docschina.org/)
- [React 入门教程 - 阮一峰](https://www.ruanyifeng.com/blog/2015/03/react.html)
- [React 培训课程](https://reacttraining.com/)
- [Awesome React](https://github.com/enaqx/awesome-react)

## 🔗 相关链接

- 在线预览：[React Demo](what-is-react-demo.html)
- GitHub：[facebook/react](https://github.com/facebook/react)
- 官网：[react.dev](https://react.dev/)
- React DevTools：[浏览器扩展](https://chrome.google.com/webstore/detail/react-developer-tools)
