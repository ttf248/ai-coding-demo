# 奇幻地图生成器

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

单文件网页实现，入口为 [index.html](index.html)。零外部依赖，支持 `file://` 直接运行与静态 HTTP 托管。

核心实现：
1. **确定性程序生成**：基于自定义 Mulberry32 伪随机种子发生器与多倍频噪声算法，同一种子与参数完全确定性重现相同地形；支持自由调整海平面与地貌粗糙度。
2. **手绘复古地貌**：提供深海、沿岸、浅滩、平原、森林、山脉雪峰多级自然分带，配合手绘山脊等高符号与岛屿轮廓。
3. **物理水流路径**：从高海拔山峰计算最大坡降下坡路径流向海洋，杜绝逆坡翻山。
4. **画笔交互与视口**：支持升高与降低地形画笔，涂刷时同步联动海岸线与河流；支持平移缩放、城镇名称标记切换与高分辨率 PNG 导出。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fantasy-map-generator--gemini-3-8-flash-high-r01`
- 模型：Gemini 3.8 Flash；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fantasy-map-generator)
- 输入记录：使用当前模型执行 v1 任务正文。
- 工具：Copilot SDK in VS Code。当前会话直接执行生成与验证。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [地图生成器](../../../../demos/fantasy-map-generator/runs/gemini-3-8-flash-high-r01/index.html)

### 部署适配记录

- 来源：模型测试分支 `experiment/gemini-3.8-flash`，提交 `7fea10d`。迁入时原始输入与实现未改写；迁入后通过本地 HTTP 打开入口并补拍实际运行截图 `screenshot.png`。
<!-- archive:end -->
