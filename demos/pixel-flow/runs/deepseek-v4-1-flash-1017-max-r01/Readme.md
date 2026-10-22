# Pixel Flow

## 原始输入

- 完整原始输入：[prompt.md](prompt.md)
- 任务正文版本：[v1](../../prompts/v1/prompt.md)。

## 实现说明

- 单文件应用，入口 [index.html](index.html)；Three.js r160 与 MediaPipe Hands/Camera Utils/Drawing Utils 从 CDN 加载，需联网。
- 图片：本地文件上传或拖放；Canvas 提取像素，按采样步长生成粒子；每颗粒子保存目标位置、颜色和随机种子。内置程序化示例图保证首屏可用。
- 粒子：Three.js Points + 圆形 sprite；初始随机散布，支持密度、吸引范围、吸引力、重新散开、重置。
- 手势：MediaPipe 检测单手；张开手掌 ≥3 指激活力场，握拳暂停；手部掌心映射到场景坐标，力场内的粒子加速向原图位置聚拢，带切向旋流和全局轻微吸引。
- 回退：摄像头不可用、权限被拒、MediaPipe 加载失败或 iframe 权限限制时，自动切换为鼠标/触控模式——按住画面拖动即可吸引粒子，并保留“开启摄像头”重试。
- 摄像头画面在侧栏镜像显示，手部关键点覆盖层与视频对齐；进度环按粒子接近目标的比例计算。

## 验证记录

- Playwright（无摄像头环境）：加载无页面错误；内置示例生成 25,600 个粒子；摄像头错误被捕获并回退为指针模式。
- 按住并绕圈拖动约 1.8 秒后还原进度达到 75%，标题显示“图像正在浮现”；`__pixelFlow.restoreAll()` 可验证 100%。
- 采样步长、吸引半径/力度、重新散开、重置和上传控件均绑定到实际粒子状态。
- 390px 无页面水平溢出。

## 复盘

- 首次引力参数偏弱，粒子在一个短拖动内几乎不动；将默认力度提升到 5.2、范围 1.35，并提高局部/全局拉力后，短时手势即可看到明显聚拢。
- 手部覆盖层最初同时被 CSS 和 Canvas 上下文镜像，造成双重镜像；已改为只在 Canvas 绘制时镜像，与镜像视频对齐。
- 摄像头需要 HTTPS 或 localhost；在普通 iframe 中可能被 Permissions Policy 阻止，因此保留指针回退而不把失败当作错误。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--deepseek-v4-1-flash-1017-max-r01`
- 模型：DeepSeek-V4.1-Flash-1017；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：包含用户会话指令与任务正文原文；任务正文未改写。 任务正文版本 v1。
- 工具：Claude Code / DeepSeek-V4.1-Flash-1017。当前 Claude Code 会话直接执行，未委派子代理；Windows 11 + Node 22.16.0；模型与档位由用户指定。使用本地 HTTP 静态服务器与 Playwright/Chromium（WebGL 软件光栅器）做加载、交互与 390px 溢出检查；软件光栅器帧率不代表硬件 GPU 表现。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：deepseek 批次合计 4.46 CNY（11 个案例；批次 deepseek-v4-1-flash-1017-max-2026-10-19；未记录单案例费用）
- [主页面](../../../../demos/pixel-flow/runs/deepseek-v4-1-flash-1017-max-r01/index.html)

### 部署适配记录

- 自查修复：手部覆盖层与镜像视频对齐；摄像头画幅改为 4:3；状态更新按状态键节流；默认示例图与指针模式保证无摄像头时仍可用。
- MediaPipe 或摄像头不可用时自动回退到鼠标/触控按住吸引，并保留手势模式重试入口。
- 自查修复：默认引力提升到 5.2、范围 1.35、粒子尺寸增大；Playwright 按住拖动约 1.8 秒可达到 75% 还原。
- 2026-10-19 从 F:/dev/ai-coding-demo-test 的 experiment/deepseek-v4-1-flash-1017 分支未提交工作区导入本轮 max 档结果；基线提交 452ac58，文件来源指纹见 docs/imports/2026-10-19-deepseek-1017-max.json；未覆盖历史实验。
- 迁移维护者为全部 HTML 入口添加带 defer 的公共 assets/analytics.js 引用；小蓝书配置适配 previews 路径并重新构建。
- 源记录没有截图；迁移时补拍真实桌面页面并按当前 v2 规则逐图复核。费用 ¥4.46、92,462,698 Tokens 与耗时 59m 52s 为用户提供的整批 11 个案例合计，不拆分到单案例。
- 迁移补拍：Chromium 1440×960、deviceScaleFactor=1；内置示例图经鼠标按住拖动吸引，未接入真实摄像头。截图页面 index.html，远程统计请求被拦截；软件 WebGL 不作为硬件性能证据。
- 迁移补拍复核：通过实际范围/力度控件设为 2.2/10，按住画布中央 11 秒吸引内置示例图；无真实摄像头或手势；保留初次拖动截图。Chromium 1440×960，拦截远程统计；按新截图重新评价。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
