# 什么是状态管理？

## 📖 概述

状态管理是前端应用架构中的核心概念，指的是管理应用中所有可变数据和状态变化的方式。随着应用复杂度增加，组件间共享状态变得越来越困难，需要专门的解决方案来统一管理状态。

## 🌟 为什么需要状态管理

### 问题场景
- 多个组件需要共享同一数据
- 组件层级嵌套较深，数据传递困难
- 状态变化难以追踪和调试
- 异步操作处理复杂

## 💡 解决方案

### 1. **Context API（React）**
```javascript
// 创建 Context
const ThemeContext = React.createContext()

// 提供者
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 消费者
function Component() {
  const { theme, setTheme } = useContext(ThemeContext)
  return (
    <button onClick={() => setTheme('dark')}>
      当前主题: {theme}
    </button>
  )
}
```

### 2. **Redux**
```javascript
// Action
const increment = () => ({ type: 'INCREMENT' })

// Reducer
function counterReducer(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    default:
      return state
  }
}

// Store
const store = createStore(counterReducer)

// Dispatch
store.dispatch(increment())
```

### 3. **Zustand**
```javascript
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 }))
}))

// 在组件中使用
function Counter() {
  const { count, increment } = useStore()
  return <button onClick={increment}>{count}</button>
}
```

### 4. **React Query**
```javascript
import { useQuery } from 'react-query'

function FetchData() {
  const { data, error, isLoading } = useQuery('todos', fetchTodos)

  if (isLoading) return 'Loading...'
  if (error) return 'Error!'

  return (
    <ul>
      {data.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
```

## 📦 常见状态管理库

### React 生态
- **Redux**：最成熟、功能最全
- **Zustand**：轻量、简洁
- **MobX**：响应式编程
- **Recoil**：Facebook 出品
- **Jotai**：原子化状态管理

### Vue 生态
- **Vuex**：Vue 官方状态管理
- **Pinia**：Vue 3 推荐的状态库

### 通用
- **XState**：有限状态机
- **Valtio**：基于 Proxy 的状态管理

## 🎯 核心概念

### Store
存储应用状态的地方

### Action
描述状态变化的意图

### Reducer
根据 Action 更新状态的纯函数

### Middleware
在 Action 和 Reducer 之间处理副作用

### Selector
从 Store 中选择特定数据

### Immutable
状态不可直接修改，通过拷贝更新

## ✅ 优缺点对比

### Context API
- ✅ 简单、无需额外依赖
- ❌ 性能问题（大应用）
- ❌ 调试工具缺乏

### Redux
- ✅ 成熟稳定、生态完善
- ✅ 强大的调试工具
- ❌ 样板代码多
- ❌ 学习曲线陡峭

### Zustand
- ✅ 轻量、API 简洁
- ✅ TypeScript 支持好
- ❌ 生态较小
- ❌ 相对较新

## 🎯 选择指南

- **小型项目**：Context API 或 useState
- **中型项目**：Zustand 或 Recoil
- **大型复杂项目**：Redux Toolkit
- **服务器状态**：React Query 或 SWR

## 📚 学习资源

- [Redux 官方文档](https://redux.js.org/)
- [Zustand 文档](https://github.com/pmndrs/zustand)
- [React Query 文档](https://tanstack.com/query/latest)

## 🔗 相关链接

- 在线预览：[State Management Demo](what-is-state-management-demo.html)
- 状态可视化：[Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools)
