# 奇幻地图生成器

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：浏览器直接打开本目录 `index.html`（file:// 或 HTTP 静态托管均可），无后端、无 CDN、无构建步骤。
- 入口：`index.html`（单文件，HTML/CSS/JS 全部内联）。
- 实现要点：
  - 种子化：xmur3 字符串哈希 + mulberry32 PRNG + 值噪声 fBm；同一种子与参数（海平面、粗糙度）生成完全一致的地形、河流与城镇。
  - 地形：160×160 高度场 + 湿度场，径向岛屿衰减；分类为海洋 / 海岸 / 平原 / 森林 / 山脉。
  - 河流：从高地在 8 邻域最陡下降追踪，入海或在洼地 / 回环处形成内陆湖；按汇流量加粗河段，保证不穿越山峰。
  - 画笔：升高 / 降低地形（余弦衰减），编辑后海岸、河流、城镇自动重算。
  - 视图：滚轮缩放（指向光标）、拖动平移、双指捏合缩放；离屏 2× 地图缓存保证平移缩放流畅。
  - 手绘风格：纸张斑点、海岸描线、森林三角符号、山脉晕线、波纹、城镇标签、指北针、图例与标题图廓均绘制在画面内。
  - 导出：canvas.toBlob 下载当前视图 PNG（含图例）。
- 验证记录（2026-11-13，Qoder Desktop 内置浏览器，file:// 打开，脚本断言）：
  - 同种子两次生成高度场指纹一致；换种子结果不同。✔
  - 5 条河流全部单调下降，2 条入海、3 条入内陆湖（5 处洼地湖）。✔
  - 升高画笔确实改变高度场并触发河流重算。✔
  - 3× 缩放 + 平移后屏幕↔世界坐标往返误差 < 0.5 格；缩放后涂抹命中正确格子。✔
  - PNG 导出 dataURL 有效（>10KB）。✔
  - 城镇 7 座、图例 6 项渲染正常。✔
  - 最终 Playwright 复核（390px/1280px + file://）发现并修复一处初始化顺序缺陷：`resize()` 先于 `generate()` 触发 `renderMap()`，读取 null 的 `state.height` 抛 TypeError；改为 `if (state.dirty && state.height) renderMap()` 后各视口与 file:// 均无报错，地图中心像素 [188,160,120] 正常绘出。✔
- 复盘：内置浏览器视口为 0×0（隐藏窗口）导致首轮画布宽度为 0、坐标测试失败；以 600px 视口重测全部通过，属测试环境问题而非实现缺陷。河流源头选取要求高地分散（间距 > 22 格），避免河流重叠；城镇只落在近水低坡平原 / 海岸。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fantasy-map-generator--qwen4-max-preview-xhigh-r01`
- 模型：Qwen4-Max-Preview；推理档位：xhigh
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fantasy-map-generator)
- 输入记录：批量指令原文与任务正文 v1 原文完整保存；同指令重复发送 3 次，内容一致。
- 工具：Qoder Desktop。当前会话直接执行；模型 Qwen4-Max-Preview，档位 xhigh；Windows 11，Node v24.22.1；未委派子代理。 用户迁入时确认供应商 aliyun、工具 qoder，整批 11 例耗时 1h 20s（3620 秒），费用和 Token 未提供，不分摊至单案例；其余执行条件为源记录声明。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：aliyun 批次合计 金额未记录（11 个案例；批次 qwen4-max-preview-xhigh-qoder-2026-11-13；未记录单案例费用）
- [地图生成器](../../../../demos/fantasy-map-generator/runs/qwen4-max-preview-xhigh-r01/index.html)

### 部署适配记录

- 2026-11-13 最终浏览器校验发现初始化顺序缺陷：resize() 先于 generate() 触发 renderMap()，读取 null 的 state.height 抛 TypeError。修复：render() 中改为 if (state.dirty && state.height) renderMap()，数据就绪前跳过离屏渲染。修复后 390px/1280px 与 file:// 均无报错，地图正常绘出。
- 2026-11-13：从 F:/dev/ai-coding-demo-test 未提交工作区迁入，源基准提交 452ac588702d3bde24f048fcf47cc5ffa7abb602；保留原始输入字节与源复盘，不合并测试基线。
- 2026-11-13：迁入后追加 defer 公共统计引用，补采真实页面并按现行 v3 由 Codex 逐图视觉复核；源码声明和截图不等同完整功能验收。
- 2026-11-13：本次视觉复核边界：Codex 逐图 AI 视觉复核，仅评价归档可见证据；非人工完整功能验收或模型能力排名。
- 2026-11-13：根路径与 Pages 子路径全部入口、原始输入、截图、对比 iframe、390px 无页面水平溢出及静态 file:// 检查完成；细项见 catalog/score-reviews/2026-11-13-qwen4-max-preview-xhigh-import.json。
<!-- archive:end -->
