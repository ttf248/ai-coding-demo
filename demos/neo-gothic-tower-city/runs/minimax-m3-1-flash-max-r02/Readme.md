# 新哥特式塔楼城市 · 可漫游

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文与 [主题 prompts/v1/prompt.md](../../prompts/v1/prompt.md) 一致，未删改内容）。

## 实现要点

- 按真实比例建模：塔高 38–96 米、街道宽 14 米、相机默认人眼高度 1.7 米；塔身用八棱柱 + 束带 + 八棱锥尖塔，转角配外倾飞扶壁与扶壁墩。
- 所有塔体几何合并为单个 BufferGeometry 一次性渲染，窗户用带顶点色的自发光着色器，粒子（火星、雾霭、星空）全部走自定义 GLSL。
- 两种相机模式：WASD + 拖动转头的第一人称漫游，以及按 C 切换的自动巡游；滚轮可调整视高。

## 运行与复盘

- 运行方式：在 Windows + PowerShell 7 环境用当前会话直接实现；Three.js r160 以 ESM + importmap 方式从 CDN 加载，需要联网并通过 HTTP 访问。
- 验证记录：
  - Three.js r160 正常加载，塔楼、窗户、粒子均渲染成功，无 WebGL 报错。
  - 程序化塔楼数量 > 30，窗户数量与火星粒子数量符合预期（通过 window.__city 接口读取）。
  - 相机漫游与自动巡游切换有效；390px 视口无横向溢出。
- 已知限制：
  - 依赖 CDN 的 ESM 模块，file:// 直接打开会被 CORS 拦截（页面内置了明确提示），需用静态服务器访问。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--minimax-m3-1-flash-max-r02`
- 模型：MiniMax M3.1 Flash；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：完整任务正文，与 demos/neo-gothic-tower-city/prompts/v1/prompt.md 一致。
- 工具：MiniMax Code。在 Windows + PowerShell 7 环境用当前会话直接实现；Three.js r160 以 ESM + importmap 方式从 CDN 加载，需要联网并通过 HTTP 访问。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：MiniMax 批次合计 金额未记录（11 个案例；批次 minimax-m3-1-flash-max-minimax-code-2026-10-20；未记录单案例费用）
- [可漫游塔楼城市](../../../../demos/neo-gothic-tower-city/runs/minimax-m3-1-flash-max-r02/index.html)

### 部署适配记录

- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base 分支工作区，未提交状态）中的 demos/neo-gothic-tower-city/runs/minimax-m3-1-flash-max-r01；同模型同档位的 r01 记录来自 Claude Code CLI 会话，本轮由 MiniMax Code 重新执行并另存为 r02；原始输入、模型产物与复盘文字原样保留。
- 维护者于 2026-10-20 按本仓库统计规则为网页入口引用公共 assets/analytics.js；原始任务输入未改动。
- 维护者于 2026-10-21 在本仓库本地 HTTP 预览中补拍真实桌面截图（1440px 宽），并按案例评分规则 v2 逐项复核；实验源码和原始输入未修改。
<!-- archive:end -->
