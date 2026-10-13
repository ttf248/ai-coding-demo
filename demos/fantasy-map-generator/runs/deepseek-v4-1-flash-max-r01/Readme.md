# 奇幻地图 · 首轮

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文 v1 原文快照）。

## 运行与复盘

- 运行方式：DeepSeek-V4.1-Flash（档位 max）在 Claude Code 当前会话直接生成；未使用子代理、未提供后续追问。
- 产物入口：[index.html](index.html)（纯静态单文件，离线可用）。
- 验证记录（Playwright，HTTP 与 file:// 双路径）：
  - 相同种子重生成指纹一致；不同种子/不同粗糙度产生不同地图
  - 升高海平面后海洋格数增多（27722 → 32235）
  - 河流抽样全程沿填洼水面下降、不穿越非湖泊山峰，终点入海/入湖；编辑后重算仍保持
  - 缩放（滚轮/按钮）与平移后，画笔命中光标下的格子并生效，远处格子不受影响
  - 降低画笔生效；海洋区域连续升高后陆地联动增加（海岸更新）
  - 导出 PNG 有效（约 500KB，PNG 签名校验）
  - 390px 触摸画笔生效；无水平溢出；file:// 打开与 HTTP 指纹一致
- 过程记录：最初按“最低邻格”直接下坡导致洼地截流、河流几乎不可见；改为优先淹没（priority-flood）填洼后再汇流，并以「填平深度」识别湖泊并过滤 1–2 格噪点。确定性来自基于格点哈希的值噪声与种子哈希，不依赖调用顺序。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fantasy-map-generator--deepseek-v4-1-flash-max-r01`
- 模型：DeepSeek-V4.1-Flash；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fantasy-map-generator)
- 输入记录：任务正文 v1 原文。单次输入，未附后续追问或其他上下文。
- 工具：Claude Code 2.1.295。用户指定模型 DeepSeek-V4.1-Flash、档位 max；当前会话直接生成，未使用子代理；Windows 11 / Node v22.16.0。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 2.78 CNY（11 个案例；批次 deepseek-v4-1-flash-max-2026-10-13；未记录单案例费用）
- [主页面](../../../../demos/fantasy-map-generator/runs/deepseek-v4-1-flash-max-r01/index.html)

### 部署适配记录

- 迁移来源：F:/dev/ai-coding-demo-test/demos/fantasy-map-generator/runs/deepseek-v4-1-flash-max-r01；保留原始 r01、完整输入快照与测试产物。
- 迁移验收：通过本地 HTTP 打开实际入口并补拍桌面截图；390px 检查无页面横向溢出，Playwright 控制台无页面错误。
<!-- archive:end -->
