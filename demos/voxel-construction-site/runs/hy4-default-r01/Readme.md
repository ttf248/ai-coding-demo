# 体素微缩建筑工地沙盘

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

**入口**：[index.html](index.html)。单文件页面，需要联网加载 Three.js r160 CDN；页面内置备用 CDN 与加载失败提示。

**运行方式**：桌面旋钮控制时间（昼夜循环）、天气（暴雨）、视角与机械动画；按钮切换「施工沙盘 / 竣工城市」两个场景。

**实现要点**：`InstancedMesh` 批量绘制静态体素，`matCache` + 单位 `BoxGeometry` 缩放复用减少几何体分配，`staticMeshes[]` 收集第一场景对象以便切换隐藏；塔吊桅杆、搅拌罐、挖掘臂等动态部件挂在各自 group 中独立变换；地面与立面使用 `CanvasTexture` 程序化纹理；尘土、灯晕与暴雨用自定义 GLSL 的 `Points` / `LineSegments` 着色器实现。

**验证记录**：内联脚本语法检查通过；Three.js r160 CDN 返回 200（其 UMD 文件头部含 r150+ 弃用提示，但全局 `THREE` 仍可用）；修正了塔吊动态 group 误调静态体素函数、搅拌罐重复 `add`、重复创建几何体等问题。

**已知限制**：依赖外部 CDN，离线不可用；场景为程序化体素示意，不是真实工程 BIM 数据；暴雨/灯晕为屏幕空间近似效果。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`voxel-construction-site--hy4-default-r01`
- 模型：Hy4；推理档位：default
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=voxel-construction-site)
- 输入记录：完整原始输入取自该主题 prompts 对应版本的任务正文原文，逐字复用；未追加归档要求、系统提示词或额外上下文，输入指纹与共用任务正文一致。 迁移核对：源目录仅保存任务正文快照，未保存发起批量测试的完整指令和会话上下文；不能确认完整输入与其他实验一致。
- 工具：WorkBuddy。用户指定模型名称 Hy4、档位 default，并明确要求使用当前会话直接执行、不委派子代理；本轮在 model-test-base 基线的当前工作区完成，未创建独立克隆。执行日期 2026-11-06。批量范围由 npm run topics:active 取得，testingStatus 为 archived 的 stock-watching 未参与；bluebook 按默认规则使用版本号最大的提示词 v2，其余主题使用 v1。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：tencent 批次合计 0（11 个案例；批次 hy4-default-workbuddy-2026-11-06；未记录单案例费用）
- [体素工地沙盘](../../../../demos/voxel-construction-site/runs/hy4-default-r01/index.html)

### 部署适配记录

- 按原文从 CDN 引入 Three.js r160，其余几何体、材质与贴图全部由代码生成，因此标记需要联网。
- 按原文末尾「添加新场景进去」追加可切换的竣工城市夜景作为第二场景；运动机械沿互不重叠的预定义路径与限位运行，范围限定在桌面内。
- 2026-11-06：从 F:/dev/ai-coding-demo-test 的 model-test-base 工作区未提交结果迁入，源基准提交 452ac588702d3bde24f048fcf47cc5ffa7abb602；保留 prompt.md 原始字节和模型源码，仅为入口添加公共统计引用。
- 2026-11-06：维护者补采真实桌面、手机及相关操作证据，按现行 v3 逐图完成 AI 视觉复核；评分仅评价可见证据，不代表完整功能或性能验收。
<!-- archive:end -->

## 2026-11-06 迁移复核

来源：`F:/dev/ai-coding-demo-test` 的 `model-test-base` 工作区未提交产物，源基准提交 `452ac588702d3bde24f048fcf47cc5ffa7abb602`。上方实现说明和验证记录沿用源文件，仅代表源测试记录；本次额外验收以此节与 run.json 的证据为准。原始 prompt.md 保持字节不变，完整批量指令和会话上下文未保存，输入完整性记为 partial。

用户提供：Hy4 / default，供应商 tencent，工具 WorkBuddy，整批11例免费、耗时50m 56s；不分摊到单例。

本次已检查 HTTP、Pages 子路径、对比页 iframe、原始输入与截图链接、390px 视口；静态入口额外检查 file://。公共统计引用由维护者补加，测试拦截正式统计。

截图采用现行 v3 规则进行AI逐图视觉复核，得分 69 / 100。

- 初始桌面帧为空，延长有界等待后真实出现主体，保留全部早期证据。
- 未核验碰撞、完整机械循环、60FPS、暴雨、实体旋钮或新场景。
- 由Codex完成AI逐图视觉复核；输入仅保存任务正文，非完整会话上下文，评分不代表完整功能验收。
