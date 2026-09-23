# 自选股实战 · GPT 6 Luna Max

## 本轮实现

独立 React + TypeScript 前端和 Go Gin/GORM/PostgreSQL 后端，支持 A 股、港股、美股切换，自选合约增删改查与搜索。服务端带字段校验、CORS、结构化请求/响应日志和数据库健康检查；客户端记录通讯日志，后端不可用时显示告警。行情为确定性演示快照，不是真实行情。

## 运行与验证

环境变量和启动步骤见 [docs/development.md](docs/development.md)，配置模板见 [.env.example](.env.example)。前端 typecheck/build、`npm audit`，后端 `go vet`、`go test`、`go build` 均通过。环境没有 Docker/PostgreSQL，未做数据库端到端验证；未部署到外部服务。

原始任务：[prompt.md](prompt.md)

## 模型与输入

Codex CLI 使用 `gpt-6-luna`、`max` 推理档位。主题 v1 提示词引用的原型图未随本轮提供，未假设已读取旧实验图片。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`stock-watching--gpt-6-luna-max-r01`
- 模型：GPT 6 Luna；推理档位：max
- 类型：fullstack；预览：none；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=stock-watching)
- 输入记录：完整保留主题 v1 正文；提示词引用的原型图没有作为本轮输入提供，未重用旧实验图片。行情展示为确定性演示快照，不是真实行情。
- 工具：Codex CLI。通过 --model gpt-6-luna 与 model_reasoning_effort=max 执行；CLI 完成并返回代码，具体平台上下文未随实验导出。
- 运行方式：无静态预览，参见上方历史说明与源码。


### 部署适配记录

- 在独立目录新建 React/TypeScript 前端与 Go Gin/GORM/PostgreSQL 后端，保留旧版源码和历史记录。
- 加入中港美市场切换、合约新增/编辑/删除/查询、校验、CORS、请求与响应日志、健康检查和离线告警。
- 行情使用确定性演示快照；提供 .env.example、Docker Compose 和运行说明，不登记外部部署。
- 前端类型检查与生产构建、npm audit、Go vet/build/unit tests 通过；未能启动 PostgreSQL 做端到端验证。
<!-- archive:end -->
