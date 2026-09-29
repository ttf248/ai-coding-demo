# 什么是 API/REST？

## 📖 概述

API（Application Programming Interface）是应用程序编程接口，是不同软件组件之间的通信约定。REST（Representational State Transfer）是一种基于 HTTP 协议的架构风格，用于设计网络应用程序的 API。

## 🌟 REST 核心原则

### 1. **无状态（Stateless）**
- 每个请求包含所有必要信息
- 服务器不保存客户端状态
- 请求之间相互独立

### 2. **客户端-服务器架构**
- 客户端负责用户界面
- 服务器负责数据存储
- 职责分离

### 3. **统一接口（Uniform Interface）**
- 资源通过 URI 标识
- 通过 HTTP 方法操作资源
- 响应包含自描述数据

### 4. **可缓存（Cacheable）**
- 响应可标记为可缓存
- 减少网络请求
- 提升性能

## 💻 HTTP 方法

| 方法 | 描述 | 幂等性 | 示例 |
|------|------|--------|------|
| GET | 获取资源 | 是 | `GET /users` |
| POST | 创建资源 | 否 | `POST /users` |
| PUT | 更新资源（整体） | 是 | `PUT /users/1` |
| PATCH | 更新资源（部分） | 否 | `PATCH /users/1` |
| DELETE | 删除资源 | 是 | `DELETE /users/1` |

## 📡 RESTful API 示例

### 1. 基础结构

```javascript
// GET /users - 获取用户列表
fetch('/api/users')
  .then(res => res.json())
  .then(users => console.log(users))

// GET /users/1 - 获取特定用户
fetch('/api/users/1')
  .then(res => res.json())
  .then(user => console.log(user))
```

### 2. CRUD 操作

```javascript
// POST /users - 创建用户
fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Alice',
    email: 'alice@example.com'
  })
})

// PUT /users/1 - 更新用户
fetch('/api/users/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Alice Smith'
  })
})

// DELETE /users/1 - 删除用户
fetch('/api/users/1', {
  method: 'DELETE'
})
```

### 3. 查询参数

```javascript
// GET /users?page=1&limit=10&sort=name
fetch('/api/users?page=1&limit=10')

// GET /users?status=active&age=25
fetch('/api/users?status=active&age=25')
```

## 🔗 资源命名

### 好的实践
```http
GET    /users              # 获取用户列表
GET    /users/{id}         # 获取特定用户
POST   /users              # 创建用户
PUT    /users/{id}         # 更新用户
DELETE /users/{id}         # 删除用户

GET    /users/{id}/posts   # 获取用户的文章
POST   /users/{id}/posts   # 为用户创建文章
```

### 避免的做法
```http
GET    /getAllUsers        ❌
GET    /getUserById?id=1   ❌
POST   /createNewUser      ❌
```

## 📊 HTTP 状态码

| 状态码 | 描述 | 场景 |
|--------|------|------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 204 | No Content | 删除成功 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未授权 |
| 403 | Forbidden | 无权限 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器错误 |

## 💡 数据格式

### JSON 格式
```json
{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### 响应结构
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Alice"
  },
  "message": "用户获取成功"
}
```

### 分页响应
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## 🔒 认证与授权

### Bearer Token
```javascript
fetch('/api/users', {
  headers: {
    'Authorization': 'Bearer your-token-here'
  }
})
```

### API Key
```javascript
fetch('/api/data', {
  headers: {
    'X-API-Key': 'your-api-key'
  }
})
```

## 🛠️ 常用工具

- **Postman**：API 测试工具
- **Insomnia**：REST API 客户端
- **curl**：命令行 HTTP 客户端
- **Swagger/OpenAPI**：API 文档规范

## ✅ 优缺点

### 优点
- ✅ 简单易懂，标准统一
- ✅ 无状态，可靠性强
- ✅ 缓存友好
- ✅ 广泛支持
- ✅ 与 HTTP 协议天然集成

### 缺点
- ❌ 一次请求可能返回大量数据
- ❌ 版本管理复杂
- ❌ 难以处理复杂查询
- ❌ N+1 查询问题

## 🎯 最佳实践

1. 使用名词而非动词命名资源
2. 使用复数形式（/users 非 /user）
3. 使用 HTTP 状态码正确响应
4. 提供 API 版本控制
5. 添加适当的文档
6. 使用 HTTPS 确保安全
7. 实施速率限制
8. 错误信息清晰明确

## 📚 学习资源

- [RESTful API 最佳实践](https://restfulapi.net/)
- [HTTP 状态码完整指南](https://httpstatuses.com/)
- [OpenAPI 规范](https://swagger.io/specification/)

## 🔗 相关链接

- 在线预览：[API/REST Demo](what-is-api-rest-demo.html)
- API 测试工具：[Postman](https://www.postman.com/)
- OpenAPI 文档：[Swagger](https://swagger.io/)
