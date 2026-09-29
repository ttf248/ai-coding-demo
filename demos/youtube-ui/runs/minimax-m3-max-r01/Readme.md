# YouTube · UI 模块设计参考

## 原始提示词

完整原始输入见 [prompt.md](prompt.md)。

## 运行与复盘

按 v1 任务正文“资深全栈 + 设计视角 → APP 功能拆解 → 多个 mockup 边框横向排列 → 玻璃拟态 → Tailwind + Lucide CDN → 图片使用 Unsplash”执行。

页面与功能（每个 mockup 独立）：

1. **首页**：logo、搜索、过滤 chips、视频卡、底部 Tab（中间凸起 FAB）
2. **播放器**：大封面、点赞 / 点踩 / 分享 / 下载 / 剪辑、简介
3. **发现**：分类瀑布、热门 hashtag
4. **创作中心**：上传 / 直播 / 短片 / 数据分析入口
5. **订阅**：关注头像横滚 + 视频流
6. **个人中心**：头像、统计、观看记录、稍后再看、隐私

实现要点：

- 所有 mockup 以 iPhone (390 × 800) 为基准，使用 CSS 模拟设备边框、刘海、状态栏
- Tailwind 通过 CDN 注入；Lucide 图标通过 `unpkg.com/lucide-static@latest/icons/*.svg` 引用，不输出 svg 路径
- 图片使用 Unsplash 直链
- 玻璃拟态：`.glass-bar` 与 `.glass-card` 使用 `rgba(255,255,255,0.05~0.7)` + `backdrop-filter`
- FAB 中央 Tab 使用 `accent` 渐变类，符合 YouTube 经典风格
- 界面在窗口中不出现滚动条（mockup 内部按需滚动）

## 验证记录

- 直接打开 `index.html`，6 个 mockup 横向排列
- 移动端 390px 视口下 mockup 完整呈现
- 无水平溢出；CDN 资源需要联网

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`youtube-ui--minimax-m3-max-r01`
- 模型：MiniMax M3；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=youtube-ui)
- 输入记录：原 prompts/v1/prompt.md 完整保存；hash 与 prompts/v1/prompt.json 保持一致。
- 工具：Claude Code (MiniMax-M3)。当前会话直接执行；不使用 worktree 或子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [UI 模块合集](../../../../demos/youtube-ui/runs/minimax-m3-max-r01/index.html)

### 部署适配记录

- 所有图标通过 lucide-static CDN 加载，不输出 SVG 路径。
- mockup 内滚动通过 overflow-x-auto 实现，外部窗口无滚动条。
- 归档来源：F:\dev\ai-coding-demo-test（model-test-base 分支）中的 demos/youtube-ui/runs/minimax-m3-max-r01；按原实验轮次导入。
<!-- archive:end -->
