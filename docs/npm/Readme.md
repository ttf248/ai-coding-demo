# 什么是 NPM？

## 📖 概述

NPM（Node Package Manager）是 JavaScript 运行时环境 Node.js 的默认包管理器。它是世界上最大的软件注册表，包含超过 130 万个包（截至 2024 年），为开发者提供了丰富的开源库和工具。

## 🌟 核心功能

### 1. **包管理**
- 安装、卸载、更新包
- 依赖版本控制
- 包仓库搜索

### 2. **脚本执行**
- 定义自定义脚本
- 运行构建工具
- 自动化任务

### 3. **包发布**
- 公共包发布
- 私有包管理
- 版本管理

### 4. **项目配置**
- package.json
- 依赖锁定
- 钩子脚本

## 💻 常用命令

### 1. 初始化项目

```bash
# 创建 package.json
npm init

# 快速初始化
npm init -y
```

### 2. 安装包

```bash
# 本地安装
npm install package-name

# 全局安装
npm install -g package-name

# 安装特定版本
npm install package-name@1.0.0

# 安装开发依赖
npm install --save-dev package-name
# 或
npm install -D package-name
```

### 3. 卸载包

```bash
# 卸载本地包
npm uninstall package-name

# 卸载开发依赖
npm uninstall --save-dev package-name

# 卸载全局包
npm uninstall -g package-name
```

### 4. 更新包

```bash
# 检查过期包
npm outdated

# 更新所有包
npm update

# 更新特定包
npm update package-name
```

### 5. 脚本执行

```bash
# 运行 package.json 中的脚本
npm run script-name

# 常用脚本
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run start    # 启动应用
npm test         # 运行测试
```

## 📦 package.json

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "我的应用",
  "main": "index.js",
  "scripts": {
    "dev": "webpack serve",
    "build": "webpack --mode production",
    "test": "jest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "webpack": "^5.0.0",
    "webpack-cli": "^4.0.0"
  },
  "keywords": ["react", "app"],
  "author": "Your Name",
  "license": "MIT"
}
```

## 🔍 依赖类型

### 1. **dependencies**
- 生产环境必需的包
- `npm install package-name`

### 2. **devDependencies**
- 开发环境使用的包
- `npm install -D package-name`
- 构建工具、测试框架、ESLint 等

### 3. **peerDependencies**
- 对等依赖
- 包使用者需要安装的包

### 4. **optionalDependencies**
- 可选依赖
- 安装失败不会报错

### 5. **bundledDependencies**
- 打包时包含的依赖

## 📋 版本管理

### 语义化版本（SemVer）

格式：`主版本.次版本.修订版本`

```bash
# ^1.2.3    兼容 1.x.x 版本
# ~1.2.3    兼容 1.2.x 版本
# *         最新版本
# 1.2.3     精确版本
```

### 版本锁定

```json
{
  "dependencies": {
    "react": "^18.0.0"
  }
}
```

### package-lock.json

- 锁定实际安装的版本
- 确保团队环境一致
- 自动生成和维护

## 🏪 NPM Registry

### 官方注册表
- 默认地址：`https://registry.npmjs.org/`
- 速度较慢地区可使用镜像

### 使用淘宝镜像

```bash
# 配置镜像
npm config set registry https://registry.npm.taobao.org

# 或使用 nrm 管理镜像
npm install -g nrm
nrm use taobao
```

## 🔐 包发布

### 1. 创建账户

```bash
npm adduser
```

### 2. 登录

```bash
npm login
```

### 3. 发布

```bash
npm publish
```

### 4. 更新版本

```bash
# 更新补丁版本
npm version patch

# 更新次版本
npm version minor

# 更新主版本
npm version major
```

## 🛠️ 高级特性

### 1. **Workspaces**
管理多个包的工作空间

```json
{
  "workspaces": [
    "packages/*"
  ]
}
```

### 2. **Scopes**
命名空间管理

```bash
npm publish --access public
@scope/package-name
```

### 3. **NPM Scripts 钩子**

```json
{
  "scripts": {
    "prebuild": "echo build前执行",
    "build": "webpack",
    "postbuild": "echo build后执行"
  }
}
```

### 4. **npx**

```bash
# 临时使用包
npx create-react-app my-app

# 执行本地安装的包
npx webpack
```

## ✅ 优缺点

### 优点
- ✅ 包数量庞大
- ✅ 生态系统完善
- ✅ 使用简单
- ✅ 自动处理依赖
- ✅ 版本管理完善

### 缺点
- ❌ 包质量参差不齐
- ❌ 依赖层级过深
- ❌ 安全漏洞风险
- ❌ 下载速度慢

## 🎯 最佳实践

1. 使用固定版本号（~ 或 ^）
2. 定期更新依赖
3. 审计安全漏洞（`npm audit`）
4. 使用 package-lock.json
5. 清理未使用依赖
6. 查看包大小（`npm list --depth=0`）
7. 使用 NPM Scripts 自动化
8. 遵守命名规范

## 📚 学习资源

- [NPM 官方文档](https://docs.npmjs.com/)
- [npm 命令大全](https://www.npmjs.cn/)
- [语义化版本](https://semver.org/lang/zh-CN/)
- [package.json 说明](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)

## 🔗 相关链接

- 在线预览：[NPM Demo](what-is-npm-demo.html)
- 官方网站：[npmjs.com](https://www.npmjs.com/)
- 包搜索：[npmjs.com/package](https://www.npmjs.com/package/)
- 安全审计：[npmjs.com/advisories](https://www.npmjs.com/advisories)
