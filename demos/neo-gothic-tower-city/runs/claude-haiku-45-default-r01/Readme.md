# neo-gothic-tower-city

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

### 入口与运行方式

**单 HTML 文件（推荐快速体验）**
- `index.html` - 直接在浏览器中打开，无需安装依赖，Three.js 通过 CDN 加载
- 支持所有现代浏览器 (Chrome, Firefox, Safari, Edge)

**开发服务器**
```bash
npm install
npm run dev
# 访问 http://localhost:3000
```

**生产构建**
```bash
npm install
npm run build
# 输出到 dist/ 文件夹
```

### 交互控制
- 🖱️ 拖动鼠标：旋转视角
- 🔍 滚轮：缩放
- WASD：移动前后左右
- 空格/Shift：上升/下降

### 实现特性清单
✅ 完整的新哥特式城市场景（8个塔楼）
✅ 真实的建筑细节：尖顶、拱形窗户、扶壁、城垛
✅ 交互式摄像机控制（鼠标 + 键盘）
✅ 高质量光照与阴影系统（PCF shadow mapping 2048x2048）
✅ 蓝色水粒子系统（800个粒子）
✅ 橙色火焰粒子系统（400个粒子）
✅ 大气雾效果与自适应环境
✅ 实时 FPS 监控
✅ 响应式设计，支持各种屏幕尺寸
✅ 生产就绪的代码质量

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--claude-haiku-45-default-r01`
- 模型：Claude Haiku 4.5；推理档位：default
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：完整提示词
- 工具：GitHub Copilot Agent。本地 Windows 开发环境；迁移来源模型测试工作树 model-test-base@452ac58，原始运行工具未记录。用户确认实际档位为 default；源目录名和元数据中的 mid 在迁移时规范为 default。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：GitHub Copilot 批次合计 $3.42 USD（12 个案例；原始消耗 598.29 GitHub Copilot credits，换算比例 40 USD / 7000 GitHub Copilot credits；批次 github-copilot-claude-haiku-45-default-2026-10-09；未记录单案例费用）
- [主页](../../../../demos/neo-gothic-tower-city/runs/claude-haiku-45-default-r01/index.html)

### 部署适配记录

- {"type":"generated","summary":"完整实现，包含完整 HTML 和构建项目结构","files":["index.html","package.json","vite.config.js","README.md"]}
- 来源：F:/dev/ai-coding-demo-test 的 model-test-base 分支工作树，HEAD 452ac58；这些测试记录迁移时处于未提交状态。源标识为 neo-gothic-tower-city/runs/claude-haiku-45-mid-r01，依据用户确认将主分支档位和 run ID 规范为 default；输入快照与模型产物按源文件保留。
- 迁入后通过本地 HTTP 页面补拍实际桌面截图 screenshot.png；源输入与模型产物未改写。
<!-- archive:end -->
