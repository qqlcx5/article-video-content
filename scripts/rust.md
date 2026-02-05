### Answer

这是一个典型的 **Server-Sent Events (SSE)** 流式请求。它通过 `text/event-stream` 协议实时传输 AI 生成的笔记内容。

根据你提供的网络数据，我为你编写了一个基于 **Rust (Tauri 后端)** 的逻辑实现。这个脚本将模拟该请求，捕获流式响应，并将最终生成的 Markdown 内容保存到本地文件。

### 1. Tauri 后端实现 (Rust)

在 Tauri 中，建议在 Rust 层处理这种长连接流，以保证稳定性并方便直接操作文件系统。

你需要添加 `reqwest` (支持 stream) 和 `futures` 库到 `src-gen/Cargo.toml`:

`````
toml
[dependencies]
reqwest = { version = "0.11", features = ["json", "stream"] }
futures = "0.3"
tokio = { version = "1", features = ["full"] }
`````


**`src-gen/main.rs` 核心逻辑：**


`````
rust
use futures::StreamExt;
use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION, CONTENT_TYPE};
use serde_json::Value;
use std::fs::File;
use std::io::Write;
use tauri::Window;

#[tauri::command]
async fn fetch_ai_note_stream(window: Window, auth_token: String, save_path: String) -> Result<(), String> {
    let client = reqwest::Client::new();

    let mut headers = HeaderMap::new();
    headers.insert(AUTHORIZATION, HeaderValue::from_str(&auth_token).map_err(|e| e.to_string())?);
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
    headers.insert("Origin", HeaderValue::from_static("https://www.biji.com"));

    // 注意：这里需要根据实际情况补全请求体（Payload）
    let payload = serde_json::json!({
        // 填入你抓包看到的完整 Request Payload
    });

    let res = client
        .post("https://get-notes.luojilab.com/voicenotes/web/notes/stream")
        .headers(headers)
        .json(&payload)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let mut stream = res.bytes_stream();
    let mut full_content = String::new();
    let mut current_title = String::from("note");

    while let Some(item) = stream.next().await {
        let chunk = item.map_err(|e| e.to_string())?;
        let text = String::from_utf8_lossy(&chunk);

        // SSE 数据解析逻辑
        for line in text.lines() {
            if line.starts_with("data: ") {
                let json_str = &line[6..];
                if let Ok(v) = serde_json::from_str::<Value>(json_str) {
                    let msg_type = v["msg_type"].as_i64().unwrap_or(0);
                    let msg_data = v["data"]["msg"].as_str().unwrap_or("");

                    // 解析内部嵌套的 JSON 字符串
                    if let Ok(inner_json) = serde_json::from_str::<Value>(msg_data) {
                        // 提取标题
                        if let Some(title) = inner_json.get("summary_title") {
                            current_title = title.as_str().unwrap_or("note").to_string();
                        }
                        // 提取正文内容
                        if let Some(content) = inner_json.get("content") {
                            let part = content.as_str().unwrap_or("");
                            full_content.push_str(part);

                            // 实时推送到前端显示
                            window.emit("stream-data", part).unwrap();
                        }
                    }
                }
            }
        }
    }

    // 写入 Markdown 文件
    let final_path = format!("{}/{}.md", save_path, current_title.trim());
    let mut file = File::create(&final_path).map_err(|e| e.to_string())?;
    file.write_all(full_content.as_bytes()).map_err(|e| e.to_string())?;

    Ok(())
}
`````


### 2. 网络请求深度分析 (针对工程师)

为了让你的脚本更健壮，请注意以下从抓包中提取的关键点：

*   **Content-Type**: 这是一个特殊的请求。请求头是 `application/json`（发送指令），但响应头是 `text/event-stream`（接收流）。这意味着你不能使用普通的 `await res.json()`，必须使用流式读取（Chunked Transfer Encoding）。
*   **数据结构解析**:
    *   该 API 将 Markdown 片段嵌套在两层 JSON 中：`data.msg` 字段本身是一个 JSON 字符串，需要进行**二次反序列化**。
    *   `msg_type: 6` 为进度状态（如“AI正在写笔记”）。
    *   `msg_type: 1` 包含实际的内容片段（instruction, summary_title, content）。
    *   `msg_type: 104` 通常代表该段落生成结束。
*   **乱码处理**: 你提供的日志中出现了乱码（如 `æ­£åœ¨æµè§ˆ`），这是因为抓包工具使用了错误的字符编码显示。该接口实际使用 **UTF-8** 编码，Rust 的 `String::from_utf8_lossy` 可以完美处理。
*   **性能瓶颈**:
    *   根据 Timing 信息，`Content download` 耗时 **26.2 秒**。这是典型的 AI 生成耗时，并非网络延迟。
    *   **优化建议**: 在 Tauri 界面上增加 `progress` 状态监听，利用 `msg_type: 6` 中的 `processName`（如 `analysis_web_page`）给用户提供实时进度反馈。

### 3. 前端调用示例 (TypeScript)


`````ts
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';

// 监听流式输出
await listen('stream-data', (event) => {
  console.log("收到片段:", event.payload);
  // 更新 UI 上的 Markdown 预览
});

// 触发抓取并保存
async function startCapture() {
  try {
    await invoke('fetch_ai_note_stream', {
      authToken: '你的授权Token',
      savePath: '/users/xxx/documents'
    });
    alert('保存成功！');
  } catch (e) {
    console.error('失败:', e);
  }
}
`````


### 关键隐私提示
在实现脚本时，请务必将 `Authorization` 动态化。该请求包含敏感的 Token 信息，不要将其硬编码在代码中，建议通过 Tauri 的 `Store` 模块或加密本地存储来管理。
