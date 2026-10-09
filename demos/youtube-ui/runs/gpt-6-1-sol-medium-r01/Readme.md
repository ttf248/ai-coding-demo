# YouTube UI 模块

模型：gpt-6.1-sol；档位：medium；任务版本：v1。当前会话顺序实现，无子代理。

## 输入与边界

见 [原始输入](prompt.md)。保存用户指令、仓库规则和任务正文；其他会话上下文未完整留存。

未提供具体 APP 需求，以现有 YouTube 主题描述规划五个模块；用户要求全部完成，因此一次交付所有模块。Artifacts 插件不可用，使用本地浏览器预览。

## 运行

联网后直接打开 index.html，或从仓库静态服务器访问。

## 实现与复盘

五个独立模块、十五个手机界面：推荐/订阅/通知、播放/评论/本地播放器、探索/搜索/频道、个人/历史/设置、概览/上传/内容管理。使用 Tailwind CDN、Unsplash 与 Lucide Static；模拟订阅/评论不连接 YouTube。

[首版快照说明](evidence/README.md) · [验证与限制](evidence/validation.md)。首版代码保留，修复没有覆盖首版快照。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--gpt-6-1-sol-medium-r01`
- 模型：GPT-6.1 Sol；推理档位：medium
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：保存用户本轮原始请求、仓库规则与读取的任务原文。当前会话逐个执行，并非独立会话；系统/开发者上下文、工具输出及前序案例上下文未逐字复制，不能视为独立同输入评测。
- 工具：Codex。Windows PowerShell / Node 22.16.0；当前会话执行，无子代理。模型 gpt-6.1-sol、档位 medium 由用户明确指定。默认选择各主题最大提示词版本。未读取其他分支、工作目录或远程历史实现。 验证：Chromium headless（WebGL 使用 SwiftShader）；实际摄像头手势与实体设备帧率未验证。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI · ChatGPT Plus 订阅；单案例货币金额未记录。据用户说明，OpenAI 模型通过 ChatGPT Plus 订阅测试；全部案例完成后，五小时额度未耗尽。未提供单案例费用金额。
- [首页推荐](../../../../demos/youtube-ui/runs/gpt-6-1-sol-medium-r01/index.html)
- [播放与互动](../../../../demos/youtube-ui/runs/gpt-6-1-sol-medium-r01/watch.html)
- [发现与搜索](../../../../demos/youtube-ui/runs/gpt-6-1-sol-medium-r01/discover.html)
- [个人中心](../../../../demos/youtube-ui/runs/gpt-6-1-sol-medium-r01/profile.html)
- [创作中心](../../../../demos/youtube-ui/runs/gpt-6-1-sol-medium-r01/studio.html)

### 部署适配记录

- 未提供具体 APP 需求，以现有 YouTube 主题描述规划五个模块；用户要求全部完成，因此一次交付所有模块。Artifacts 插件不可用，使用本地浏览器预览。
<!-- archive:end -->
