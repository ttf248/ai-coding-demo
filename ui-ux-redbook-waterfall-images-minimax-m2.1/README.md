# 小蓝书 - 瀑布流图片展示

仿小红书风格的瀑布流图片展示页面。

## 技术栈

- React 18 + TypeScript
- Tailwind CSS
- Zustand (状态管理)
- react-lazyload (图片懒加载)
- Vite (构建工具)

## 功能特性

- 响应式布局：2列(移动端) / 3列(平板) / 4列(桌面端)
- 瀑布流无限滚动加载
- 下拉刷新
- 搜索功能
- 点赞动画效果
- 图片懒加载和加载失败默认图
- 页面切换渐入动画

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
├── images/           # 本地图片资源
├── src/
│   ├── components/   # 组件
│   │   ├── SearchBar.tsx
│   │   ├── Card.tsx
│   │   ├── Waterfall.tsx
│   │   └── Loading.tsx
│   ├── data/         # mock数据
│   ├── store/        # Zustand状态管理
│   ├── types/        # 类型定义
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```
