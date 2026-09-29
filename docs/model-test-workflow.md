# 在空白基线中测试新模型

## 创建独立测试目录

在原仓库所在机器执行（替换新目录名称）：

```powershell
git clone --no-local --single-branch --branch model-test-base F:/dev/ai-coding-demo F:/dev/model-test-next
cd F:/dev/model-test-next
git switch -c experiment/new-model
npm ci
```

`--no-local` 禁止本地克隆直接复制或硬链接整个对象库；`--single-branch` 只获取基线分支。不要使用 worktree、共享对象库或普通全分支克隆，也不要在实验目录 fetch main。首次克隆后 `git rev-list --count HEAD` 应为 1，只有新的根提交。

在这个目录打开 Codex 或 Claude Code，开启新会话并选择模型。然后可以说：

> 使用当前模型测试 demos 下全部主题。先列出每个主题可用的提示词版本；没有指定时使用版本号最大的版本，逐个按原文执行。不得查看其他目录、Git 分支或远程上的旧实现。保留完整输入和首次产物，记录运行条件，新增 run，完成构建、生成和校验，不推送。

同主题不同提示词版本代表不同任务。需要全部版本时明确说“测试全部提示词版本”，需要严格同题复测时明确指定版本。不要把归档要求偷偷改写进任务正文；实际传给模型的完整指令保存在实验 prompt.md。

独立克隆减少历史内容暴露，但不是系统权限隔离；工具仍可能拥有读取其他目录及联网的权限。站点源码和技术主题示例继续保留，因此不是只含提示词的严格沙箱。

## 新增记录与检查

新模型先登记 catalog/models.json。沿用 `npm run new:demo -- --topic <topic> --title <title> --model <model> --effort <effort> --type <type> --prompt <version>` 创建记录，补全实际输入、元数据和产物。不要修改已有任务正文。

构建型前端执行 `npm run build:demo -- <id>`。之后运行：

```powershell
npm run generate
npm run validate
npm test
node --check index.js
npm run test:browser
git diff --check
```

保存源码、run.json、prompt.md、Readme.md 和必要 previews；不提交依赖或缓存。每轮独立测试使用全新克隆，避免上一轮新结果影响下一轮。

## 将结果导入 main

测试结束后在实验目录提交结果。随后在原仓库 main 的新会话中说：

> 从 F:/dev/model-test-next 导入本轮新增实验。只复制新增 runs 和对应 previews，合并新模型字典项；检查实验 ID 是否冲突，重新生成目录并校验，不覆盖历史记录。

不要使用 `git merge --allow-unrelated-histories`，也不要将测试目录的根 README、空迁移清单、prompt.json 来源适配或生成 catalog.js 覆盖回 main。

导入步骤：

1. 对照测试仓库根提交和结果提交，枚举新增 runs；核查来源路径，拒绝复制 node_modules、缓存、凭据和中间构建文件。
2. 按目录复制每条实验及对应 previews，补充新增模型字典项。main 已有相同 ID 时禁止覆盖，分配新的 rNN，并更新 run.json 的 runId/id 和相关引用。提示词正文指纹必须与 main 对应版本一致，否则作为新提示词版本归档。
3. 构建实验需要重建或重新核对 build-info（运行路径或构建脚本不同可能使指纹失效）。
4. 在 main 执行 generate、validate、npm test 与对应浏览器检查；由生成器更新站点目录和 README 区块。
5. 确认提交范围后提交。只有明确要求时才推送；现有 Pages 发布逻辑不变。

本分支初始只含 1 个根提交。新增实验后测试分支自然会产生本轮的提交；不要将测试结果提交到 model-test-base 基线上。
