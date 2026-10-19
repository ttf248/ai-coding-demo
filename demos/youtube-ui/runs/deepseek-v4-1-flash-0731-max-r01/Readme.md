# YouTube UI 参考图 · 首轮

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文 v1 原文快照）。

## 运行与复盘

- 运行方式：DeepSeek-V4.1-Flash-0731（档位 max）在 Claude Code 当前会话直接生成；未使用子代理、未提供后续追问。
- 产物入口：[index.html](index.html)（单文件，联网加载 CDN 素材）。
- 任务正文为通用模板且未附具体 App 需求；按主题登记（YouTube UI 模块）将“视频浏览与播放”实例化为 6 屏参考图。
- 验证记录（Playwright，HTTP 与 file:// 双路径）：
  - 6 屏 mockup（首页/搜索/播放/频道/Shorts/订阅）横向排列、各自独立
  - Tailwind CDN 生效；mockup 边框裁剪内容，界面无滚动条
  - Lucide Static 图标 52/52 加载（unpkg），Unsplash 图片 30/30 加载
  - 375px mockup 宽度；390px 页面无水平溢出；各屏内元素不越界
  - file:// 打开正常（联网），无控制台错误
- 备注：正文要求的“Artifacts 插件预览”在当前环境不可用，改以可直接打开的 HTML 交付；页脚按正文要求给出“是否继续下一个功能”的交互提示。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--deepseek-v4-1-flash-0731-max-r01`
- 模型：DeepSeek-V4.1-Flash-0731；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：任务正文 v1 原文。单次输入，未附后续追问或其他上下文。
- 工具：Claude Code 2.1.295。用户指定模型 DeepSeek-V4.1-Flash-0731、档位 max；当前会话直接生成，未使用子代理；Windows 11 / Node v22.16.0。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 2.78 CNY（11 个案例；批次 deepseek-v4-1-flash-0731-max-2026-10-13；未记录单案例费用）
- [主页面](../../../../demos/youtube-ui/runs/deepseek-v4-1-flash-0731-max-r01/index.html)

### 部署适配记录

- Tailwind / Lucide Static / Unsplash 经 CDN 加载，需联网查看。
- 迁移来源：F:/dev/ai-coding-demo-test/demos/youtube-ui/runs/deepseek-v4-1-flash-max-r01；保留原始 r01、完整输入快照与测试产物。
- 迁移验收：通过本地 HTTP 打开实际入口并补拍桌面截图；390px 检查无页面横向溢出，Playwright 控制台无页面错误。
- 模型与实验目录标识按用户确认更新为 DeepSeek-V4.1-Flash-0731；历史输入、评分、产物与迁移来源保留。
<!-- archive:end -->
