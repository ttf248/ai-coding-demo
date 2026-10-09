# 体素微缩建筑工地

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：单 HTML 文件，HTTP 静态托管或 file:// 打开；**依赖网络**（unpkg 的 Three.js 0.160 importmap）。木纹、蓝图、旋钮标签均为 canvas 程序化生成，无其他外部资源。
- 入口：[index.html](index.html)
- 执行模型：Kimi K3，档位 high，Copilot CLI（VS Code）当前会话直接执行。
- 场景与系统：
  - 桌面载体：深色实木工作台（程序化木纹）、蓝图图纸、钢卷尺、安全帽、金属水平仪；第三人平视略高视角。
  - 工地分区：基坑开挖区、钢筋加工棚、物料堆放区（水泥/砂石/钢筋）、在建高层基座（含脚手架）、临时板房办公区、渣土堆放区、十字临时道路。
  - 动态机械：2 台挖掘机臂架往复挖掘；2 辆渣土车在独立环道上装土→运输→卸料循环（车厢翻转卸土）；2 台塔吊回转、小车变幅、吊钩升降、钢筋捆与料斗交替吊运；搅拌罐车低速环线、罐体持续转动；装载机往复平整。
  - 人物：绑扎钢筋 ×4、搬运 ×3、塔吊指挥 ×1（挥臂）、操作工具 ×2、安保巡逻 ×2，均为体素小人微动画。
  - 昼夜：黎明/正午/黄昏/夜晚四相位插值；夜晚板房窗光、塔吊灯、探照灯（SpotLight）与 shader 光晕点亮；施工指示灯闪烁。
  - 交互：拖拽环视、滚轮缩放、闲置 4 秒自动环绕；桌面前沿三个实体旋钮（raycast 点击）：设备速度 ×0.5/1/2/4、昼夜循环开关、尘土关/中/强；空格切换暴雨（雨滴粒子、地面湿滑反光、灯光增强）。
  - 性能与约束：静态场景全部走 InstancedMesh 批渲染；尘土与光晕为自定义 ShaderMaterial；运动物体路径为预规划非相交车道并按边界钳制，避免穿模和越出沙盘。
- 验证记录：模块加载失败有明确错误页；`resize` 正确更新；旋钮点击区域与标签牌对齐；HUD 实时显示速度/昼夜/尘土状态与 FPS。
- 复盘：一次生成完成，未做追加修复。已知取舍：渣土车「装土/卸料」为状态机近似（未做铲斗-车厢精确对位的物理仿真），运动物体防穿模依赖车道分离与边界钳制而非碰撞检测。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`voxel-construction-site--kimi-k3-high-r01`
- 模型：Kimi K3；推理档位：high
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=voxel-construction-site)
- 输入记录：完整输入即主题任务正文 v1，无附加上下文。正文同时写有「Three.js r160 CDN」与「不引用任何外部资源」，按前者执行：Three.js 走 CDN，其余贴图、标签全部代码生成。
- 工具：GitHub Copilot CLI（VS Code）。model-test-base 独立克隆中由当前会话直接执行；模型 kimi-k3，档位 high；未委派子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：GitHub Copilot 批次合计 $5.05 USD（11 个案例；原始消耗 883 GitHub Copilot credits，换算比例 40 USD / 7000 GitHub Copilot credits；批次 github-copilot-kimi-k3-high-2026-10-09；未记录单案例费用）
- [体素微缩建筑工地](../../../../demos/voxel-construction-site/runs/kimi-k3-high-r01/index.html)

### 部署适配记录

- 来源：模型测试分支 `experiment/kimi-k3`，提交 `793b2ac`。迁入时原始输入与模型产物未改写；迁入后通过本地 HTTP 打开入口并补拍实际运行截图 `screenshot.png`。
<!-- archive:end -->
