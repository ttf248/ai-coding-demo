# 直流电路实验台

## 原始提示词

见 [本次原始提示词](prompt.md)。本目录的 `prompt.md` 与 `demos/circuit-lab/prompts/v1/prompt.md` 逐字节一致。

## 运行与复盘

### 运行方式

- 模型：MiniMax-M3.1-Flash-Preview，档位 max，会话内一次性生成，未委派子代理。
- 产物：单个 `index.html`，SVG 画布 + 原生 JavaScript，无任何外部依赖，断网也能直接双击打开。
- 入口：本目录 `index.html`。

### 求解方式

没有使用任何查表或近似公式，全部为真实数值计算：

1. 端子拖放和连线会生成无向边，用**并查集**识别哪些节点属于同一个连通子图。
2. 对每个连通子图，参考地 + 各节点电压作未知量，用**改进节点法（MNA）**组装方程组：电阻按电导矩阵入式，电池按电压源入式。
3. 稠密矩阵**高斯消元**（带部分主元）解出全部节点电压。
4. 回算每条支路的电流（欧姆定律 / 电源定义）、电压和功率。

短路单独处理：电源正负端子被导线直接短接时不求解，改为显式提示，不输出编造的有限电流值。

### 验证记录

用 Playwright 驱动真实 UI，读取界面输出的数值：

| 预设 | 实测结果 |
| --- | --- |
| 串联（12V + 100Ω + 200Ω） | 总电流 0.0400 A；电源 12.000V / 0.4800W，re1 4.000V / 0.1600W，re2 7.999V / 0.3200W |
| 并联 | 支路 0.1200 A 与 0.0600 A，总电流 0.1800 A |
| 断开开关 | 所有支路电流均为 0.0000 A |
| 电池短路 | 提示「电源短路：电池 ba1 的正负端子被导线直接短接」，不显示伪造电流 |

- 390px：`scrollWidth == clientWidth`，无横向溢出。
- 控制台错误：0。

### 已知限制

- 只支持直流电阻性/理想电压源网络，不含电容电感与交流。
- 悬空节点不参与求解，不报错误。

### 过程中修掉的真实问题

1. 指针捕获后 `e.target` 失效，导致元件拖不动，改用 `document.elementFromPoint` 命中。
2. 端子的命中判定圈被元件主体矩形盖住，点不到端子。
3. 结果表格把页面撑出横向滚动条，改为 `#result{overflow-x:auto}`。
4. 电池输出电流的符号方向反了（取负）。
5. 一处 `} else {…} else if` 语法错误导致整页白屏。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`circuit-lab--minimax-m3-1-flash-preview-max-r01`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=circuit-lab)
- 输入记录：本目录 prompt.md 与 demos/circuit-lab/prompts/v1/prompt.md 逐字节一致，完整原文已保存。
- 工具：MiniMax Code / MiniMax-M3.1-Flash-Preview。纯静态单文件，无外部依赖，network 为 offline。390px 下 scrollWidth == clientWidth，控制台无错误。本工作副本用 node scripts/serve.mjs --read-only（PORT=4180）预览，未复用其他工作副本的 4173 端口；验证用 Playwright（chromium）驱动真实 UI 读数。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [电路实验台](../../../../demos/circuit-lab/runs/minimax-m3-1-flash-preview-max-r01/index.html)

### 部署适配记录

- 真实电路求解：电源与各元件形成 MNA 方程组，高斯消元解出节点电压，再按欧姆定律回算支路电流与功率，不使用任何伪造结果。
- 电池短路时不输出编造的有限电流，而是显式提示「电源短路：正负端子被导线直接短接」。
- 修复指针捕获后 e.target 失效导致拖不动、端子命中圈被元件主体遮挡、结果表格撑出横向滚动条、电池电流符号方向相反、以及一处 else/else if 语法错误导致整页白屏。
- 并联预设去掉了多余的 200Ω 灯泡，使总电流恰为 0.18 A（100Ω 支路 0.12 A + 200Ω 支路 0.06 A）；灯泡仍可从元件库手动添加。
<!-- archive:end -->
