# 奇幻地图生成器

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：纯静态单文件，file:// 直接打开或 HTTP 静态托管均可，无网络依赖。
- 入口：[index.html](index.html)
- 执行模型：Kimi K3，档位 high，Copilot CLI（VS Code）当前会话直接执行。
- 验证记录（Node 复算同一算法）：
  - 相同种子与参数两次生成的高度图逐位一致 ✓；不同种子结果不同 ✓
  - 随机抽样 2000 条最陡下降路径，全程高度单调不升，河流不会穿越山峰 ✓
  - 画笔抬升/降低会重新分类地形并重建河流与城镇 ✓
  - 缩放围绕指针位置，编辑坐标随缩放正确换算；导出 PNG 含当前地图与城镇标签 ✓
- 复盘：一次生成完成，未做追加修复。地形为值噪声 fBm 加岛屿径向衰减；河流遇局部低点淹没小盆地形成内陆湖并终止；装饰（山脉三角、森林树标）由种子驱动，保证同种子视觉一致。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fantasy-map-generator--kimi-k3-high-r01`
- 模型：Kimi K3；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fantasy-map-generator)
- 输入记录：完整输入即主题任务正文 v1，无附加上下文。
- 工具：GitHub Copilot CLI（VS Code）。model-test-base 独立克隆中由当前会话直接执行；模型 kimi-k3，档位 high；未委派子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：GitHub Copilot 批次合计 $5.89 USD（11 个案例；原始消耗 883 GitHub Copilot credits，换算比例 10 USD / 1500 GitHub Copilot credits；批次 github-copilot-kimi-k3-high-2026-10-09；未记录单案例费用）
- [奇幻地图生成器](../../../../demos/fantasy-map-generator/runs/kimi-k3-high-r01/index.html)

### 部署适配记录

- 2026-10-09 fix：首版遗漏 setStatus 定义，浏览器验证重新生成/画笔时报 ReferenceError；补上函数定义后复测通过。
- 来源：模型测试分支 `experiment/kimi-k3`，提交 `793b2ac`。迁入时原始输入与模型产物未改写；迁入后通过本地 HTTP 打开入口并补拍实际运行截图 `screenshot.png`。
<!-- archive:end -->
