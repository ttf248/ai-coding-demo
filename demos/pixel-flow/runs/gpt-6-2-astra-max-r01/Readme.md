# 像素回流

[本次输入](prompt.md) · [共用任务正文](../../prompts/v1/prompt.md)

## 运行

打开 index.html，选择图片与采样间距。通过 localhost 或 HTTPS 允许摄像头权限，张开手掌吸引粒子，握拳暂停吸引。也可按住画布使用指针交互。

## 实现与复盘

Canvas 读取像素，Three.js 缓冲几何保留颜色与目标坐标。手势使用掌心尺度和指尖伸展程度归一化判断，摄像头与模型在点击启用时加载。

## 验证记录

验证了本地选图、采样密度、全图复位、重新打散、指针局部吸引，以及无摄像头提示。又将张掌与握拳样张作为虚拟摄像头视频送入真实 MediaPipe 模型，观察到两种识别结果和粒子吸引。关闭后视频流释放。此项使用测试视频输入。

在本地 HTTP、直接打开文件和 390px 视口下检查了入口，页面没有横向溢出。

<details>
<summary>随附照片来源（Unsplash）</summary>

- [lake](https://images.unsplash.com/photo-1470770841072-f978cf4d019e)

</details>

手势测试视频使用 MediaPipe 官方测试样张。[张掌](https://storage.googleapis.com/mediapipe-assets/right_hands.jpg) · [握拳](https://storage.googleapis.com/mediapipe-assets/fist.jpg)

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--gpt-6-2-astra-max-r01`
- 模型：GPT-6.2-Astra；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：保存两条用户消息和本案例读取的完整版本正文。批量实验共享同一会话，本快照未逐条收录其余工具输出和运行时上下文。
- 工具：Codex。按用户提供的信息登记 GPT-6.2-Astra / max。Windows、PowerShell、Node.js 22.16.0。使用当前测试克隆及同一会话，由主代理直接生成。 首次产物生成后的验收期间，用户追加消息「继续」。同一会话继续验证，无人工代写或手工改动。 工具版本由用户提供：Codex v0.169.1。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI 批次合计 $8.74 USD（11 个案例；批次 gpt-6-2-astra-max-codex-plus-2026-11-18；未记录单案例费用）
- [主页面](../../../../demos/pixel-flow/runs/gpt-6-2-astra-max-r01/index.html)

### 部署适配记录

- 从 experiment/gpt-6-2-astra-max 的 780cbd8d 导入；首轮提交为 cd9b208b。保留原始输入和测试分支的复盘、素材及验收说明。
- 维护者为网页入口接入公共访问统计脚本。
- 源分支无截图。维护者在 main 采集桌面与移动证据，由 Codex 逐帧按 v3 复核并登记封面。
<!-- archive:end -->
