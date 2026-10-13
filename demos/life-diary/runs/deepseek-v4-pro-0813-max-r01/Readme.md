# AI 情绪日记与生活助手 APP 原型

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与验证

- 入口：`index.html`（将源入口 `canghe_app_prototype.html` 原样改名，任务正文与原始提示词保留原文件名要求）。Tailwind CSS、Font Awesome 与图片（Unsplash）来自 CDN，需联网；`file://` 直接打开与 HTTP 托管均可。
- 内容：情绪打卡、日记编辑（含 AI 情绪分析卡片）、回顾时间线、AI 对话伙伴、生活助手、我的共六个页面，375pt iPhone 边框同页横向排列；暖色治愈风格；界面可直接作为开发参考。
- 产品规划说明：以“情绪记录 → AI 分析 → 生活建议”为核心闭环，辅以习惯打卡与数据回顾。

### 验收记录（Playwright Chromium，file:// 加载，2026-10-14）

- 390px 视口无页面水平溢出 ✓；6 个 mockup 页面齐全 ✓
- Tailwind CDN、Font Awesome（伪元素字体）与 Unsplash 图片加载 ✓；无 JS 错误 ✓

## 复盘

- 按任务正文的“产品经理视角规划功能、设计师视角输出 UI/UX”两步执行：先定义信息架构（打卡/编辑/回顾/AI 对话/生活助手/我的），再统一视觉（奶油底 + 暖橙主色 + 圆角卡片）。
- 源实验按任务正文使用 `canghe_app_prototype.html`；迁移时为符合本站入口规范改名为 `index.html`，文件内容未作修改（见 run.json changes）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--deepseek-v4-pro-0813-max-r01`
- 模型：DeepSeek-V4-Pro-0813；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：完整输入快照：用户总体指令（批量执行全部案例、模型名 DeepSeek-V4-Pro-0813、档位 max、使用当前会话）+ 任务正文 v1 逐字原文。会话未另开、未委派子代理。
- 工具：claude-code。Claude Code CLI 会话（Windows 11），用户指定模型名称为 DeepSeek-V4-Pro-0813；会话环境自报模型字符串 deepseek-v4-pro[1m]。推理档位 max（/effort 已设 max）。验收用 Playwright Chromium 加载 file:// 页面执行（390px 视口与桌面视口）。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 13.77 CNY（11 个案例；批次 deepseek-v4-pro-0813-max-2026-10-14；未记录单案例费用）
- [APP 原型](../../../../demos/life-diary/runs/deepseek-v4-pro-0813-max-r01/index.html)

### 部署适配记录

- 源实验按任务正文使用 canghe_app_prototype.html；迁移时为符合本站入口规范改名为 index.html，文件内容未修改，原始提示词保留源要求。
- 迁移来源：F:/dev/ai-coding-demo-test/demos/life-diary/runs/deepseek-v4-pro-0813-max-r01（分支 experiment/deepseek-v4-pro-0813，提交 90de279）；保留源实验的已测试代码、完整输入快照与复盘记录。
- 迁移验收：通过本地 HTTP 页面补拍 1440×960 Edge 桌面截图；入口返回 HTTP 200、无页面脚本异常，390px 视口未发现页面横向溢出。
<!-- archive:end -->
