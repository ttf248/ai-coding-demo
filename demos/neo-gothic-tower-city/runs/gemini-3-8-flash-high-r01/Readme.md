# 新哥特式塔楼城市

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

单文件网页实现，入口为 [index.html](index.html)。通过静态 HTTP 托管或浏览器直接打开。

核心实现：
1. **哥特建筑体量构造**：构建主中央大教堂、玫瑰花窗、高耸交叉飞扶壁（Flying Buttresses）、尖肋拱顶与环绕八角钟楼群，高低错落的飞桥穿梭其间，窗户漫射出温暖灯火。
2. **环境海浪模拟**：利用多重正弦波动态置换大范围海面网格顶点，模拟悬崖礁石下汹涌翻滚的深海暗涌。
3. **粒子氛围与光照**：点光源模拟城堡火炬摇曳闪烁；GPU 粒子系统呈现城堡 parapet 升腾飘散的火焰余烬与薄雾。
4. **多视点交互漫游**：支持电影航拍巡航、低空飞掠穿梭、塔尖俯瞰与自由鼠标拖拽漫游；提供夜月天色风格切换。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--gemini-3-8-flash-high-r01`
- 模型：Gemini 3.8 Flash；推理档位：high
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：使用当前模型执行 v1 任务正文。
- 工具：Copilot SDK in VS Code。当前会话直接执行生成与验证。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：GitHub Copilot 批次合计 $2.76 USD（11 个案例；原始消耗 414 GitHub Copilot credits，换算比例 10 USD / 1500 GitHub Copilot credits；批次 github-copilot-gemini-3-8-flash-high-2026-10-09；未记录单案例费用）
- [塔楼城市漫游](../../../../demos/neo-gothic-tower-city/runs/gemini-3-8-flash-high-r01/index.html)

### 部署适配记录

- 来源：模型测试分支 `experiment/gemini-3.8-flash`，提交 `7fea10d`。迁入时原始输入与实现未改写；迁入后通过本地 HTTP 打开入口并补拍实际运行截图 `screenshot.png`。
<!-- archive:end -->
