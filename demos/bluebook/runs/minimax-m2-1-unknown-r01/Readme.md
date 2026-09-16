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

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--minimax-m2-1-unknown-r01`
- 模型：MiniMax M2.1；推理档位：unknown
- 类型：app；预览：build；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：已保留历史文档；后续多轮输入、上下文和参考资料未完整留存。
- 工具：未记录。来自历史实验说明；未记录的设置不作推测。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- [主页面](../../../../previews/bluebook/minimax-m2-1-unknown-r01/index.html)

### 部署适配记录

- V2 归档：构建使用相对 base，静态产物提交至 previews；保留原有依赖与页面逻辑。
- 图片地址使用 Vite BASE_URL，补充 vite/client 类型声明，适配 Pages 子路径。
- 移除原始模板中不存在的 /vite.svg 引用，消除 Pages 404。
<!-- archive:end -->
