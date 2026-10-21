# YouTube UI 模块 · MiniMax M3.1 Flash

## 原始提示词

见 [完整原始输入](prompt.md)。本轮输入与主题提示词 `v1` 完全一致，未做改写或裁剪。

## 实现说明

- 按任务正文“一个功能输出一个 html”的要求拆分为 5 个文件，每个文件把该功能的所有页面放在各自 mockup 边框内横向排列。
- 图标全部使用 Lucide Static CDN，图片使用 Unsplash，样式由 Tailwind CDN 完成；界面内不出现滚动条。
- 验证：浏览器加载各模块后页面渲染正常，1280×720 画布等比缩放展示，无脚本错误。

## 运行方式

纯静态单文件：直接用浏览器打开本目录入口即可运行，其中 CDN 资源（Tailwind / Three.js / 图标库 / Unsplash）需要联网加载。

## 复盘

- 优点：按功能拆成 5 个模块文件，每个模块内部的页面互不影响，便于分工实现与逐块验收。

- 不足：全部为静态视觉稿，没有真实的路由与数据状态；图表数值均为示意。


## 2026-10-21 迁移复核

本轮来自测试分支提交 `9e5302c3`，在 main 另存为 `minimax-m3-1-flash-max-r03`。原始任务输入与源分支逐字节一致；以上实现说明、验收及复盘是源记录的陈述。维护者仅追加公共统计引用、归档元数据和真实截图，小蓝书另有构建路径适配。

本次截图观察：首页模块截图包含推荐流、Shorts 与观看历史三个独立框，搜索、分类、视频时长、观看进度与元数据具体，照片素材和深色组件统一。采用缩小的桌面宽屏 mockup，文字与图标过小，推荐流存在空封面区域，未形成完整移动 App 导航表达；其他四个模块位于独立入口，不据此宣称缺失或计入本截图。

费用与运行口径由用户补充：供应商 Minimax，工具 Opencode，公测限免；11 个案例整批耗时 2h 14m · 46.7 tok/s，不拆算到单案例。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--minimax-m3-1-flash-max-r03`
- 模型：MiniMax M3.1 Flash；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：完整保存 youtube-ui/v1 任务正文快照，与 demos/youtube-ui/prompts/v1/prompt.md 逐字一致。
- 工具：Opencode。当前会话内以 MiniMax-M3.1-Flash、档位 max 直接生成；仅使用本地 Node 22 与浏览器校验，未委派子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Minimax 批次合计 金额未记录（11 个案例；批次 minimax-m3-1-flash-max-opencode-2026-10-21；未记录单案例费用）
- [首页模块](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-max-r03/home.html)
- [播放模块](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-max-r03/player.html)
- [发现模块](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-max-r03/discover.html)
- [个人中心模块](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-max-r03/profile.html)
- [创作中心模块](../../../../demos/youtube-ui/runs/minimax-m3-1-flash-max-r03/studio.html)

### 部署适配记录

- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base 分支，提交 9e5302c3）中的 demos/youtube-ui/runs/minimax-m3-1-flash-max-r01。本轮 OpenCode 实验在 main 另存为 r03，保留既有 r01/r02；源原始输入、源码、运行说明与复盘保留。
- 维护者于 2026-10-21 为网页入口添加带 defer 的公共 assets/analytics.js 引用；原始输入未修改。
- 维护者于 2026-10-21 在本地 HTTP 中补拍真实桌面截图（1440px 宽；日记与冥想为整页长图），按案例评分规则 v2 和对应任务检查项逐图复核；统计远程请求使用拦截，不发送正式测试访问。
<!-- archive:end -->
