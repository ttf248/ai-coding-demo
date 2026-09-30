# 首版与修复证据

first-output.json.gz 为首版源码的 gzip JSON 快照；files 的键是实验相对路径，data 为 base64 文件内容。依赖安装目录与构建缓存未包含。使用 Node zlib.gunzipSync 解压，再 JSON.parse 读取。归档元数据和输入独立保存在上级目录。后续修复写入 validation.md 与 run.json 的 changes，不覆盖此快照。
