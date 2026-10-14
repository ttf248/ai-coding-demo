# 新哥特式塔楼城市真实比例漫游（Qwen3.8 Max · xhigh）

## 原始提示词

见 [完整原始输入](prompt.md)，任务正文版本 [v1](../../prompts/v1/prompt.md)。任务正文允许自行决定摄像机与粒子丰富度、遇缺漏标『待确认』并继续；本轮无需要『待确认』的环境缺漏（Three.js 经 CDN 引入成功）。

## 批次记录

Aliyun 批次合计 91.81 CNY，覆盖 11 个案例，耗时 2h 50m 7s；费用及耗时均为批次总计，不拆分为单案例。

## 运行方式

- 入口为本目录 `index.html`；需联网加载 Three.js r160（unpkg importmap），其余几何体、材质、贴图均为代码生成。
- 三种漫游模式：自动巡航（海岸弧线推拉镜头）、步行漫游（WASD/方向键 + Shift 加速，鼠标拖拽或指针锁定转视角；触屏左半屏移动、右半屏转视角）、自由环绕（拖拽旋转、滚轮/双指缩放）。
- 「切换夜/黄昏」切换光照与窗光强度；HUD 显示 FPS / 三角面数 / 当前模式。

## 场景内容

- 真实比例（米）：海崖岛直径约 120m、塔楼 30–70m、步行眼高 1.7m；中央大教堂（中殿 + 双西塔 + 玫瑰窗 + 飞扶壁）、8 座八角哥特塔（尖顶 + 小尖塔环 + 窄窗）、14 段城墙与 4 座门楼、46 栋陡屋顶民居（InstancedMesh）。
- 环境：黄昏/夜双光照、指数雾、顶点波海浪（解析法线 + 泡沫）、13 处火炬盆的加色火焰粒子、海崖漂浮海雾粒子。
- 性能：重复元素实例化批渲染；软件渲染环境（SwiftShader）自动降质——探针上下文识别 unmasked renderer 后创建无 MSAA 上下文、关阴影、降像素比，帧率不足时进一步隐藏雾粒子。

## 验证记录

2026-10-14 Playwright（Chromium headless + SwiftShader）冒烟测试：

- Three.js 模块加载、渲染循环运行；桌面 1280×800 与移动 390×844 均持续出帧（SwiftShader 下 50+ FPS）。
- 模式切换（步行 / 环绕 / 自动）与 WASD 移动产生画面变化；昼夜切换生效；无 JS 报错；390px 无水平溢出。
- 截图确认黄昏光下塔群、城墙、火炬与海雾可见，夜间窗光增强。

## 复盘

- SwiftShader 下首测仅 ~0.3 FPS，逐层排除后确认瓶颈是 MSAA（软件抗锯齿极贵），改为探针识别软件渲染后在创建上下文时关闭 antialias，立刻回到 50+ FPS；阴影与像素比同步降质。
- `gl.getParameter(RENDERER)` 在 Chromium 中被掩蔽为 "WebKit WebGL"，必须用 WEBGL_debug_renderer_info 的 unmasked 值识别 SwiftShader；另加帧率自适应降级兜底。
- InstancedMesh 的实例分布远超几何包围球，默认视锥剔除会整批误删，需 `frustumCulled = false`；窄窗平面需双面材质否则背面不可见。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--qwen3-8-max-xhigh-r01`
- 模型：Qwen 3.8 Max；推理档位：xhigh
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：prompt.md 保留用户会话指令与任务正文原文；Claude Code 系统提示与仓库 AGENTS.md 项目说明同时生效，系统提示未留存于快照。
- 工具：Claude Code。当前会话直接执行，未委派子代理；模型与档位由用户指定为 qwen3.8-max / xhigh，与会话自报一致。Three.js 经 unpkg importmap 引入（任务正文允许的库），其余几何体/材质/贴图全部代码生成。软件渲染（SwiftShader）环境自动降质（关阴影/降分辨率比/MSAA 关闭），实测 50+ FPS。无『待确认』缺漏项。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Aliyun 批次合计 91.81 CNY（11 个案例；批次 qwen3-8-max-xhigh-2026-10-14；未记录单案例费用）
- [塔楼城市漫游](../../../../demos/neo-gothic-tower-city/runs/qwen3-8-max-xhigh-r01/index.html)

### 部署适配记录

无新增实现改动。
<!-- archive:end -->
