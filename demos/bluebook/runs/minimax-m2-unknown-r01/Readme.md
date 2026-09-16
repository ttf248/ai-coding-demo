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

## 图片资源管理

**Q: 构建时图片文件是如何自动拷贝到 dist 目录的？**

**A:** 通过 Vite 配置实现（vite.config.ts:6-17）：

```typescript
build: {
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif'],
  rollupOptions: {
    output: {
      assetFileNames: (assetInfo) => {
        if (assetInfo.name && /\.(jpg|jpeg|png|gif)$/i.test(assetInfo.name)) {
          return 'images/[name][extname]'  // 图片输出到 dist/images/
        }
        return 'assets/[name]-[hash][extname]'  // 其他资源带hash
      }
    }
  }
}
```

**效果：** `public/images/1.jpg` → `dist/images/1.jpg`（自动拷贝，保持原名）

---

**Q: 瀑布流布局是如何实现的？**

**A:** 使用 CSS `columns` 属性（WaterfallGrid.tsx:59）：

```jsx
<div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
  {posts.map((post) => (
    <PostCard key={post.id} post={post} />
  ))}
</div>
```

**原理：** 响应式列数 - 移动端2列、平板3列、桌面4列，CSS自动排列内容。

---

**Q: 无限滚动是如何实现的？**

**A:** 使用 `IntersectionObserver` 监听底部元素（WaterfallGrid.tsx:16-31）：

```typescript
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      const firstEntry = entries[0]
      if (firstEntry.isIntersecting && !loading && hasMore) {
        loadMorePosts()
      }
    },
    { threshold: 0.1 }
  )

  if (loaderRef.current) {
    observer.observe(loaderRef.current)
  }

  return () => observer.disconnect()
}, [loading, hasMore, page])
```

**效果：** 当底部加载指示器进入视口时自动加载下一页数据。

---

**Q: 文字头像是如何生成的？**

**A:** 基于用户ID生成彩色圆形头像（PostCard.tsx:26-27）：

```typescript
const DEFAULT_AVATAR_COLORS = [
  'bg-red-100', 'bg-blue-100', 'bg-yellow-100',
  'bg-green-100', 'bg-purple-100', 'bg-pink-100',
  'bg-indigo-100',
]

const avatarColor = DEFAULT_AVATAR_COLORS[post.id % DEFAULT_AVATAR_COLORS.length]
const avatarText = post.author.charAt(0)  // 取用户名首字母
```

**效果：** 8种颜色循环 + 姓氏首字母，无需外部头像图片。

---

**Q: 点赞动画是如何实现的？**

**A:** CSS Keyframes + 状态控制（tailwind.config.js:22-27 + PostCard.tsx:83-86）：

```typescript
// 1. 定义动画（tailwind.config.js）
'heart-beat': 'heartBeat 0.6s ease-in-out'
heartBeat: {
  '0%': { transform: 'scale(1)' },
  '25%': { transform: 'scale(1.3)' },  // 放大
  '50%': { transform: 'scale(1)' },    // 还原
  '100%': { transform: 'scale(1)' },
}

// 2. 应用动画（PostCard.tsx）
<Heart className={`heart ${showHeartAnimation ? 'animate-heart-beat' : ''}`} />
```

**效果：** 点击红心 → 放大1.3倍 → 回到原大小，持续0.6秒。

---

**Q: 图片懒加载是如何实现的？**

**A:** 使用 `react-lazyload` 库（PostCard.tsx:48-62）：

```jsx
<LazyLoad height={200} offset={100}>
  {!imageError ? (
    <img
      src={post.imageUrl}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  ) : (
    <div className="fallback">图片加载失败</div>
  )}
</LazyLoad>
```

**配置：** 高度200px预加载，提前100px开始加载，失败时显示提示。

## 许可证

MIT

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--minimax-m2-unknown-r01`
- 模型：MiniMaxi M2；推理档位：unknown
- 类型：app；预览：build；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：已保留历史文档；后续多轮输入、上下文和参考资料未完整留存。
- 工具：未记录。来自历史实验说明；未记录的设置不作推测。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- [主页面](../../../../previews/bluebook/minimax-m2-unknown-r01/index.html)

### 部署适配记录

- V2 归档：构建使用相对 base，静态产物提交至 previews；保留原有依赖与页面逻辑。
- 图片地址使用 Vite BASE_URL，补充 vite/client 类型声明，适配 Pages 子路径。
- 移除原始模板中不存在的 /vite.svg 引用，消除 Pages 404。
<!-- archive:end -->
