# WebDAV 云备份实现方案

采用 Rust 后端 + 前端 UI 的分离架构。所有 HTTP 请求在 Rust 后端实现，前端通过 Tauri 命令调用。这种设计彻底规避浏览器的 CORS 限制，同时让网络请求、错误处理、安全性更可控。Rust 后端使用 reqwest 库处理 HTTP 请求，base64 处理 Basic 认证，serde 处理 JSON 序列化。

四个 Rust 命令支撑完整功能：webdav_test_connection 测试连接并自动创建目录（通过 PROPFIND 和 MKCOL 方法），webdav_upload 使用 PUT 方法上传备份文件，webdav_list_files 通过 PROPFIND 列出云端文件列表并解析 XML 响应，webdav_download 使用 GET 方法下载指定备份。前端提供配置界面（服务器地址、账号密码、备份路径）和操作按钮（测试连接、导出、导入），导入时弹出文件列表让用户选择要恢复的具体备份版本。

分三步渐进式开发：先在 Rust 中实现核心网络请求逻辑，用简单的 eprintln! 打印调试信息确保功能正常；然后在前端添加按钮调用 Rust 命令，验证数据传输正确；最后优化 UI 交互（加载状态、错误提示、文件选择弹窗）。开发中遇到错误优先查看终端日志，Rust 编译警告要立即处理，HTTP 请求可用 Wireshark 等抓包工具验证。

技术选型：放弃 tauri-plugin-http（配置复杂、权限限制多），直接使用 reqwest 0.12 + base64 0.22 + urlencoding 2.1。关键注意点：base64 0.22 需导入 Engine trait，响应 .text() 方法会消耗所有权需提前保存 .status()，WebDAV 自定义方法用 Method::from_bytes 创建，XML 解析要处理 URL 编码，多选项必须提供选择界面不要自动选择。

---

## 依赖配置（Cargo.toml）

```toml
[dependencies]
reqwest = { version = "0.12", features = ["json"] }
base64 = "0.22"
urlencoding = "2.1"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

## Rust 核心代码结构

```rust
use base64::Engine;
use reqwest::Client;

#[tauri::command]
async fn webdav_test_connection(config: WebdavConfig) -> Result<String, String> {
    // 1. 先测试根目录
    // 2. 再测试备份目录，404 时用 MKCOL 创建
}

#[tauri::command]
async fn webdav_list_files(config: WebdavConfig) -> Result<Vec<WebdavFile>, String> {
    // 1. 发送 PROPFIND 请求
    // 2. 解析 XML 提取 <D:href> 标签
    // 3. URL 解码
    // 4. 过滤出备份文件
}
```

## 前端核心流程

```typescript
// 1. 测试连接 → 显示连接状态
// 2. 导出 → 调用 webdav_upload
// 3. 导入 → 调用 webdav_list_files → 显示选择弹窗 → 调用 webdav_download
```
