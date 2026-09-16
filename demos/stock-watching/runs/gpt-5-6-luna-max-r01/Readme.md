# 自选股实战 · GPT 5.6 Luna Max

## 重做说明

以主题 v1 为输入重新实现一个可部署的全栈样例。源码按 `backend` 与 `frontend` 分开，历史 `unknown-unknown-r01` 保留；本轮没有外部部署地址，所以站点不会伪造静态预览。

## 功能

- A 股、美股、港股市场切换；股票列表带价格、涨跌、成交量和更新时间。
- 新增、编辑、删除、批量删除和查询；服务端校验代码、名称、市场与价格。
- Gin 中间件记录请求和响应状态，统一 JSON 错误；CORS 可通过环境变量限制来源。
- 前端请求失败时保留本地列表并显示离线告警，同时在调试抽屉记录请求、响应和错误摘要。

## 运行

先准备 PostgreSQL 并设置 `DATABASE_URL`，在 `backend` 执行 `go run .`；再在 `frontend` 执行 `npm ci && npm run dev`。完整环境变量和 API 契约见 `docs/development.md`。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`stock-watching--gpt-5-6-luna-max-r01`
- 模型：GPT 5.6 Luna；推理档位：max
- 类型：fullstack；预览：none；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=stock-watching)
- 输入记录：完整保留主题 v1 任务正文；历史原型图片作为旧实验资产，不假设已作为本轮输入。
- 工具：Codex。本轮保留真实前后端源码与运行说明；未部署到外部服务，不登记虚构地址。
- 运行方式：无静态预览，参见上方历史说明与源码。


### 部署适配记录

- 新增独立 React + Go Gin/GORM + PostgreSQL 全栈实现，历史 unknown 代码与目录不覆盖。
- 后端统一返回错误结构并记录请求/响应摘要，前端提供超时、错误提示和 API 日志面板。
- 按仓库规则保持 preview.kind 为 none；部署前需由维护者配置数据库和外部服务。
<!-- archive:end -->
