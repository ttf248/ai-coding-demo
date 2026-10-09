# 彩色流体实验台

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

单文件网页实现，入口为 [index.html](index.html)。零外部依赖，支持 `file://` 直接运行与静态 HTTP 托管。

核心实现：
1. **真实 Navier-Stokes 欧拉流体模拟**：编写自定义 GLSL 着色器，包含平流（Semi-Lagrangian Advection）、散度求解（Divergence）、雅可比泊松压力迭代（Jacobi Pressure Solver）和速度无散投影（Velocity Projection），实现真实的涡流、剪切与阻尼混色。
2. **交互响应**：沿鼠标或触控拖拽向量施加动量梯度并注入染料；支持多指触控与连续注入。
3. **参数控制与健壮性**：可动态调节注入力度、半径、染料消散率、压力迭代次数与计算网格分辨率；提供暂停、清空、重置与 PNG 导出；对 WebGL 不支持环境展示友好警示。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--gemini-3-8-flash-high-r01`
- 模型：Gemini 3.8 Flash；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：使用当前模型执行 v1 任务正文。
- 工具：Copilot SDK in VS Code。当前会话直接执行生成与验证。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：GitHub Copilot 批次合计 $2.76 USD（11 个案例；原始消耗 414 GitHub Copilot credits，换算比例 10 USD / 1500 GitHub Copilot credits；批次 github-copilot-gemini-3-8-flash-high-2026-10-09；未记录单案例费用）
- [流体模拟](../../../../demos/fluid-simulation/runs/gemini-3-8-flash-high-r01/index.html)

### 部署适配记录

- 来源：模型测试分支 `experiment/gemini-3.8-flash`，提交 `7fea10d`。迁入时原始输入与实现未改写；迁入后通过本地 HTTP 打开入口并补拍实际运行截图 `screenshot.png`。
<!-- archive:end -->
