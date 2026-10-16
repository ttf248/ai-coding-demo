# 首次产物与追加修复

[first-pass.zip](first-pass.zip) 保留本轮首次实现、进入集中浏览器验收之前的源码快照。压缩包不含 node_modules、dist、实验元数据和归档文档；当前实验目录为同轮修复后的交付版本。首次产物可能包含下面列出的缺陷，保留用于复盘。

SHA-256：`50cc384c29bfde2f81a28f977884a47c062f8eb3b8637e4407615a2636ef01db`

## 修复记录

- 将不符合 ES2020 类型目标的 Array.at 调用改为下标访问。
- 显式添加 react-lazyload 运行所需的 prop-types 15.8.1，更新独立 lockfile，重新执行 build:demo 并验证生产预览。

以上均由本会话代理根据构建、浏览器或截图反馈追加，未由人手工改代码。具体逐次工具输入未完整导出，因此输入完整性仍标记 partial。用户追加输入另见 [follow-up.md](follow-up.md)，原 prompt.md 指纹保持不变。
