# 体素微缩建筑工地沙盘

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文 v1）。

## 运行与复盘

- 运行方式：浏览器直接打开本目录 `index.html`（file:// 或 HTTP 静态托管均可）。依赖 CDN 加载 Three.js（r160 全局 UMD 构建 `three.min.js`），需联网，非离线。r160 全局构建会打印一条 deprecation `console.warn`（r150+ 弃用提示），属预期，非错误。
- 入口：`index.html`（单文件，HTML/CSS/JS/GLSL 全部内联，几何体/材质/贴图全部代码生成，无外部图片资源）。
- 实现要点：
  - 场景载体：深色实木工作桌面（程序化木纹 Canvas 贴图）+ 桌腿 + 沙盘托盘；桌面边角散落蓝图图纸 ×2、钢卷尺、安全帽摆件（体素穹顶）、金属水平仪；第三人平视人眼高度轨道相机。
  - 工地分区：基坑开挖区、钢筋加工棚、物料堆放区、在建高层基座（5 层 + 脚手架 + 钢筋）、临时板房办公区（自发光窗）、渣土堆放区、环形临时施工道路；围挡/大门/警示彩旗/施工指示灯/临时照明灯/堆叠钢筋/水泥堆/砂石料堆/临时水电杆/安全警示标识。
  - 体素批渲染：全部静态体素写入扁平数组 → 单个 `InstancedMesh`（`MeshLambertMaterial` + `setColorAt` 逐实例颜色 + 抖动颗粒质感），8253 体素压到 1 个 DrawCall；全场景约 177 DrawCalls / 102k 三角面。
  - 动态机械：2 台挖掘机（boom/arm/bucket 三级枢轴往复挖掘）、3 辆渣土卡车（CatmullRom 闭合环路行驶，接土→满载→卸料状态机，车斗土方随状态增减）、2 台塔吊（回转/小车/吊索/吊钩/吊物 + 警示灯）、混凝土搅拌罐车、小型装载机。
  - 人物：15 名体素工人（绑扎钢筋/搬运/指挥塔吊/操作工具/安保巡逻），`InstancedMesh` 批渲染，按工种分布。
  - 环境与昼夜：黎明/正午/黄昏/夜晚四套天色插值；夜晚探照灯/塔吊灯/板房窗暖辉光（自发光 + 光晕 billboard）；自定义 Shader 尘土粒子（强度可调）与暴雨粒子。
  - 交互：鼠标拖拽环视 + 闲置自动缓慢环绕 + 滚轮缩放；桌面三枚实体旋钮（射线拾取点击）调节设备速度 / 开关昼夜循环 / 切换尘土强度；空格触发暴雨（雨滴粒子 + 地面湿滑反光 roughness/metalness 变化 + 灯光增亮）；HUD 同步状态。
- 验证记录（2026-11-13，Qoder Desktop 内置浏览器，HTTP 打开，脚本断言；内置视口 0×0，强制 resize 1280×800 后渲染）：
  - WebGL gl.getError()=0，控制台仅 r160 deprecation warn，无 Shader 编译/运行错误。✔
  - 场景统计：8253 体素 / 15 工人 / 2 挖掘机 / 3 卡车 / 2 塔吊；177 DrawCalls / 102484 三角面（实例化生效）。✔
  - readPixels 随机 200 点全部非黑（200/200），中心 [59,59,60] 等真实颜色，确认场景实际绘出。✔
  - 三旋钮 setSpeed/toggleCycle/setDust、空格 toggleRain、setTime 昼夜均生效并可还原；相机闲置自动环绕（camPos 随时间变化）。✔
  - 全场景遍历 218 对象无 NaN 位置，相机坐标有限；昼夜时间随帧推进，确认动画循环运行。✔
  - 60FPS 实测与真机视觉留待 Playwright（内置浏览器视口受限，软件渲染实测约 30fps）。
- 待确认 / 简化（按提示词标示并继续，未中断）：
  - 『碰撞约束』采用布局/路径分离的构造式防穿模：机械各占互不重叠的作业区与闭合行驶路径，卡车按状态机接土/卸料，塔吊吊物沿固定回转半径，静态体素按网格占位不重叠；未引入运行时物理碰撞引擎。
  - 『60FPS』为设计目标：静态体素单 InstancedMesh、工人实例化、粒子用 Shader Points，DrawCall 控制在 ~177；真机帧率留待 Playwright/实机确认。
- 复盘：体素「颗粒质感」靠逐实例颜色抖动 + 扁平数组批渲染营造，8253 方块压到 1 个 DrawCall 是性能关键。昼夜用天色插值 + 自发光窗/灯 + 光晕 billboard 形成冷暖对比，避免实时阴影开销。防穿模以「分区占位 + 闭合路径 + 状态机」在构造期保证，比运行时碰撞检测更省且更稳定，契合沙盘微缩模型的确定性布局。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`voxel-construction-site--qwen4-max-preview-xhigh-r01`
- 模型：Qwen4-Max-Preview；推理档位：xhigh
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=voxel-construction-site)
- 输入记录：批量指令原文与任务正文 v1 原文完整保存；同指令重复发送 3 次，内容一致。
- 工具：Qoder Desktop。当前会话直接执行；模型 Qwen4-Max-Preview，档位 xhigh；Windows 11，Node v24.22.1；未委派子代理。 用户确认供应商 aliyun、工具 qoder，整批 11 例耗时 1h 20s（3620 秒），费用与 Token 未提供，不分摊；其他执行条件为源声明。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：aliyun 批次合计 金额未记录（11 个案例；批次 qwen4-max-preview-xhigh-qoder-2026-11-13；未记录单案例费用）
- [体素微缩建筑工地沙盘](../../../../demos/voxel-construction-site/runs/qwen4-max-preview-xhigh-r01/index.html)

### 部署适配记录

- 2026-11-13：从 F:/dev/ai-coding-demo-test 未提交结果迁入，源基准提交 452ac588702d3bde24f048fcf47cc5ffa7abb602；保留原始输入与复盘，不合并测试基线。
- 2026-11-13：追加 defer 公共统计引用，补采真实截图，按 v3 由 Codex 逐图视觉复核；源声明不等于独立功能验收。
- 2026-11-13：本次视觉复核边界：Codex 逐图 AI 视觉复核，仅评价归档可见证据；非人工完整功能验收或模型能力排名。
- 2026-11-13：根路径与 Pages 子路径全部入口、原始输入、截图、对比 iframe、390px 无页面水平溢出及静态 file:// 检查完成；细项见 catalog/score-reviews/2026-11-13-qwen4-max-preview-xhigh-import.json。
<!-- archive:end -->
