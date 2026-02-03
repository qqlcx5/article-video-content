# WebDAV 云备份功能实现方案

## 架构设计

**采用 Rust 后端 + 前端 UI 的分离架构**。所有 HTTP 请求（跨域、认证、数据传输）均在 Rust 后端实现，前端通过 Tauri 命令调用后端功能。这种设计彻底规避了浏览器的 CORS 限制，同时让网络请求、错误处理、安全性更可控。Rust 后端使用 `reqwest` 库处理 HTTP 请求，`base64` 处理 Basic 认证，`serde` 处理 JSON 序列化。

## 核心功能实现

**四个 Rust 命令支撑完整功能**：`webdav_test_connection` 测试连接并自动创建目录（通过 PROPFIND 和 MKCOL 方法），`webdav_upload` 使用 PUT 方法上传备份文件，`webdav_list_files` 通过 PROPFIND 列出云端文件列表，`webdav_download` 使用 GET 方法下载指定备份。前端提供配置界面（服务器地址、账号密码、备份路径）和操作按钮（测试连接、导出、导入），导入时弹出文件列表让用户选择要恢复的具体备份版本。

## 开发流程与调试

**分三步渐进式开发**：先在 Rust 中实现核心网络请求逻辑，用简单的 `eprintln!` 打印调试信息确保功能正常；然后在前端添加按钮调用 Rust 命令，验证数据传输正确；最后优化 UI 交互（加载状态、错误提示、文件选择弹窗）。开发中遇到错误优先查看终端日志，Rust 编译警告（如 deprecated API）要立即处理，HTTP 请求可用 Wireshark 等抓包工具验证。

## 技术栈与注意事项

**技术选型**：放弃 `tauri-plugin-http`（配置复杂、权限限制多），直接使用 `reqwest 0.12` + `base64 0.22`。**关键注意点**：base64 0.22 版本需要导入 `Engine` trait，HTTP 响应的 `.text()` 方法会消耗所有权，调用前必须先保存 `.status()`。WebDAV 自定义方法（PROPFIND、MKCOL）需用 `Method::from_bytes` 创建，返回 Result 需用 `?` 处理。前端处理多选项（如选择备份文件）时必须提供选择界面，不要自动选择默认值。
