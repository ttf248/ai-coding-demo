# 冥想 iOS App 原型

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文 v1）。

## 运行与复盘

- 运行方式：浏览器直接打开本目录 `index.html`（file:// 或 HTTP 静态托管均可）。依赖 CDN（Tailwind、FontAwesome）与 Unsplash 图片，需联网，非离线。
- 入口：`index.html`（单文件含全部原型界面）。
- 实现要点：
  - 产品规划：围绕冥想真实场景（减压 / 助眠 / 专注 / 正念习惯 / 情绪管理）组织功能，主线「今日推荐 → 沉浸练习 → 看见成长」。
  - 共 12 屏、5 条流程：A 入门（目标引导/今日首页）、B 冥想（探索库/课程详情/沉浸播放器）、C 睡眠呼吸（睡眠/呼吸练习/白噪音混合）、D 专注成长（专注计时器/练习统计）、E 个人（我的/订阅 Plus）。
  - 每屏 375×812pt iPhone 框，含状态栏与 Home 指示条；主流程页带 Tab Bar（今日/探索/睡眠/我的）。
  - 设计系统：深海青品牌色 + 夜海沉浸深色 + 雾紫/暖沙/薄荷辅助；功能页浅底、沉浸页（播放/睡眠/呼吸/专注/订阅）深色，统一字体层级与圆角。
  - 全部用 Tailwind 原子类（自定义色板/呼吸·涟漪·漂浮动画经 tailwind.config 注入），图表用内联 SVG（环形倒计时/柱状），图标 FontAwesome，配图 Unsplash。
  - 交互态完整：课程目录完成/当前/锁定三态、情绪选中、套餐高亮、Tab 高亮、呼吸圆缩放与封面漂浮/涟漪动效。
- 验证记录（2026-11-13，Qoder Desktop 内置浏览器，HTTP 打开，脚本断言）：
  - 12 个手机框 / 12 个 figure、5 个流程 section 全部渲染。✔
  - Tailwind 生效（teal-500 计算值 rgb(47,109,122)=#2F6D7A）；FontAwesome 字体族加载。✔
  - 13 张 Unsplash 图片全部 complete 且 naturalWidth>0。✔
  - 控制台仅 Tailwind CDN 生产环境提示（原型预期），无报错。✔
  - 内置浏览器视口 0×0，390px 与真机视觉留待 Playwright 复核；本原型为桌面画布平铺多屏，手机框固定 375pt。
- 复盘：冥想 App 的「沉浸感」靠深色夜海渐变 + 大圆角 + 呼吸/涟漪动效营造，功能页则保持浅底清爽，两者用同一套令牌切换。课程目录的三态（完成/当前/锁定）与订阅套餐高亮是「可直接开发」的关键细节。CDN 依赖标 network=required。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`meditation--qwen4-max-preview-xhigh-r01`
- 模型：Qwen4-Max-Preview；推理档位：xhigh
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=meditation)
- 输入记录：批量指令原文与任务正文 v1 原文完整保存；同指令重复发送 3 次，内容一致。
- 工具：Qoder Desktop。当前会话直接执行；模型 Qwen4-Max-Preview，档位 xhigh；Windows 11，Node v24.22.1；未委派子代理。 用户确认供应商 aliyun、工具 qoder，整批 11 例耗时 1h 20s（3620 秒），费用与 Token 未提供，不分摊；其他执行条件为源声明。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：aliyun 批次合计 金额未记录（11 个案例；批次 qwen4-max-preview-xhigh-qoder-2026-11-13；未记录单案例费用）
- [静屿冥想 App 原型（12 屏）](../../../../demos/meditation/runs/qwen4-max-preview-xhigh-r01/index.html)

### 部署适配记录

- 2026-11-13：从 F:/dev/ai-coding-demo-test 未提交结果迁入，源基准提交 452ac588702d3bde24f048fcf47cc5ffa7abb602；保留原始输入与复盘，不合并测试基线。
- 2026-11-13：追加 defer 公共统计引用，补采真实截图，按 v3 由 Codex 逐图视觉复核；源声明不等于独立功能验收。
- 2026-11-13：本次视觉复核边界：Codex 逐图 AI 视觉复核，仅评价归档可见证据；非人工完整功能验收或模型能力排名。 静态多屏设计原型，补拍滚动展开实际页面，不证明业务流程可执行。
- 2026-11-13：根路径与 Pages 子路径全部入口、原始输入、截图、对比 iframe、390px 无页面水平溢出及静态 file:// 检查完成；细项见 catalog/score-reviews/2026-11-13-qwen4-max-preview-xhigh-import.json。
<!-- archive:end -->
