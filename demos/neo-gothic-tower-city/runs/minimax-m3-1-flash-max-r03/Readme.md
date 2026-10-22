# 新哥特式塔楼城市 · MiniMax M3.1 Flash

## 原始提示词

见 [完整原始输入](prompt.md)。本轮输入与主题提示词 `v1` 完全一致，未做改写或裁剪。

## 实现说明

- 支持拖拽环视、滚轮缩放、WASD 地面漫游、空格切换昼夜、1-4 预设机位，闲置 3 秒后自动环绕。
- 海面为自定义着色器波浪并与地平线颜色混合，火焰与飞灰使用加法混合的 Points 粒子。
- 验证：浏览器加载后 3D 场景正常渲染，帧率与体素计数正常显示，无脚本错误。

## 运行方式

纯静态单文件：直接用浏览器打开本目录入口即可运行，其中 CDN 资源（Tailwind / Three.js / 图标库 / Unsplash）需要联网加载。

## 复盘

- 优点：把“待确认”的素材缺口显式列出，同时把可实现的部分全部完成，符合任务正文的推进方式。

- 不足：石材与玫瑰窗仍以程序化几何替代真实贴图，塔楼数量有限；移动端在低性能设备上需要降低阴影分辨率。


## 2026-10-21 迁移复核

本轮来自测试分支提交 `9e5302c3`，在 main 另存为 `minimax-m3-1-flash-max-r03`。原始任务输入与源分支逐字节一致；以上实现说明、验收及复盘是源记录的陈述。维护者仅追加公共统计引用、归档元数据和真实截图，小蓝书另有构建路径适配。

本次截图观察：日间场景可见中央双塔、尖顶、扶壁状构件、圆窗和周围塔楼，海浪、平台灯柱及漫游键位清楚。外围塔楼孤立于水面，缺少清晰街巷与桥梁联系；窗饰和外墙重复简化，近景塔楼被画框裁切，城市空间与建筑精细度不足。不从 HUD 数字判断真实比例或性能。

费用与运行口径由用户补充：供应商 Minimax，工具 Opencode，公测限免；11 个案例整批耗时 2h 14m · 46.7 tok/s，不拆算到单案例。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--minimax-m3-1-flash-max-r03`
- 模型：MiniMax M3.1 Flash；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：完整保存 neo-gothic-tower-city/v1 任务正文快照，与 demos/neo-gothic-tower-city/prompts/v1/prompt.md 逐字一致。
- 工具：Opencode。当前会话内以 MiniMax-M3.1-Flash、档位 max 直接生成；仅使用本地 Node 22 与浏览器校验，未委派子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Minimax 批次合计 金额未记录（11 个案例；批次 minimax-m3-1-flash-max-opencode-2026-10-21；未记录单案例费用）
- [塔楼城市](../../../../demos/neo-gothic-tower-city/runs/minimax-m3-1-flash-max-r03/index.html)

### 部署适配记录

- 按任务正文要求把缺失素材标为『待确认』，在页面左下角列出素材与环境清单，同时继续完成全部可实现部分。
- Three.js 使用 unpkg CDN（r160），需要联网加载；几何体、材质与贴图全部由代码生成。
- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base 分支，提交 9e5302c3）中的 demos/neo-gothic-tower-city/runs/minimax-m3-1-flash-max-r01。本轮 OpenCode 实验在 main 另存为 r03，保留既有 r01/r02；源原始输入、源码、运行说明与复盘保留。
- 维护者于 2026-10-21 为网页入口添加带 defer 的公共 assets/analytics.js 引用；原始输入未修改。
- 维护者于 2026-10-21 在本地 HTTP 中补拍真实桌面截图（1440px 宽；日记与冥想为整页长图），按案例评分规则 v2 和对应任务检查项逐图复核；统计远程请求使用拦截，不发送正式测试访问。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
