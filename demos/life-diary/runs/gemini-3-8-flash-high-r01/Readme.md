# 生活情绪日记原型

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

单文件网页实现，入口为 [canghe_app_prototype.html](canghe_app_prototype.html)（同目录提供 [index.html](index.html) 便捷重定向）。通过静态服务器或浏览器直接打开。

核心实现：
1. **多屏幕原型规划**：基于 iPhone 375px 标准宽度，规划设计了 5 个核心原型界面：
   - 首页：今日情绪天气打卡、AI 情绪晨语、连续记录统计与日记流。
   - AI 倾听室：双向共情对话气泡、心理学微行动建议与安全倾诉树洞。
   - 日记编辑器：标题、多模态配图、正文润色与 AI 情绪温度打分。
   - 洞察周报：平滑情绪波浪曲线、主导情绪占比环图与复盘小结。
   - 助手工具箱：4-7-8 正念呼吸、感恩日常、白噪音与焦虑粉碎机。
2. **UI/UX 规范**：使用 Tailwind CSS 结合 FontAwesome 图标与 Unsplash 高清摄影，支持并排总览与单屏聚焦切换。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`life-diary--gemini-3-8-flash-high-r01`
- 模型：Gemini 3.8 Flash；推理档位：high
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=life-diary)
- 输入记录：使用当前模型执行 v1 任务正文。
- 工具：Copilot SDK in VS Code。当前会话直接执行生成与验证。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [情绪日记原型](../../../../demos/life-diary/runs/gemini-3-8-flash-high-r01/canghe_app_prototype.html)

### 部署适配记录

无新增实现改动。
<!-- archive:end -->
