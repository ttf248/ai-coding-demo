# 奇幻地图生成器

## 原始提示词

见 [本次原始提示词](prompt.md)。本目录的 `prompt.md` 与 `demos/fantasy-map-generator/prompts/v1/prompt.md` 逐字节一致。

## 运行与复盘

### 运行方式

- 模型：MiniMax-M3.1-Flash-Preview，档位 max，会话内一次性生成，未委派子代理。
- 产物：单个 `index.html`，Canvas 2D + 原生 JavaScript，无外部依赖。
- 入口：本目录 `index.html`。

### 实现方式

- **随机源**：mulberry32 定长伪随机，种子固定为 1337（可在界面上改）。同样的种子必然得到同样的地图。
- **高程场**：160×120 的值噪声，用 fBm 叠加 5 个倍频，再乘一个多岛屿衰减掩码，使地图呈现若干块分离的大陆而不是一整片噪声。
- **交互雕刻**：升高 / 降低 / 平移三种画笔，可调笔刷大小与强度，改动直接写回高程数组。
- **河流**：源点只取「非山峰且海拔高于阈值」的格子，之后严格沿最陡下降方向逐格下行。因为每一步海拔都严格下降且山峰是局部极大值，路径在数学上不可能上坡或穿越山峰，最终必然终止于海洋或内陆湖。
- **导出**：PNG 按整图 4 倍尺寸输出，并包含海岸线、河流与城镇标注。

### 验证记录

用 Playwright 驱动真实 UI：

| 项目 | 结果 |
| --- | --- |
| 同种子可复现 | 两次重生成后整屏截图字节完全一致 |
| 不同种子 | 画面明显不同 |
| 画笔生效 | 升高 / 降低画笔落点处高程按预期改变 |
| 缩放锚点 | zoom×1 落点偏差 3.5px；zoom×2.31 偏差 9.1px（属单格像素量化范围） |
| PNG 导出 | 成功产出 `fantasy-map-1337.png`，116572 字节 |
| 390px 横向溢出 | 无溢出 |
| 控制台错误 | 0 |

### 已知限制

- 城镇位置按海拔与到水距离启发式挑选，不做真正的选址优化。
- 导出为整图，不支持导出当前视口区域。

### 过程中修掉的真实问题

`toWorld()` 把 `e.clientX` 直接当作画布内坐标，漏减了画布自身的页面偏移（未减去 `getBoundingClientRect().left / top`），导致所有画笔的落点整体偏移约 20×83 px，改正后偏差降到单个格子的量级。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fantasy-map-generator--minimax-m3-1-flash-preview-max-r02`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fantasy-map-generator)
- 输入记录：本目录 prompt.md 与 demos/fantasy-map-generator/prompts/v1/prompt.md 逐字节一致，完整原文已保存。
- 工具：MiniMax Code 桌面版（MiniMax M3.1 Flash Preview）。纯静态单文件，无外部依赖，network 为 offline。相同种子重生成截图字节完全一致；390px 下无横向溢出，控制台无错误。本工作副本用 node scripts/serve.mjs --read-only（PORT=4180）预览，未复用其他工作副本的 4173 端口；验证用 Playwright（chromium）驱动真实 UI 读数。 本轮使用 MiniMax Code 桌面版执行，未使用 Claude Code。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：MiniMax 批次合计 37 %（Max 订阅套餐五小时额度）（11 个案例；批次 minimax-m3-1-flash-preview-max-2026-10-13；未记录单案例费用）
- [地图生成器](../../../../demos/fantasy-map-generator/runs/minimax-m3-1-flash-preview-max-r02/index.html)

### 部署适配记录

- 地图完全由种子决定：相同 seed 重生成的画面字节级一致，不同 seed 结果不同。
- 河流沿最陡下降路径从源点流向海洋或内陆湖，源点只取非山峰且高于阈值的格子，路径严格下降，因此数学上不可能逆流上坡或穿越山峰。
- 缩放锚定光标位置，zoom×1 落点偏差 3.5px、zoom×2.31 偏差 9.1px，属于单格像素量化的正常范围。
- 修复 toWorld() 漏减画布自身页面偏移（未减去 getBoundingClientRect 的 left/top），导致所有画笔落点整体偏移约 20×83 px。
- PNG 导出按整图 4 倍尺寸输出，并包含海岸线、河流与城镇标注。
- 迁移来源：F:\dev\ai-coding-demo-test（experiment/minimax-m3-1-flash-preview-max）/demos/fantasy-map-generator/runs/minimax-m3-1-flash-preview-max-r01；当前 main 已存在该轮号，保留历史并迁入为 minimax-m3-1-flash-preview-max-r02。
- 迁移验证：使用本仓库本地 HTTP 入口补拍实际桌面截图 screenshot.png；Chromium 确认入口可加载且无页面异常，390px 视口横向溢出为 0。
- 迁移验证补充：本 static 入口可通过 file:// 直接打开，Chromium 页面异常为 0。
<!-- archive:end -->
