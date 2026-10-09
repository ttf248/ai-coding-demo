# 彩色流体实验台

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：纯静态单文件，file:// 直接打开或 HTTP 静态托管均可，无网络依赖；需要支持 WebGL2 + `EXT_color_buffer_float` 的浏览器。
- 入口：[index.html](index.html)
- 执行模型：Kimi K3，档位 high，Copilot CLI（VS Code）当前会话直接执行。
- 实现与验证记录：
  - 管线为真正的稳定流体：半拉格朗日平流 → 散度 → 压力雅克比迭代（可调 4–60 次）→ 梯度减除投影，染料随速度场平流演化 ✓
  - 拖动方向与速度决定注入的动量与染料颜色，多点触摸各自注入 ✓
  - 暂停后 `step` 停止，画面不再演化；清空通过重建 FBO 移除全部流体 ✓
  - 模拟分辨率切换与重置参数前调用 `deleteTexture`/`deleteFramebuffer` 释放旧 GPU 资源 ✓
  - 设备像素比限制为 2，染料分辨率固定 512；不支持 WebGL2 时显示明确错误提示而非空白页 ✓
  - PNG 截图使用 `preserveDrawingBuffer` 并在导出前重渲染当前帧 ✓
- 复盘：一次生成完成，未做追加修复。窗口尺寸变化只影响显示缓冲与指针坐标换算，模拟场分辨率独立，触摸坐标按 `getBoundingClientRect` 实时换算。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--kimi-k3-high-r01`
- 模型：Kimi K3；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：完整输入即主题任务正文 v1，无附加上下文。
- 工具：GitHub Copilot CLI（VS Code）。model-test-base 独立克隆中由当前会话直接执行；模型 kimi-k3，档位 high；未委派子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：GitHub Copilot 批次合计 $5.89 USD（11 个案例；原始消耗 883 GitHub Copilot credits，换算比例 10 USD / 1500 GitHub Copilot credits；批次 github-copilot-kimi-k3-high-2026-10-09；未记录单案例费用）
- [彩色流体实验台](../../../../demos/fluid-simulation/runs/kimi-k3-high-r01/index.html)

### 部署适配记录

- 2026-10-09 fix：首版遗漏 setStatus 定义，浏览器验证控制按钮时报 ReferenceError；补上函数定义后复测通过。
- 来源：模型测试分支 `experiment/kimi-k3`，提交 `793b2ac`。迁入时原始输入与模型产物未改写；迁入后通过本地 HTTP 打开入口并补拍实际运行截图 `screenshot.png`。
<!-- archive:end -->
