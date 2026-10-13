# 小蓝书 · 瀑布流社区

## 原始提示词

见 [完整原始输入](prompt.md)，任务正文对应 `demos/bluebook/prompts/v2/prompt.md`。

## 运行与复盘

- 构建：在本目录执行 `npm ci` 后 `npm run build`（输出 `dist/`）；站点通过 `npm run build:demo -- bluebook--deepseek-v4-pro-0813-high-r01` 生成并提交 `previews/` 下的构建产物。本地开发用 `npm run dev`。
- 实现：React 18 + TypeScript + Tailwind + Zustand 状态管理 + react-lazyload 图片懒加载；搜索栏（logo / 搜索框 / 发布按钮）、两列（移动端）/ 三列（平板）/ 四列（桌面）瀑布流卡片、首屏 20 条滚动自动加载、加载动画、下拉刷新、点赞红心放大缩小动画、图片加载失败默认图、渐入过渡、卡片 hover 上浮与按压效果。
- 数据：mock 数据含不同高度图片（picsum.photos 在线占位图），作者头像使用 i.pravatar.cc，需联网。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--deepseek-v4-pro-0813-high-r01`
- 模型：DeepSeek-V4-Pro-0813；推理档位：high
- 类型：app；预览：build；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：完整原始输入与任务正文 v2 一致，未删改。
- 工具：Claude Code。命令行会话直接执行，未委派子代理；一次生成完整产物。图片使用 picsum.photos 与 i.pravatar.cc 在线占位图，需联网。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：Deepseek 批次合计 4.81 CNY（11 个案例；批次 deepseek-v4-pro-0813-high-2026-10-13；未记录单案例费用）
- [主页面](../../../../previews/bluebook/deepseek-v4-pro-0813-high-r01/index.html)

### 部署适配记录

- 迁移来源：F:/dev/ai-coding-demo-test/demos/bluebook/runs/deepseek-v4-pro-0813-high-r01；保留原始 r01、完整输入快照与测试产物。
- 迁移验收：通过本地 HTTP 入口（Edge 桌面视口）补拍实际运行截图；10 个静态入口另通过 file:// 检查。
- 迁移验收备注：picsum.photos 图片成功加载；i.pravatar.cc 头像请求在自动化浏览器中受跨源响应策略阻止，页面显示原有回退头像；未改写模型产物。
<!-- archive:end -->
