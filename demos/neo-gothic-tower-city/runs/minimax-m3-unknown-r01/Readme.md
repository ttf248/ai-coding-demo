# 雾隐之城 · MiniMax M3

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

按主题 v1 任务生成单 HTML 新哥特式塔楼城市漫游场景，**完全离线**（无 CDN、无远程资源，file:// 直接打开可用）。

实现要点：

- 两套自写 GLSL 着色器：
  - `landVertex/landFragment`：海面焦散、雾、昼夜漂移、`fresnel` 水体。
  - `emberVertex/emberFragment`：附加混合点精灵（灯笼火星、海雾、飞溅）。
- 程序化建模：八角尖塔、柳叶窗（拱肋）、玫瑰窗、玫瑰肋门、扶壁、飞扶壁、横饰旗杆、玄武岩防波堤、灯列石庭。
- 主塔尖顶 ≈140 m，stoneLite 圆柱基座 + 锥形屋顶 + 金色尖束。
- 漫游控制：WASD、Shift 加速、拖拽视角、滚轮高度、触屏方向键 + 双指缩放；闲置 4.5 s 后自动环绕；Tour 按钮自动转向大教堂。
- 昼夜循环：着色器中 `uDayMix` 正弦曲线；夜晚灯笼发光叠加。
- HUD：POI 标签、迷你地图、指南针、区块读数、坐标。
- 颜色：深蓝绿 + 暖金 / 炭红 / 青绿点缀。
- 响应式：≤660 px 断点 + ≤580 px 横屏断点；启动 splash veil + pointer-lock 进入。

直接打开 `index.html` 即可，无网络依赖。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--minimax-m3-unknown-r01`
- 模型：MiniMax M3；推理档位：unknown
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：保留主题 v1 任务正文；无外部依赖。
- 工具：未记录。通过 minimax-m3 模型执行；具体平台上下文未记录。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [主页面](../../../../demos/neo-gothic-tower-city/runs/minimax-m3-unknown-r01/index.html)

### 部署适配记录

- 按主题 v1 任务生成单 HTML 原始 WebGL 新哥特塔城，≈140 m 主塔 + 街区 + 海面 + 灯笼。
- 两套着色器：land（昼夜漂移 + 焦散海面 + 雾）+ ember（灯笼火星 + 海雾 + 飞溅）。
- 支持 WASD / Shift / 拖拽 / 滚轮 / 触屏方向键 / 双指缩放漫游，闲置自动环绕。
- 完全离线：file:// 与本地 HTTP 均可打开。
<!-- archive:end -->
