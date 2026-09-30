# 生活情绪日记

模型：gpt-6.1-sol；档位：medium；任务版本：v1。当前会话顺序实现，无子代理。

## 输入与边界

见 [原始输入](prompt.md)。保存用户指令、仓库规则和任务正文；其他会话上下文未完整留存。



## 运行

联网后直接打开 index.html，或从仓库静态服务器访问。

## 实现与复盘

八个 375px 页面；本机日记保存与导出、示例情绪图表、本地固定回复、计划勾选。按任务保留 canghe_app_prototype.html，同时以 index.html 为归档入口。情绪洞察和 AI 回复是原型示例，未接入真实 AI。

[首版快照说明](evidence/README.md) · [验证与限制](evidence/validation.md)。首版代码保留，修复没有覆盖首版快照。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--gpt-6-1-sol-medium-r01`
- 模型：gpt-6.1-sol；推理档位：medium
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：保存用户本轮原始请求、仓库规则与读取的任务原文。当前会话逐个执行，并非独立会话；系统/开发者上下文、工具输出及前序案例上下文未逐字复制，不能视为独立同输入评测。
- 工具：Codex。Windows PowerShell / Node 22.16.0；当前会话执行，无子代理。模型 gpt-6.1-sol、档位 medium 由用户明确指定。默认选择各主题最大提示词版本。未读取其他分支、工作目录或远程历史实现。 验证：Chromium headless（WebGL 使用 SwiftShader）；实际摄像头手势与实体设备帧率未验证。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [生活情绪日记](../../../../demos/life-diary/runs/gpt-6-1-sol-medium-r01/index.html)
- [任务指定文件名](../../../../demos/life-diary/runs/gpt-6-1-sol-medium-r01/canghe_app_prototype.html)

### 部署适配记录

无新增实现改动。
<!-- archive:end -->
