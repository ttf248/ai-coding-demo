# 奇幻岛屿地图 · gpt-6.1-sol max

确定性岛屿地形、下降水系及内陆湖，支持地形画笔、撤销、缩放与完整地图 PNG 导出。

## 输入与运行

[输入记录](prompt.md)保留批量请求及四个任务正文。本案例使用 [v1](../../prompts/v1/prompt.md)，模型与档位由用户提供，四个案例在同一会话中依次完成。系统上下文与工具过程未完全留存，不能视为严格隔离的公平评测。

双击 [index.html](index.html) 可通过 file:// 离线打开；也可在仓库根目录执行 `npm run preview` 后通过主题页进入。无需依赖、CDN、安装或构建。

## 实现与复盘

确定性岛屿地形、下降水系及内陆湖，支持地形画笔、撤销、缩放与完整地图 PNG 导出。

[首版产物](iterations/01/index.html)保留检查前的实现，当前入口为本目录 index.html。验证结果与修复记录见下方。

使用种子哈希与分形价值噪声生成高程和湿度。河流按严格下降的邻域方向累计径流，闭合洼地绘制为内陆水体；绘制后重算海岸、水系与地形符号。地图保存独立高分辨率画布，缩放只影响视图，画笔通过逆变换访问地形，PNG 导出完整当前地图。内陆湖为地形洼地的示意表达，不进行完整水文时间模拟。

## 验证记录

- Chromium 145.0.7632.6，Headless; --enable-unsafe-swiftshader。
- 桌面 1440 × 1050 与触摸仿真 390 × 844；通过 HTTP 与 file:// 检查。
- 14 项检查通过，原始结果见 [verification.json](verification.json)。
- [桌面截图](evidence-desktop.png) · [移动布局截图](evidence-mobile.png)。
- 可在仓库根目录执行 `node demos/fantasy-map-generator/runs/gpt-6-1-sol-max-r01/verify.mjs` 重跑专项验收；验证工具使用根目录的 @playwright/test，产品 index.html 本身无依赖。

- 相同种子与参数生成完全相同的地形和 PNG 像素
- 改变种子产生不同地形，恢复种子可复现原地图
- 所有流向严格下降，已绘河流最终进入海洋或内陆湖
- 海平面和粗糙度控制真实影响地图
- 缩放后的画笔修改正确世界坐标且更新海岸水系
- 撤销恢复地形与地图像素，城镇标签可隐藏
- 平移与适合窗口改变视图
- PNG 导出包含当前完整地图，文件像素与画布一致
- 空种子有明确提示且不更改已有地图
- HTTP 页面无脚本错误或外部资源请求
- file:// 可直接打开
- 390px 无页面水平溢出
- 触摸画笔修改地形
- 移动布局无脚本错误

## 本轮修复

- 专项检查发现 Canvas 绘图状态残留会使重复生成的墨线端点不同；每次绘图重置画布状态，确认同种子及参数的 PNG 完全一致。首版源码保留在 iterations/01/index.html。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fantasy-map-generator--gpt-6-1-sol-max-r01`
- 模型：GPT-6.1 Sol；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fantasy-map-generator)
- 输入记录：保留用户批量请求、仓库指令及本会话读取的四个 v1 正文；未完整导出系统/开发者上下文、工具输出与会话内部过程，因此标为 partial。四个案例共享当前会话上下文。
- 工具：Codex。用户指定 gpt-6.1-sol / max，并明确使用当前会话；Windows PowerShell、Node.js v22.16.0。在指定 model-test-base 工作目录中新建实验分支，单代理直接完成，无子代理；未读取远程、其他分支或其他目录的旧实现。纯静态单文件，无构建或外部资源。 无人工改动及追加用户提示；自检修复在 changes 与 iterations 中登记。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [打开实验台](../../../../demos/fantasy-map-generator/runs/gpt-6-1-sol-max-r01/index.html)

### 部署适配记录

- 本轮首次实现；首版源码保存于 iterations/01/index.html。
- 专项检查发现 Canvas 绘图状态残留会使重复生成的墨线端点不同；每次绘图重置画布状态，确认同种子及参数的 PNG 完全一致。首版源码保留在 iterations/01/index.html。
<!-- archive:end -->
