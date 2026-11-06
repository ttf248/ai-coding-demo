# Pixel Flow 图片粒子化与手势还原

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

**入口**：[index.html](index.html)。单文件页面，需要联网加载 Three.js r160 与 MediaPipe Hands 的 CDN；摄像头功能需要浏览器授权。

**运行方式**：上传本地图片（或使用内置示例）→ 像素被采样为粒子点云；点击开启摄像头后用手势控制：张开手掌把粒子推散、握拳/双手张开触发还原；无摄像头或拒绝授权时自动降级为鼠标/触摸力场。

**实现要点**：Canvas `getImageData` 采样并按亮度降采样写入 `BufferGeometry` 属性；`restore[i]` 记录每颗粒子的还原进度；手势关键点用归一化坐标换算到世界平面 `x=(0.5-lm.x)*planeW*1.55`、`y=(0.5-lm.y)*planeH*1.55`，按伸出指数分类为 open / fist / partial；力场半径内加速归位，大数组用循环 `push` 避免展开超长参数；自定义 `ShaderMaterial` 用 `attribute vec3 color` 而非 `vertexColors`，避免与内建属性冲突；叠加层清空使用正确的 `clearRect(0,0,w,h)`。

**验证记录**：内联脚本语法检查通过；CDN 地址返回 200；图片采样、关键点绘制与鼠标降级路径均已实现。

**已知限制**：摄像头需 HTTPS 或 localhost 且需用户授权；无 WebGL 或 CDN 不可达时页面给出提示；大图会降采样以控制粒子数。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--hy4-default-r01`
- 模型：Hy4；推理档位：default
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：完整原始输入取自该主题 prompts 对应版本的任务正文原文，逐字复用；未追加归档要求、系统提示词或额外上下文，输入指纹与共用任务正文一致。 迁移核对：源目录仅保存任务正文快照，未保存发起批量测试的完整指令和会话上下文；不能确认完整输入与其他实验一致。
- 工具：WorkBuddy。用户指定模型名称 Hy4、档位 default，并明确要求使用当前会话直接执行、不委派子代理；本轮在 model-test-base 基线的当前工作区完成，未创建独立克隆。执行日期 2026-11-06。批量范围由 npm run topics:active 取得，testingStatus 为 archived 的 stock-watching 未参与；bluebook 按默认规则使用版本号最大的提示词 v2，其余主题使用 v1。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：tencent 批次合计 0（11 个案例；批次 hy4-default-workbuddy-2026-11-06；未记录单案例费用）
- [Pixel Flow 粒子手势](../../../../demos/pixel-flow/runs/hy4-default-r01/index.html)

### 部署适配记录

- 按原文技术栈引入 Three.js 与 MediaPipe Hands CDN，因此标记需要联网；摄像头与模型不可用时自动降级为鼠标/触摸模拟手势，并给出明确状态提示。
- 首屏内置代码生成的示例图案，file:// 或无摄像头环境仍可完整演示粒子化与还原。
- 2026-11-06：从 F:/dev/ai-coding-demo-test 的 model-test-base 工作区未提交结果迁入，源基准提交 452ac588702d3bde24f048fcf47cc5ffa7abb602；保留 prompt.md 原始字节和模型源码，仅为入口添加公共统计引用。
- 2026-11-06：维护者补采真实桌面、手机及相关操作证据，按现行 v3 逐图完成 AI 视觉复核；评分仅评价可见证据，不代表完整功能或性能验收。
<!-- archive:end -->

## 2026-11-06 迁移复核

来源：`F:/dev/ai-coding-demo-test` 的 `model-test-base` 工作区未提交产物，源基准提交 `452ac588702d3bde24f048fcf47cc5ffa7abb602`。上方实现说明和验证记录沿用源文件，仅代表源测试记录；本次额外验收以此节与 run.json 的证据为准。原始 prompt.md 保持字节不变，完整批量指令和会话上下文未保存，输入完整性记为 partial。

用户提供：Hy4 / default，供应商 tencent，工具 WorkBuddy，整批11例免费、耗时50m 56s；不分摊到单例。

本次已检查 HTTP、Pages 子路径、对比页 iframe、原始输入与截图链接、390px 视口；静态入口额外检查 file://。公共统计引用由维护者补加，测试拦截正式统计。

截图采用现行 v3 规则进行AI逐图视觉复核，主体证据不足，不计数值分。

- 软件渲染与D3D11重试均未显示主体，记证据不足，不按按钮或状态文字给分。
- 真实网络未替换，未伪造摄像头或手势；未验证MediaPipe实际识别。
- 由Codex完成AI逐图视觉复核；输入仅保存任务正文，非完整会话上下文，评分不代表完整功能验收。
