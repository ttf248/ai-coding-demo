# 静心 · GPT 6 Luna Max

## 本轮实现

单页冥想 iOS 原型，覆盖练习浏览与搜索、详情、计时播放、完成反馈、练习进度和个人设置。练习收藏、每日目标与偏好保存在本地状态。

## 运行与验证

浏览器直接打开 `index.html`。Tailwind CSS 与 Unsplash 图片使用 CDN，需要联网。目标模型通过 Codex CLI 的 `gpt-6-luna`、`max` 档位执行；内联脚本语法与 HTML 标签配对检查通过。

原始任务：[prompt.md](prompt.md)

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`meditation--gpt-6-luna-max-r01`
- 模型：GPT 6 Luna；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=meditation)
- 输入记录：完整保留主题 v1 提示词正文；未引入其他参考资料。
- 工具：Codex CLI。通过 --model gpt-6-luna 与 model_reasoning_effort=max 执行；CLI 完成并返回代码，具体平台上下文未随实验导出。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [主页面](../../../../demos/meditation/runs/gpt-6-luna-max-r01/index.html)

### 部署适配记录

- 基于主题 v1 新建独立冥想 iOS 原型，保留历史实验。
- 将首页、练习发现、详情、计时播放、完成页、练习记录与个人设置收在同一文件。
- 加入搜索、收藏、计时、进度及偏好本地状态；使用 Tailwind CDN 和 Unsplash 图片。
<!-- archive:end -->
