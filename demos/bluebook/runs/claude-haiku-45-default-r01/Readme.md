# bluebook

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

### 项目描述

一个仿小红书的现代瀑布流图片展示应用，采用 React 18 + TypeScript + Tailwind CSS 开发。

### 核心功能

- 📱 响应式瀑布流布局（2/3/4 列自适应）
- 🔄 下拉刷新与无限滚动加载
- ❤️ 互动点赞系统与脉冲动画
- 🔍 顶部搜索栏和发布功能
- ⚡ 图片加载失败处理和骨架屏

### 启动方式

```bash
npm install
npm run dev
```

访问 http://localhost:5173

### 验证检查

- ✅ 响应式布局正常工作
- ✅ 下拉刷新功能可用
- ✅ 无限滚动自动加载
- ✅ 点赞动画流畅
- ✅ 所有图片加载失败有降级处理
- ✅ 触摸设备上交互正常

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--claude-haiku-45-default-r01`
- 模型：Claude Haiku 4.5；推理档位：default
- 类型：app；预览：build；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：完整提示词
- 工具：未记录。迁移来源模型测试工作树 model-test-base@452ac58，原始运行工具未记录。用户确认实际档位为 default；源目录名和元数据中的 mid 在迁移时规范为 default。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：GitHub Copilot 批次合计 $3.42 USD（12 个案例；原始消耗 598.29 GitHub Copilot credits，换算比例 40 USD / 7000 GitHub Copilot credits；批次 github-copilot-claude-haiku-45-default-2026-10-09；未记录单案例费用）
- [主页](../../../../previews/bluebook/claude-haiku-45-default-r01/index.html)

### 部署适配记录

- 来源：F:/dev/ai-coding-demo-test 的 model-test-base 分支工作树，HEAD 452ac58；这些测试记录迁移时处于未提交状态。源标识为 bluebook/runs/claude-haiku-45-mid-r01，依据用户确认将主分支档位和 run ID 规范为 default；输入快照与模型产物按源文件保留。
- 迁入后通过本地 HTTP 页面补拍实际桌面截图 screenshot.png；源输入与模型产物未改写。
- 部署修复：移除模型产物中指向不存在的 Vite 默认图标的引用，避免静态校验与子路径预览出现 404。
<!-- archive:end -->
