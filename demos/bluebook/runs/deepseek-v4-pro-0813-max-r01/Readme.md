# 小蓝书 · 瀑布流社区

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与验证

- 构建型前端：本目录 `npm ci && npm run build`；站点预览为已提交的构建产物 `previews/bluebook/deepseek-v4-pro-0813-max-r01/`（`npm run build:demo -- bluebook--deepseek-v4-pro-0813-max-r01` 从仓库根目录重建）。
- 技术栈：React 18 + TypeScript + Vite，Tailwind CSS，Zustand，react-lazyload；主色 #fe2c55、页面背景 #f5f5f5、白色圆角卡片。
- 功能：顶部搜索栏（「小蓝书」logo / 带图标搜索框 / 发布按钮）；瀑布流移动端 2 列、平板 3 列、桌面 4 列；卡片含错落高度图片（懒加载）、两行截断标题、圆形头像昵称、红心点赞（放大再缩小动画）；hover 上浮加深阴影、点击按压；首屏 20 条、滚动到底自动加载（loading 动画）、下拉刷新、图片失败默认图、渐入切换；mock 数据确定性生成。
- 依赖说明：react-lazyload@3.2.0 peer 未声明 React 18，package.json 用 overrides 指向本项目 react/react-dom，并显式补充 prop-types 依赖（见 run.json changes）。

### 验收记录（Playwright Chromium，HTTP 加载构建产物，2026-10-14）

- 首屏 20 条；logo / 发布按钮 / 搜索框 placeholder 正确 ✓
- 滚动到底自动加载到 40 条（loading 指示出现）✓
- 点赞 +1 且红心填充、取消点赞还原 ✓
- 搜索「咖啡」过滤出子集并显示条数；无结果提示 ✓
- 拦截图片请求后显示默认图（fallback）✓
- TouchEvent 模拟下拉刷新后列表重置为 20 条且数据确定性一致 ✓
- 桌面 4 列 / 平板 3 列 / 移动 2 列响应式 ✓；390px 无水平溢出 ✓；无 JS 错误 ✓

## 复盘

- 按任务正文拆分组件（Header / Waterfall / Card）与 store，搜索在 120 条确定性数据集上过滤（标题/作者/标签），刷新与翻页共用同一 mock 生成器保证可重复。
- 构建期修复三处依赖问题（见 run.json changes）：react-lazyload 的 peer 版本、缺失的 prop-types、以及 picsum 图片源的跨域策略兼容。
- 已知简化：mock 图片在 20 张 Unsplash 直链中确定性循环（高度字段由生成器给出错落值）；下拉刷新仅处理触摸拖动（桌面端可通过重新加载模拟）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--deepseek-v4-pro-0813-max-r01`
- 模型：DeepSeek-V4-Pro-0813；推理档位：max
- 类型：app；预览：build；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：完整输入快照：用户总体指令（批量执行全部案例、模型名 DeepSeek-V4-Pro-0813、档位 max、使用当前会话）+ 任务正文 v2 逐字原文。会话未另开、未委派子代理。
- 工具：claude-code。Claude Code CLI 会话（Windows 11），用户指定模型名称为 DeepSeek-V4-Pro-0813；会话环境自报模型字符串 deepseek-v4-pro[1m]。推理档位 max（/effort 已设 max）。依赖安装与构建在实验目录内执行（npm install 生成独立 lockfile），验收用 Playwright Chromium 对构建产物 previews 目录加载执行。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：Deepseek 批次合计 13.77 CNY（11 个案例；批次 deepseek-v4-pro-0813-max-2026-10-14；未记录单案例费用）
- [主页面](../../../../previews/bluebook/deepseek-v4-pro-0813-max-r01/index.html)

### 部署适配记录

- 首次生成后调整：react-lazyload@3.2.0 的 peerDependencies 未声明 React 18，npm 严格解析失败；在 package.json 增加 overrides 把其 react/react-dom peer 指向本项目版本，保证 npm ci 可复现。
- 首次生成后调整：react-lazyload 运行时依赖 prop-types 未随包安装（其声明为 peer），构建产物运行时报无法解析模块；将 prop-types@15.8.1 补充为直接依赖。
- 首次生成后调整：mock 图片源由 picsum.photos 换为 images.unsplash.com 直链——picsum 的跨域资源策略在部分环境被拦截导致全部图片失败；Unsplash 直链稳定可用，仍按确定性序列循环生成不同图片。
- 迁移来源：F:/dev/ai-coding-demo-test/demos/bluebook/runs/deepseek-v4-pro-0813-max-r01（分支 experiment/deepseek-v4-pro-0813，提交 90de279）；保留源实验的已测试代码、完整输入快照与复盘记录。
- 迁移验收：通过本地 HTTP 页面补拍 1440×960 Edge 桌面截图；入口返回 HTTP 200、无页面脚本异常，390px 视口未发现页面横向溢出。
- 迁移验收备注：mock 照片正常加载；i.pravatar.cc 头像请求被浏览器 Same-Origin 响应策略阻止，展示页面自带回退头像，未修改模型产物。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
