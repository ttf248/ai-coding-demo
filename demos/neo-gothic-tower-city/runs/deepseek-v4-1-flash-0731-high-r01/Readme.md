# 新哥特式塔楼城市（DeepSeek-V4.1-Flash-0731 · high · r01）

单文件网页，直接打开 [index.html](index.html) 即可运行。**需要联网**：通过 import map 从 unpkg 加载 Three.js r160 及其 addons（`BufferGeometryUtils`）。除此之外没有后端、没有构建步骤。

## 原始提示词

见 [完整原始输入](prompt.md)；任务正文与 [v1 任务正文](../../prompts/v1/prompt.md) 逐字一致。

## 实现要点

- **真实比例**：以米为单位建模。人眼高度 1.7 m，环城塔楼 46~112 m，西立面双钟塔 118 m + 46 m 尖顶，中央尖塔最高点 168 m，海崖台地高出海面约 42 m，岛屿直径约 640 m，城墙周长约 1530 m。
- 场景构成：低多边形岩体岛屿、城市台地、主教堂（中殿 / 侧廊 / 后殿 / 双钟塔 / 中央尖塔 / 飞扶壁）、三环共 33 座塔楼、同环空中连廊、带垛口的城墙、五段栈桥与灯塔、环城街道、26 座火盆。
- 构件先按材质分桶累积（石墙 / 深色石 / 屋顶 / 金饰 / 窗 / 玫瑰花窗 / 彩色玻璃），最后用 `mergeGeometries` 合并——因此 30 万三角面只用了 **39 个 draw call**。
- 海面是自定义 ShaderMaterial：四层不同方向与频率的正弦波在顶点着色器里叠加，片元着色器做深浅渐变、波峰泡沫与远处融色。波频刻意压低到与网格尺度匹配，避免摩尔纹。
- 粒子：2600 个火星（附加混合，各自带相位与涡旋漂移，从塔基 / 城墙 / 码头升起）与 44 只海鸥（环岛飞行 + 扑翼）。相机、天空、海面全部由时间驱动。
- 相机三态：**电影运镜**（Catmull-Rom 闭合曲线自动巡游，空闲 9 秒自动恢复）、**自由环视**（拖拽改变偏航/俯仰，滚轮推进）、**步行**（WASD 在 1.7 m 人眼高度沿台地移动，被城墙半径约束）。空格随时回到电影视角。
- 性能取舍：设备像素比上限 1.6；阴影贴图 2048；26 座火盆只有 7 盏带真实点光源（其余用自发光材质），避免前向着色器光源数组膨胀。

## 待确认项

任务正文允许遇到缺漏时标注「待确认」并继续。本次**没有阻塞项**：Three.js r160 与所需 addon 在 unpkg 上可用，构建几何所需的一切都在 three 核心与 `BufferGeometryUtils` 内。唯一需要说明的依赖是：CDN 不可达时页面会停在加载提示上，无法离线运行。

## 验收自测

无头 Chromium + SwiftShader 软件 WebGL：

| 检查项 | 实测 |
|---|---|
| 页面无脚本错误 | 无（`pageerror` 与 console error 均为空） |
| 场景规模 | 三角面 299,580；draw call 39 |
| 电影运镜确实在移动 | 间隔 4 秒两次截图不同 |
| 拖拽环视 | 画面改变，并自动取消电影运镜 |
| 滚轮缩放 | 画面改变 |
| WASD 行走 | 画面改变，保持在步行态 |
| 空格回到电影视角 | 复选框恢复勾选，画面改变 |
| 火星 / 海鸥 / 月光开关 | 三者都真实改变渲染结果 |
| 390px 无水平溢出 | 溢出 0px |

帧率一栏在软件渲染下为 21 FPS；这是 SwiftShader 的数值，**不能作为真机性能结论**。

## 运行与复盘

- 运行方式：联网状态下用浏览器直接打开本目录 `index.html`；或使用根目录 `npm run preview` 后的静态托管地址。
- 复盘：首版就通过了全部交互检查（运镜、环视、缩放、行走、三个开关）。随后做了两轮呈现修正：一是初版夜景整体过暗，塔身几乎成剪影，提高了环境光 / 半球光 / 月光强度并补了一盏冷色轮廓光，同时提高曝光；二是海面的高频波形与网格尺度不匹配产生明显摩尔纹，把波频整体下调并加密网格细分、削弱泡沫项后消除。另外修正了两处自身实现缺陷：把圆柱压成朝向 ±Z 的圆盘需要绕 X 轴旋转（玫瑰花窗原先只绕 Y 轴旋转，朝向错误），以及教堂侧面色窗的薄面方向弄反。全部属于首轮生成内部的自查，`changes` 为空。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--deepseek-v4-1-flash-0731-high-r01`
- 模型：DeepSeek-V4.1-Flash-0731；推理档位：high
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：本次批量执行的完整指令 + 主题任务正文；正文与 demos/neo-gothic-tower-city/prompts/v1/prompt.md 逐字一致。历史来源为 demos/neo-gothic-tower-city/runs/gpt-6-high-r01/prompt.md，其中的原始上下文未留存。
- 工具：Claude Code。模型名称由用户指定为 DeepSeek-V4.1-Flash-0731；会话内模型标识为 deepseek-flash[1m]。单会话直接执行，未委派子代理。Windows 11 + Node 22.16.0。验收在无头 Chromium 的 SwiftShader（软件 WebGL）下完成，所见帧率为软件渲染值，不代表真机性能。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 2.71 CNY（11 个案例；批次 deepseek-v4-1-flash-0731-high-2026-10-13；未记录单案例费用）
- [主页面](../../../../demos/neo-gothic-tower-city/runs/deepseek-v4-1-flash-0731-high-r01/index.html)

### 部署适配记录

- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base 工作区）/demos/neo-gothic-tower-city/runs/deepseek-v4-1-flash-high-r01；保留原测试轮次 r01 与完整输入快照。
- 迁移验收：通过本地 HTTP 实际入口补拍 desktop screenshot.png；390px 页面无横向溢出。静态入口也通过 file:// 直接打开检查。
- 模型与实验目录标识按用户确认更新为 DeepSeek-V4.1-Flash-0731；历史输入、评分、产物与迁移来源保留。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
