# 本地新增测试案例清单

本次清单由用户确认：排除网格音乐编曲器和 CSS 形状设计工具，加入以下四个案例。参考网站用于说明选题来源，不代表要求复刻整站。

四个主题已在当前会话完成 GPT-6.1 Sol / low 第 1 轮实验，入口及记录位于各主题 runs/gpt-6-1-sol-low-r01/。首次实现、验证后的主入口和修复说明均保留；模型和档位由用户提供，前序上下文未完整归档。本轮结果仅写入主仓库，未向 ai-coding-demo-test 写入实现或实验记录。

| 主题 | 任务正文 | 参考 | 运行要求 |
|---|---|---|---|
| 奇幻地图生成器 | [v1](../demos/fantasy-map-generator/prompts/v1/prompt.md) | [在线参考](https://www.redblobgames.com/maps/mapgen4/) | 单文件静态 HTML，无后端、无 CDN |
| 寻路算法实验室 | [v1](../demos/pathfinding-lab/prompts/v1/prompt.md) | [在线参考](https://www.redblobgames.com/pathfinding/a-star/) | 单文件静态 HTML，无后端、无 CDN |
| 彩色流体实验台 | [v1](../demos/fluid-simulation/prompts/v1/prompt.md) | [在线参考](https://paveldogreat.github.io/WebGL-Fluid-Simulation/) | 单文件静态 HTML，无后端、无 CDN |
| 简化电路实验台 | [v1](../demos/circuit-lab/prompts/v1/prompt.md) | [在线参考](https://www.falstad.com/circuit/) | 单文件静态 HTML，无后端、无 CDN |

四个主题均参与后续测试；使用 `npm run topics:active` 获取完整参与列表。流体实验台要求浏览器支持 WebGL 和所需纹理格式，提示词要求检测支持情况并提供错误提示。简化电路实验台限定直流电阻模型。

测试时先确认实际模型与档位，保存完整输入并创建新 run；不得把本清单视为已完成实验。新增单文件实现使用 index.html，验证 file://、HTTP 与 390px 移动端。历史实验及归档状态保持原记录。

两个本地仓库同步这些新增主题、提示词与清单；各自执行 generate，不整体合并历史或覆盖测试基线的专用说明。
