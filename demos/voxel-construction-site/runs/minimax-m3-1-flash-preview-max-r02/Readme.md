# 体素微缩工地沙盘

## 原始提示词

见 [本次原始提示词](prompt.md)。本目录的 `prompt.md` 与 `demos/voxel-construction-site/prompts/v1/prompt.md` 逐字节一致。

## 运行与复盘

### 运行方式

- 模型：MiniMax-M3.1-Flash-Preview，档位 max，会话内一次性生成，未委派子代理。
- 产物：单个 `index.html`，Three.js r160 通过 importmap 由 CDN 引入，**需要联网**。
- 入口：本目录 `index.html`。

### 实现方式

- **全部资源代码生成**：木纹、混凝土、泥土、锈蚀贴图以及桌面蓝图都由 canvas 程序绘制，没有外部图片文件。
- **体素批渲染**：统一走 `InstancedMesh` + `flushVoxels` 合批；46 名工人也是 InstancedMesh + `instanceColor`，分别做巡逻、绑扎钢筋、搬运和塔吊指挥四种动作，另有安保巡逻。
- **分区**：基坑开挖区、钢筋加工棚、物料堆放区（水泥袋垛 / 砂堆 / 砾石堆）、在建高层楼房基座（混凝土框架 + 脚手架 + 绿色安全网）、临时板房办公区、渣土堆放区、临时施工道路，外加围挡、大门、警示彩旗、照明灯塔、临时照明、水电杆与安全警示标识。
- **机械**：2 台挖掘机（动臂 / 铲斗往复）、3 台自卸卡车（大门 → 基坑 → 渣土场 → 返回，轮子随位移转动）、3 台塔吊（回转 + 变幅 + 吊运）、1 台混凝土搅拌车、1 台小型装载机。
- **桌前旋钮**：室内深色实木工作桌上放着蓝图图纸、钢卷尺、安全帽摆件和带气泡的水平仪，桌前有 3 只实体金属旋钮，可用鼠标点击（Raycaster）或键盘 1 / 2 / 3 切换，分别控制**设备速度**、**昼夜循环**、**尘土强度**。
- **昼夜**：黎明 / 正午 / 黄昏 / 夜晚四阶段循环，联动天空色、太阳角度与颜色强度、雾、窗户 emissive、灯塔 PointLight 与自定义 sprite 光晕。
- **暴雨**：空格触发。雨滴粒子之外，还把路面 roughness 降到 0.12、metalness 提到 0.35 模拟湿滑反光，并提亮灯光、减弱太阳。

### 验证记录

headless Chromium（SwiftShader 软件渲染）下实测：

| 项目 | 结果 |
| --- | --- |
| 帧率 | 约 20 fps（软件渲染，不代表真实 GPU） |
| 场景 | 389 次绘制调用、16342 个三角面 |
| 旋钮 / 键盘 1 | 设备速度 1.00× → 2.00× |
| 旋钮 / 键盘 2 | 昼夜「自动循环」→「黎明」 |
| 旋钮 / 键盘 3 | 尘土强度切换 |
| 空格 | 状态栏显示「暴雨」 |
| 拖拽环视 | 生效 |
| 390px 横向溢出 | 无溢出 |
| 控制台错误 | 0 |

另已通过截图目检：沙盘、塔吊、机械、围挡、工人与桌面道具均正常渲染。

### 过程中修掉的真实问题

1. `const trucks` 重复声明，导致整页 `SyntaxError` 白屏。
2. `knobState` 用数字下标访问一个具名对象，旋钮点击与键盘快捷键**全部失效**，且 `rotation` 变成 `NaN`。
3. `o.y = ...` 误改了用于配置的源对象。
4. 塔吊创建时调用了一次空的 `V()`。
5. 装载机转向用了导数表达式，推算错误。
6. 旋钮与昼夜系统之间没有建立联动，改旋钮时环境不变。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`voxel-construction-site--minimax-m3-1-flash-preview-max-r02`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=voxel-construction-site)
- 输入记录：本目录 prompt.md 与 demos/voxel-construction-site/prompts/v1/prompt.md 逐字节一致，完整原文已保存。
- 工具：MiniMax Code 桌面版（MiniMax M3.1 Flash Preview）。Three.js r160 走 CDN，network 为 required。headless Chromium 为 SwiftShader 软件渲染，实测约 20 fps、389 次绘制调用、16342 三角面，该帧率不代表真实 GPU 表现。本工作副本用 node scripts/serve.mjs --read-only（PORT=4180）预览，未复用其他工作副本的 4173 端口；验证用 Playwright（chromium）驱动真实 UI 读数。 本轮使用 MiniMax Code 桌面版执行，未使用 Claude Code。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：MiniMax 批次合计 37 %（Max 订阅套餐五小时额度）（11 个案例；批次 minimax-m3-1-flash-preview-max-2026-10-13；未记录单案例费用）
- [工地沙盘](../../../../demos/voxel-construction-site/runs/minimax-m3-1-flash-preview-max-r02/index.html)

### 部署适配记录

- 全部几何、材质与贴图由代码生成（木纹、混凝土、泥土、锈蚀、蓝图），无外部资源文件。
- 体素批量渲染统一走 InstancedMesh；工人使用 InstancedMesh + instanceColor，分别做巡逻、绑扎钢筋、搬运与塔吊指挥四种动作。
- 暴雨不仅加雨滴粒子，还把路面 roughness 调到 0.12、metalness 调到 0.35 模拟湿滑反光，并提亮灯光、减弱太阳。
- 修复 const trucks 重复声明导致整页 SyntaxError、knobState 用数字下标访问具名对象导致旋钮点击与键盘全部失效且 rotation 变 NaN、o.y 误改配置对象、塔吊创建时一次空的 V() 调用、装载机转向用导数表达式错误，以及旋钮与昼夜未联动。
- 实测旋钮与键盘均可切换设备速度（1.00×→2.00×）、昼夜（自动循环→黎明）与尘土强度，空格可触发暴雨，拖拽环视正常，控制台无错误。
- 迁移来源：F:\dev\ai-coding-demo-test（experiment/minimax-m3-1-flash-preview-max）/demos/voxel-construction-site/runs/minimax-m3-1-flash-preview-max-r01；当前 main 已存在该轮号，保留历史并迁入为 minimax-m3-1-flash-preview-max-r02。
- 迁移验证：使用本仓库本地 HTTP 入口补拍实际桌面截图 screenshot.png；Chromium 确认入口可加载且无页面异常，390px 视口横向溢出为 0。
- 迁移验证补充：本 static 入口可通过 file:// 直接打开，Chromium 页面异常为 0。
<!-- archive:end -->
