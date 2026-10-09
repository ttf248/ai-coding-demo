# life-diary

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

### 功能特性

✅ **完整的单页应用（SPA）**
- 6个功能完整的页面
- 流畅的页面切换动画
- iPhone 375px标准尺寸响应式设计

✅ **核心功能**
1. **首页/仪表板** - 情绪概览、快捷操作、最近记录
2. **日记编写** - 支持情绪选择、强度调节、活动标签、内容输入
3. **日历视图** - 月份导航、日记标记、日期查询
4. **数据分析** - 周趋势图表、情绪分布统计、关键指标展示
5. **AI建议** - 对话界面、智能建议、心理支持
6. **设置页面** - 用户资料、通知、隐私、主题、数据导出

✅ **技术实现**
- **前端框架** - Tailwind CSS + 原生JavaScript
- **数据存储** - localStorage（本地存储，无需后端）
- **UI库** - Font Awesome图标库
- **交互** - 完整的表单验证、日期计算、数据管理

✅ **用户体验**
- 实时时间问候语
- 丰富的emoji表情情绪选择
- 强度滑块调节
- 活动标签快速选择
- 图表数据可视化
- 数据导出功能

### 如何使用

1. **直接打开** - 在浏览器中打开 `index.html` 文件
   ```
   file:///f:/dev/ai-coding-demo-test/demos/life-diary/runs/claude-haiku-45-mid-r01/index.html
   ```

2. **功能体验**
   - 点击底部导航栏切换不同页面
   - 在日记页面输入内容、选择情绪、保存日记
   - 查看日历、统计数据和AI建议
   - 所有数据自动保存在浏览器本地

3. **数据持久化**
   - 所有日记数据存储在 localStorage
   - 刷新页面数据不丢失
   - 可从设置页面导出数据为JSON文件

### 技术栈

| 技术 | 用途 |
|------|------|
| HTML5 | 页面结构 |
| Tailwind CSS | 样式系统（通过CDN） |
| JavaScript | 交互逻辑、数据管理 |
| Font Awesome | 图标库 |
| localStorage | 数据持久化 |

### 页面清单

```
1. 首页 (Home)
   - 问候语动态更新
   - 今日情绪卡片
   - 快捷操作栅栏
   - 最近记录列表

2. 日记编写 (Diary)
   - 日期时间选择
   - 5种情绪选择（😢😠😐😊😍）
   - 情绪强度滑块（1-10）
   - 活动标签选择
   - 日记内容编辑器
   - 保存/取消按钮

3. 日历 (History)
   - 月份导航（上/下月）
   - 日历网格显示
   - 有日记的日期高亮
   - 日期点击查询
   - 最近日记列表

4. 统计分析 (Stats)
   - 本周情绪趋势图表
   - 情绪分布饼图数据
   - 本月统计数据（记录数、连续天数等）
   - 常见活动统计

5. AI建议 (AI)
   - 欢迎界面
   - 聊天对话框
   - 智能建议卡片
   - 消息输入框

6. 设置 (Settings)
   - 用户资料编辑
   - 通知设置（每日提醒、周末休息）
   - 隐私设置（本地保存、云端同步）
   - 主题选择（浅色/深色）
   - 应用版本和更新信息
   - 数据导出和重置功能
```

### 文件大小和性能

- **总大小** - 54.41 KB
- **资源依赖** - Tailwind CSS和Font Awesome通过CDN加载
- **加载速度** - 首次加载取决于CDN速度，后续完全离线可用
- **浏览器支持** - 现代浏览器（Chrome、Firefox、Safari、Edge）

### 扩展建议

1. **后端集成** - 连接真实API保存和同步数据
2. **PWA化** - 添加 Service Worker 实现离线使用
3. **云存储** - 集成云服务（Firebase、Supabase等）
4. **AI集成** - 接入真实AI模型提供个性化建议
5. **社交功能** - 添加分享、好友互动等社交特性
6. **通知系统** - Web Push通知提醒功能
7. **图表库** - 升级为 Chart.js 等专业图表库

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--claude-haiku-45-default-r01`
- 模型：Claude Haiku 4.5；推理档位：default
- 类型：app；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：完整提示词
- 工具：copilot-cli。单文件前端应用，无需构建；迁移来源模型测试工作树 model-test-base@452ac58，原始运行工具未记录。用户确认实际档位为 default；源目录名和元数据中的 mid 在迁移时规范为 default。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：GitHub Copilot 批次合计 $3.42 USD（12 个案例；原始消耗 598.29 GitHub Copilot credits，换算比例 40 USD / 7000 GitHub Copilot credits；批次 github-copilot-claude-haiku-45-default-2026-10-09；未记录单案例费用）
- [主页](../../../../demos/life-diary/runs/claude-haiku-45-default-r01/index.html)

### 部署适配记录

- {"file":"index.html","type":"create","size":"54.41 KB","description":"完整的SPA应用，包含6个页面、完整交互和数据持久化"}
- 来源：F:/dev/ai-coding-demo-test 的 model-test-base 分支工作树，HEAD 452ac58；这些测试记录迁移时处于未提交状态。源标识为 life-diary/runs/claude-haiku-45-mid-r01，依据用户确认将主分支档位和 run ID 规范为 default；输入快照与模型产物按源文件保留。
- 迁入后通过本地 HTTP 页面补拍实际桌面截图 screenshot.png；源输入与模型产物未改写。
<!-- archive:end -->
<!-- archive:end -->
