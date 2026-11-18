# 小蓝书 · 城市采集簿

[本次输入](prompt.md) · [共用任务正文](../../prompts/v2/prompt.md)

## 运行

运行 npm ci 后用 npm run dev 启动开发服务器。根目录的 build:demo 命令会检查 TypeScript 并生成可静态托管的预览。在推荐页滚动加载下一批笔记，点卡片可阅读或点赞。

## 实现与复盘

20 条笔记起步，按真实照片的宽高估算列高，将新卡片放入当前最短列。筛选和刷新共用 Zustand 状态。本地发布保存在当前页面会话。

## 验证记录

浏览器检查了首次 20 张卡片、滚动追加至 40 张、搜索空结果、卡片详情、点赞数切换、图片故障回退、本地选图发布和下拉刷新。桌面四列、平板三列、手机两列由视口宽度决定。源码经 tsc 检查，提交的 Vite 预览可直接静态托管。

在本地 HTTP 和 390px 视口下检查了已构建的预览。

<details>
<summary>随附照片来源（Unsplash）</summary>

- [village](https://images.unsplash.com/photo-1516483638261-f4dbaf036963)
- [cafe](https://images.unsplash.com/photo-1442512595331-e89e73853f31)
- [architecture](https://images.unsplash.com/photo-1487958449943-2429e8be8625)
- [deer](https://images.unsplash.com/photo-1472396961693-142e6e269027)
- [books](https://images.unsplash.com/photo-1491841550275-ad7854e35ca6)
- [lake](https://images.unsplash.com/photo-1470770841072-f978cf4d019e)
- [city](https://images.unsplash.com/photo-1519501025264-65ba15a82390)
- [food](https://images.unsplash.com/photo-1512621776951-a57141f2eefd)
- [green](https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05)
- [coffee](https://images.unsplash.com/photo-1495474472287-4d71bcdd2085)
- [camera](https://images.unsplash.com/photo-1516035069371-29a1b244cc32)
- [dunes](https://images.unsplash.com/photo-1509316785289-025f5b846b35)
- [forest](https://images.unsplash.com/photo-1448375240586-882707db888b)
- [room](https://images.unsplash.com/photo-1600210492486-724fe5c67fb0)
- [beach](https://images.unsplash.com/photo-1507525428034-b723cf961d3e)
- [alps](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b)
- [night](https://images.unsplash.com/photo-1462331940025-496dfbfc7564)
- [walk](https://images.unsplash.com/photo-1441974231531-c6227db76b6e)
- [field](https://images.unsplash.com/photo-1470252649378-9c29740c9fa8)
- [ocean](https://images.unsplash.com/photo-1518837695005-2083093ee35b)
- [man](https://images.unsplash.com/photo-1500648767791-00dcc994a43e)
- [portrait](https://images.unsplash.com/photo-1494790108377-be9c29b29330)

</details>

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--gpt-6-2-astra-max-r01`
- 模型：GPT-6.2-Astra；推理档位：max
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：保存两条用户消息和本案例读取的完整版本正文。批量实验共享同一会话，本快照未逐条收录其余工具输出和运行时上下文。
- 工具：Codex。按用户提供的信息登记 GPT-6.2-Astra / max。Windows、PowerShell、Node.js 22.16.0。使用当前测试克隆及同一会话，由主代理直接生成。 首次产物生成后的验收期间，用户追加消息「继续」。同一会话继续验证，无人工代写或手工改动。 工具版本由用户提供：Codex v0.169.1。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：OpenAI 批次合计 $8.74 USD（11 个案例；批次 gpt-6-2-astra-max-codex-plus-2026-11-18；未记录单案例费用）
- [主页面](../../../../previews/bluebook/gpt-6-2-astra-max-r01/index.html)

### 部署适配记录

- 首次构建检查发现 react-lazyload 的 prop-types 运行时依赖未解析，补齐独立依赖和锁文件后重新生成静态预览。
- 从 experiment/gpt-6-2-astra-max 的 780cbd8d 导入；首轮提交为 cd9b208b。保留原始输入和测试分支的复盘、素材及验收说明。
- 维护者为网页入口接入公共访问统计脚本。
- 维护者适配源码与构建预览的统计脚本相对路径，并在 main 重建静态预览。
- 维护者移除应用未使用的仓库根目录本地依赖并刷新独立锁文件，避免从项目根目录递归安装。
- 源分支无截图。维护者在 main 采集桌面与移动证据，由 Codex 逐帧按 v3 复核并登记封面。
<!-- archive:end -->
