# 自选股市场看板

## 原始提示词

见 [完整原始输入](prompt.md)。本轮使用 v1 任务正文。

## 运行与复盘

先创建 PostgreSQL 数据库并设置 `DATABASE_URL`（参见 `.env.example`），在 `server` 目录运行 `go run .`（Go 1.25+）。在 `client` 目录运行 `npm ci` 与 `npm run dev`；可用 `VITE_API_URL` 指定服务端地址，默认 `http://localhost:8080`。接口：`GET /api/markets`、`GET /api/watchlist?market=US`、`POST /api/watchlist`、`PUT /api/watchlist/:id`、`DELETE /api/watchlist/:id`、`GET /api/health`。服务端记录请求、响应状态与内容，前端记录通讯；错误显示告警。价格、涨跌幅和成交量是固定模拟值，界面和接口均标明“模拟行情”。原任务没有提供真实行情源。

模型名称和档位由用户指定为 gpt-6-sol / medium；工具是当前 Codex 会话。运行环境未提供可独立核验的模型标识。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`stock-watching--gpt-6-sol-medium-r01`
- 模型：GPT-6 Sol；推理档位：medium
- 类型：fullstack；预览：none；网络：unknown
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=stock-watching)
- 输入记录：本轮按存档任务正文原文执行。 本轮由用户统一指定全部主题、模型名 gpt-6-sol、medium 档位及当前会话执行。
- 工具：Codex 当前会话。用户指定模型名称 gpt-6-sol、档位 medium；运行环境未提供可独立核验的模型标识。未委派子代理。
- 运行方式：无静态预览，参见上方历史说明与源码。
- 费用记录：OpenAI · ChatGPT Plus 订阅；单案例货币金额未记录。据用户说明，OpenAI 模型通过 ChatGPT Plus 订阅测试；全部案例完成后，五小时额度未耗尽。未提供单案例费用金额。


### 部署适配记录

- 首次生成，无人工修改历史产物。
- 原任务没有提供行情 API、合约编码规则或原型图文件；价格、涨跌幅、成交量由合约代码生成固定模拟值，界面明确标注。
<!-- archive:end -->
