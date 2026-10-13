# 新哥特式塔楼城市

## 原始提示词

见 [本次原始提示词](prompt.md)。本目录的 `prompt.md` 与 `demos/neo-gothic-tower-city/prompts/v1/prompt.md` 逐字节一致。

## 运行与复盘

### 运行方式

- 模型：MiniMax-M3.1-Flash-Preview，档位 max，会话内一次性生成，未委派子代理。
- 产物：单个 `index.html`，Three.js r160 通过 importmap 由 CDN 引入，**需要联网**。
- 入口：本目录 `index.html`。

### 实现方式

- **建筑全部程序生成**：塔高 58–168m 的米制真实比例，窗高 3.2m，正门 4.4m，广场直径 64m。包含尖拱窗、飞扶壁 + 墙面扶壁墩、玫瑰窗、八角尖顶、角部小尖塔，以及城墙、大门、路灯与篝火。
- **海面**：顶点着色器里的 Gerstner 风格叠加多组波形，带浪花与海鸥。
- **火焰**：自定义 shader 的点精灵，随机相位抖动。
- **相机**：OrbitControls 轨道漫游，另有 WASD / QE 平移、Shift 加速、自动环绕，以及受海平面限制的步行模式（不会走进海里）。

可切换夜景，并可分别调节海浪强度与火焰密度。

### 关于「待确认」面板

提示词明确要求把不确定之处显式列出，因此页内内置了一个「待确认」面板，如实写明三点：

1. 真实比例没有官方图纸可依，当前尺寸是基于哥特式建筑常规比例的合理推断，不是某座真实建筑的复刻。
2. 全部几何、材质与贴图由代码生成，没有使用外部模型文件。
3. Three.js 走 CDN，离线环境下无法打开。

### 验证记录

headless Chromium（SwiftShader 软件渲染）下实测：

| 项目 | 结果 |
| --- | --- |
| 场景规模 | 6 座塔、101732 个三角面 |
| 帧率 | 约 20 fps（软件渲染，不代表真实 GPU） |
| 动画 | 运行中 |
| 轨道拖拽 / WASD | 均有效 |
| 夜景切换 | 生效 |
| 步行模式 | 可进入且不会走进海里 |
| 海浪滑杆 | 生效 |
| 390px 横向溢出 | 无溢出 |
| 控制台错误 | 0 |

另已通过截图目检渲染结果：海面亮度、尖拱与尖顶的哥特特征在修正后明显可见。

### 过程中修掉的真实问题

1. 大门位置的 y 多算了半个门高，门悬空或陷地。
2. 火焰与海鸥粒子初始全部堆在原点。
3. 点精灵尺寸公式过大，粒子糊成一片白光。
4. 整体过暗且哥特特征不明显：提高半球光 / 月光 / 环境光与曝光，调整雾色，加高尖顶，放大飞扶壁与玫瑰窗，加宽城墙段。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--minimax-m3-1-flash-preview-max-r01`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：本目录 prompt.md 与 demos/neo-gothic-tower-city/prompts/v1/prompt.md 逐字节一致，完整原文已保存。
- 工具：MiniMax Code / MiniMax-M3.1-Flash-Preview。Three.js r160 由 importmap 从 CDN 引入，因此 network 为 required。headless Chromium 为 SwiftShader 软件渲染，实测 6 座塔、101732 三角面、约 20 fps，该帧率不代表真实 GPU 表现。本工作副本用 node scripts/serve.mjs --read-only（PORT=4180）预览，未复用其他工作副本的 4173 端口；验证用 Playwright（chromium）驱动真实 UI 读数。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [塔楼城市](../../../../demos/neo-gothic-tower-city/runs/minimax-m3-1-flash-preview-max-r01/index.html)

### 部署适配记录

- 按提示词要求内置「待确认」面板，如实说明：真实比例无官方图纸可依、全部资源由代码生成、Three.js 走 CDN 因此离线不可用。
- 修复大门位置的 y 多算了半个门高、粒子初始全部堆在原点、点精灵尺寸公式过大导致糊成一片、光照过暗且哥特特征不明显（提高环境光与曝光、加高尖顶、放大飞扶壁与玫瑰窗、加宽城墙段）。
- 步行模式限制不走进海里；实测轨道拖拽、WASD 移动、夜景切换、海浪与火焰密度滑杆均生效，控制台无错误。
<!-- archive:end -->
