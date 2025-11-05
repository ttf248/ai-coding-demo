# 小蓝书 - 瀑布流图片展示

一个仿小红书的瀑布流图片展示页面，使用 React 18 + TypeScript 开发。

## 功能特性

- ✨ 响应式瀑布流布局（移动端2列、平板3列、桌面4列）
- 🖼️ 图片懒加载优化
- ❤️ 点赞功能与动画效果
- 🔍 顶部搜索栏
- 📱 移动端优化
- 🎨 清新简洁的 UI 设计
- 🔄 无限滚动加载
- ✨ 流畅的动画效果

## 技术栈

- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Zustand** - 状态管理
- **react-lazyload** - 图片懒加载
- **Lucide React** - 图标库

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
├── public/
│   └── images/             # 图片资源（35张）
├── src/
│   ├── components/         # 组件目录
│   │   ├── SearchBar.tsx   # 搜索栏组件
│   │   ├── WaterfallGrid.tsx # 瀑布流网格组件
│   │   ├── PostCard.tsx    # 帖子卡片组件
│   │   └── LoadingSpinner.tsx # 加载动画组件
│   ├── store/              # 状态管理
│   │   └── useStore.ts     # Zustand store
│   ├── data/               # 数据层
│   │   └── mockData.ts     # Mock 数据
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # 应用入口
│   └── index.css           # 全局样式
├── index.html              # HTML 模板
├── vite.config.ts          # Vite 配置
├── tailwind.config.js      # Tailwind 配置
└── tsconfig.json           # TypeScript 配置
```

## 设计亮点

1. **响应式布局**：根据屏幕尺寸自动调整列数
2. **懒加载**：图片进入视口时才开始加载，提升性能
3. **交互动画**：
   - 卡片hover上浮效果
   - 点击按压反馈
   - 点赞红心放大缩小动画
4. **文字头像**：根据用户名首字母生成彩色圆形头像
5. **图片容错**：图片加载失败时显示友好提示

## 主题色

- 主色调：#fe2c55（小红书红）
- 背景色：#f5f5f5
- 卡片背景：纯白色，圆角 8px

## 浏览器支持

- Chrome (>=88)
- Firefox (>=85)
- Safari (>=14)
- Edge (>=88)

## 许可证

MIT
