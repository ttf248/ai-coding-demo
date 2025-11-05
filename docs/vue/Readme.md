# 什么是 Vue.js？

## 📖 概述

Vue.js（读音 /vjuː/，类似于 view）是一款渐进式 JavaScript 框架，由尤雨溪于 2014 年创建。它是一套用于构建用户界面的渐进式框架，核心库只关注视图层，易于学习，又能轻松集成到其他库或现有项目中。

## 🌟 核心特性

### 1. **渐进式框架**
- 可以逐步集成到项目中
- 不强制要求一次性使用全部功能
- 可以从简单的 jQuery 项目逐步迁移

### 2. **响应式数据绑定**
- 使用 `{{ }}` 进行文本插值
- 自动追踪数据变化并更新 DOM
- 实现数据与视图的双向绑定

### 3. **组件化开发**
- 将页面拆分为可复用的组件
- 每个组件包含自己的模板、样式和逻辑
- 支持组件嵌套和通信

### 4. **虚拟 DOM**
- 使用虚拟 DOM 提高渲染性能
- 智能的 diff 算法只更新必要的 DOM 节点
- 平衡了性能和开发效率

### 5. **指令系统**
- `v-if`、`v-show`：条件渲染
- `v-for`：列表渲染
- `v-model`：双向数据绑定
- `v-on`：事件处理（简写 `@`）

## 🏗️ 项目结构

```
my-vue-app/
├── src/
│   ├── components/     # 组件目录
│   ├── views/         # 页面视图
│   ├── App.vue        # 根组件
│   └── main.js        # 入口文件
├── public/            # 静态资源
└── package.json       # 项目配置
```

## 💻 基本语法

### 1. 模板语法

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p v-if="showMessage">{{ message }}</p>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello Vue',
      showMessage: true,
      items: [
        { id: 1, name: '苹果' },
        { id: 2, name: '香蕉' }
      ]
    }
  },
  methods: {
    handleClick() {
      console.log('按钮被点击')
    }
  }
}
</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>
```

### 2. 组件通信

**父组件传向子组件（Props）**
```vue
<!-- 父组件 -->
<ChildComponent :message="parentMessage" @child-event="handleChild" />

<!-- 子组件 -->
<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  props: ['message'],
  emits: ['child-event']
}
</script>
```

## 🎯 Vue 3 组合式 API

Vue 3 引入了 Composition API，提供更灵活的逻辑复用：

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const count = ref(0)
const double = computed(() => count.value * 2)

// 方法
const increment = () => {
  count.value++
}

// 生命周期
onMounted(() => {
  console.log('组件已挂载')
})
</script>
```

## 📦 核心生态

- **Vue CLI**：官方命令行工具
- **Vue Router**：官方路由管理器
- **Pinia/Vuex**：状态管理库
- **Vue DevTools**：浏览器调试工具
- **Nuxt.js**：基于 Vue 的全栈框架
- **Vite**：新一代构建工具

## 🚀 开发流程

### 1. 创建项目
```bash
npm create vue@latest my-app
cd my-app
npm install
npm run dev
```

### 2. 构建项目
```bash
npm run build
```

### 3. 预览构建结果
```bash
npm run preview
```

## ✅ 优缺点

### 优点
- ✅ 学习曲线平缓，文档清晰
- ✅ 渐进式，可灵活集成
- ✅ 组件化开发，代码复用性强
- ✅ 响应式数据绑定，开发效率高
- ✅ 社区活跃，生态丰富
- ✅ TypeScript 支持完善

### 缺点
- ❌ 灵活性过高可能导致项目结构不统一
- ❌ 生态系统相比 React 较小
- ❌ IE8 以下浏览器不支持

## 🎯 适用场景

- 中小型项目快速开发
- 需要快速迭代的产品
- 已有 jQuery 项目需要现代化改造
- 学习成本要求较低的项目
- 移动端 H5 开发

## 📚 学习资源

- [Vue.js 官方文档](https://cn.vuejs.org/)
- [Vue School](https://vueschool.io/)
- [Vue Mastery](https://www.vuemastery.com/)
- [Vue.js 教程 - 菜鸟教程](https://www.runoob.com/vue2/vue-tutorial.html)

## 🔗 相关链接

- 在线预览：[Vue.js Demo](what-is-vue-demo.html)
- GitHub：[vuejs/core](https://github.com/vuejs/core)
- 官网：[vuejs.org](https://vuejs.org/)
