# 彩色流体实验台 · GPT 6 Astra xhigh

## 原始输入与执行条件

见 [完整输入快照](prompt.md)。任务正文采用 v1。用户指定模型 gpt-6-astra、档位 xhigh；在当前会话直接执行，没有委派子代理。11 个活跃案例共享会话上下文，不能视为隔离的独立同题测评。

## 运行

离线单文件；需要 WebGL 2 与 EXT_color_buffer_float。拖动注入速度与染料；可暂停、清空、调参、改网格和截图。

## 实现与复盘

RGBA16F 双缓冲纹理；手工双线性采样、半拉格朗日平流、涡度增强、散度、Jacobi 压力和速度投影。分辨率变化删除旧 GPU 资源。模拟为可视化近似，不用于工程计算。

## 验证

已完成 HTTP、390px 无水平溢出及页面脚本检查；案例功能检查与实际数值见[本轮总报告](../../../../docs/model-tests/2026-10-08-gpt-6-astra-xhigh/Readme.md)和[验收结果](../../../../docs/model-tests/2026-10-08-gpt-6-astra-xhigh/verification.json)。首次代码保存在[首次产物 ZIP](../../../../docs/model-tests/2026-10-08-gpt-6-astra-xhigh/first-output/fluid-simulation.zip)，首次定稿前的修正见 run.json 的 changes。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fluid-simulation--gpt-6-astra-xhigh-r01`
- 模型：GPT-6 Astra；推理档位：xhigh
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fluid-simulation)
- 输入记录：保留用户本轮原文、仓库规则快照及所选任务原文。当前会话顺序完成全部活跃主题，共享上下文；系统/开发者消息和全部工具输出未复制，不能视为独立同输入测评。
- 工具：Codex。Windows / PowerShell；用户指定模型 gpt-6-astra、档位 xhigh；按用户要求沿用当前会话和当前基线目录。单代理直接执行；未读取其他分支、远程或工作目录的历史实现。版本选择：数字最大的可用版本。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [主页面](../../../../demos/fluid-simulation/runs/gpt-6-astra-xhigh-r01/index.html)

### 部署适配记录

- 本轮从空白基线首次实现；没有人工修改。
- 首次定稿前视觉复核：显示通道改用双线性取样，平滑网格放大时的像素边缘；计算网格不变。
<!-- archive:end -->
