# 新哥特式塔楼城市

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文 v1）。

## 运行与复盘

- 运行方式：浏览器直接打开本目录 `index.html`（file:// 或 HTTP 静态托管均可）。依赖 CDN 加载 Three.js（r128 全局构建），需联网，非离线。
- 入口：`index.html`（单文件，HTML/CSS/JS/GLSL 全部内联）。
- 实现要点：
  - 真实比例（单位=米）：中央大教堂尖顶约 150m，内环 8 塔、外环 14 塔与 2 座地标尖塔，共 25 座；城市半径约 180m，海面 4000m。
  - 哥特元素：八角/方形塔身、陡尖顶、角塔（152 个实例化）、飞扶壁（44 个实例化）、玫瑰窗、596 扇实例化尖拱窗（暖色自发光）、塔顶 finial 与连廊桥。
  - 环境：GLSL 天空穹顶渐变 + 1400 星点 + 月亮；Gerstner 叠加海浪 Shader（有限差分法线 + 菲涅尔 + 月光高光 + 浪尖泡沫 + 距离雾化）；岩石岛基。
  - 粒子：27 处火盆 × 70 = 1890 火焰粒子（加色混合 Shader，上升/旋绕/黄→橙→红渐变），500 漂浮余烬；6 盏暖色点光源。
  - 漫游：CatmullRom 闭合路径电影级自动漫游（可开关）；手动模式自定义轨道控制器（拖拽旋转 / 滚轮推拉 / WASD 平移 / Q·E 升降 / C 切换），未依赖 OrbitControls 示例模块。
  - 性能：实例化窗/角塔/扶壁，约 172 DrawCalls / 90k 三角面；画质按钮切换 pixelRatio；火焰可开关。
- 验证记录（2026-11-13，Qoder Desktop 内置浏览器，HTTP 打开，脚本断言；内置视口 0×0，强制 resize 1280×800 后渲染）：
  - WebGL 上下文未丢失、gl.getError()=0、控制台无 Shader 编译报错。✔
  - 场景统计：25 塔 / 596 窗 / 152 角塔 / 44 扶壁 / 27 火盆 / 1890 火焰粒子；172 DrawCalls / 90284 三角面。✔
  - readPixels 中心 [34,47,70]、天空 [110,125,156] 均非黑，确认城市与天空渐变实际绘出。✔
  - 自动 ↔ 手动模式切换、火焰粒子开关均生效。✔
  - 60FPS 实测与真机视觉留待 Playwright（内置浏览器视口受限）。
- 待确认（按提示词标示并继续，未中断）：
  - 『待确认』后期 Bloom 需 EffectComposer / UnrealBloomPass 等额外模块；为保持单文件与 file:// 可用，改用加色发光与自发光窗替代，未引入。
  - 『待确认』OrbitControls 示例模块未引入；已用内置自定义轨道/飞行控制器实现等效漫游。
- 复盘：哥特「垂直感」靠高尖顶 + 角塔 + 尖拱窗比例营造；夜景用自发光窗 + 火焰加色粒子 + 月光冷调形成冷暖对比，避免实时阴影开销。实例化把数百扇窗压到 1 个 DrawCall 是性能关键。海浪用解析有限差分法线比 CPU 逐顶点更新更省且更平滑。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--qwen4-max-preview-xhigh-r01`
- 模型：Qwen4-Max-Preview；推理档位：xhigh
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：批量指令原文与任务正文 v1 原文完整保存；同指令重复发送 3 次，内容一致。
- 工具：Qoder Desktop。当前会话直接执行；模型 Qwen4-Max-Preview，档位 xhigh；Windows 11，Node v24.22.1；未委派子代理。 用户确认供应商 aliyun、工具 qoder，整批 11 例耗时 1h 20s（3620 秒），费用与 Token 未提供，不分摊；其他执行条件为源声明。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：aliyun 批次合计 金额未记录（11 个案例；批次 qwen4-max-preview-xhigh-qoder-2026-11-13；未记录单案例费用）
- [新哥特式塔楼城市 3D 漫游](../../../../demos/neo-gothic-tower-city/runs/qwen4-max-preview-xhigh-r01/index.html)

### 部署适配记录

- 2026-11-13：从 F:/dev/ai-coding-demo-test 未提交结果迁入，源基准提交 452ac588702d3bde24f048fcf47cc5ffa7abb602；保留原始输入与复盘，不合并测试基线。
- 2026-11-13：追加 defer 公共统计引用，补采真实截图，按 v3 由 Codex 逐图视觉复核；源声明不等于独立功能验收。
- 2026-11-13：本次视觉复核边界：Codex 逐图 AI 视觉复核，仅评价归档可见证据；非人工完整功能验收或模型能力排名。
- 2026-11-13：根路径与 Pages 子路径全部入口、原始输入、截图、对比 iframe、390px 无页面水平溢出及静态 file:// 检查完成；细项见 catalog/score-reviews/2026-11-13-qwen4-max-preview-xhigh-import.json。
<!-- archive:end -->
