# API 契约

基础路径为 `/api`，成功响应使用 `{ "data": ... }`，失败响应使用 `{ "error": { "code": "...", "message": "..." } }`。

| 方法 | 路径 | 作用 |
| --- | --- | --- |
| GET | `/healthz` | 服务存活检查（无 `/api` 前缀） |
| GET | `/api/markets` | 返回 CN / HK / US 市场字典 |
| GET | `/api/stocks?market=CN&q=茅台` | 查询自选股 |
| POST | `/api/stocks` | 新增自选股 |
| PUT | `/api/stocks/:id` | 更新自选股 |
| DELETE | `/api/stocks/:id` | 删除单个标的 |
| DELETE | `/api/stocks` | 以 `{ "ids": ["CN-600519"] }` 批量删除 |

股票请求体包含 `code`、`name`、`market`、`price`、`change`、`changePercent` 和 `volume`。服务端会校验市场、长度和非负数值。
