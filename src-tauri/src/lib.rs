use serde::{Deserialize, Serialize};
use base64::Engine;
use std::path::PathBuf;
use std::fs::File;
use std::io::Write;
use std::process::Command;
use std::sync::Arc;
use tokio::sync::Semaphore;

#[derive(Debug, Serialize, Deserialize)]
pub struct WebdavConfig {
    pub url: String,
    pub username: String,
    pub password: String,
    pub path: String,
}

#[tauri::command]
async fn webdav_test_connection(config: WebdavConfig) -> Result<String, String> {
    let auth = base64::engine::general_purpose::STANDARD.encode(format!("{}:{}", config.username, config.password));

    // 先测试根目录连接
    let root_url = config.url.trim_end_matches('/');
    eprintln!("DEBUG: 测试根目录 = {}", root_url);

    let client = reqwest::Client::new();
    let method = reqwest::Method::from_bytes(b"PROPFIND").map_err(|e| format!("无效的HTTP方法: {}", e))?;

    let response = client
        .request(method.clone(), root_url)
        .header("Authorization", format!("Basic {}", auth))
        .header("Depth", "0")
        .send()
        .await
        .map_err(|e| {
            eprintln!("DEBUG: 根目录请求失败 = {}", e);
            format!("连接失败: {}", e)
        })?;

    eprintln!("DEBUG: 根目录响应状态 = {}", response.status());

    if !response.status().is_success() {
        let status = response.status();
        let body = response.text().await.unwrap_or_default();
        return Err(format!("认证失败: HTTP {} - {}", status.as_u16(), body));
    }

    // 根目录连接成功，现在测试备份目录
    let backup_url = if config.path.starts_with('/') {
        format!("{}{}", config.url.trim_end_matches('/'), config.path)
    } else {
        format!("{}/{}", config.url.trim_end_matches('/'), config.path)
    };

    eprintln!("DEBUG: 测试备份目录 = {}", backup_url);

    let backup_response = client
        .request(method.clone(), &backup_url)
        .header("Authorization", format!("Basic {}", auth))
        .header("Depth", "0")
        .send()
        .await
        .map_err(|e| {
            eprintln!("DEBUG: 备份目录请求失败 = {}", e);
            format!("请求失败: {}", e)
        })?;

    eprintln!("DEBUG: 备份目录响应状态 = {}", backup_response.status());

    let status = backup_response.status();
    let body = backup_response.text().await.unwrap_or_default();

    // 如果备份目录不存在（404），尝试创建
    if status == 404 {
        eprintln!("DEBUG: 备份目录不存在，尝试创建");

        // 使用 MKCOL 方法创建目录
        let mkcol_method = reqwest::Method::from_bytes(b"MKCOL").map_err(|e| format!("无效的HTTP方法: {}", e))?;
        let create_response = client
            .request(mkcol_method, &backup_url)
            .header("Authorization", format!("Basic {}", auth))
            .send()
            .await
            .map_err(|e| format!("创建目录失败: {}", e))?;

        eprintln!("DEBUG: 创建目录响应状态 = {}", create_response.status());

        if create_response.status().is_success() {
            return Ok("success".to_string());
        } else {
            let status = create_response.status();
            let err_body = create_response.text().await.unwrap_or_default();
            return Err(format!("无法创建备份目录: HTTP {} - {}", status.as_u16(), err_body));
        }
    }

    if status.is_success() {
        Ok("success".to_string())
    } else {
        Err(format!("HTTP {}: {}", status.as_u16(), body))
    }
}

#[tauri::command]
async fn webdav_upload(config: WebdavConfig, filename: String, content: String) -> Result<bool, String> {
    let auth = base64::engine::general_purpose::STANDARD.encode(format!("{}:{}", config.username, config.password));
    let file_url = if config.path.starts_with('/') {
        format!("{}{}/{}", config.url.trim_end_matches('/'), config.path, filename)
    } else {
        format!("{}/{}/{}", config.url.trim_end_matches('/'), config.path, filename)
    };

    let client = reqwest::Client::new();
    let response = client
        .put(&file_url)
        .header("Authorization", format!("Basic {}", auth))
        .header("Content-Type", "application/json")
        .body(content)
        .send()
        .await
        .map_err(|e| format!("上传失败: {}", e))?;

    Ok(response.status().is_success())
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WebdavFile {
    pub name: String,
    pub href: String,
}

#[tauri::command]
async fn webdav_list_files(config: WebdavConfig) -> Result<Vec<WebdavFile>, String> {
    let auth = base64::engine::general_purpose::STANDARD.encode(format!("{}:{}", config.username, config.password));
    let list_url = if config.path.starts_with('/') {
        format!("{}{}", config.url.trim_end_matches('/'), config.path)
    } else {
        format!("{}/{}", config.url.trim_end_matches('/'), config.path)
    };

    eprintln!("DEBUG: 列出文件 URL = {}", list_url);

    let client = reqwest::Client::new();
    let method = reqwest::Method::from_bytes(b"PROPFIND").map_err(|e| format!("无效的HTTP方法: {}", e))?;
    let response = client
        .request(method, &list_url)
        .header("Authorization", format!("Basic {}", auth))
        .header("Depth", "1")
        .send()
        .await
        .map_err(|e| format!("请求失败: {}", e))?;

    if !response.status().is_success() {
        eprintln!("DEBUG: 列出文件失败，状态码 = {}", response.status());
        return Err(format!("HTTP 错误: {}", response.status()));
    }

    let body = response.text().await.map_err(|e| format!("读取响应失败: {}", e))?;
    eprintln!("DEBUG: PROPFIND 响应体长度 = {}", body.len());
    eprintln!("DEBUG: PROPFIND 完整响应体 = {}", body);

    // 更好的 XML 解析 - 直接查找 href 标签内容
    let mut files = Vec::new();

    // 查找所有 <D:href>...</D:href> 或 <d:href>...</d:href> 或 <href>...</href>
    let mut start = 0;
    let body_str = body.as_str();

    loop {
        // 查找开始标签
        let open_tag = if let Some(pos) = body_str[start..].find("<D:href>") {
            Some(("<D:href>", pos))
        } else if let Some(pos) = body_str[start..].find("<d:href>") {
            Some(("<d:href>", pos))
        } else if let Some(pos) = body_str[start..].find("<href>") {
            Some(("<href>", pos))
        } else {
            None
        };

        let (tag, pos) = match open_tag {
            Some(t) => t,
            None => break,
        };

        let abs_start = start + pos + tag.len();
        start = abs_start;

        // 查找结束标签
        let close_tag = if tag.starts_with("<D:href>") {
            "</D:href>"
        } else if tag.starts_with("<d:href>") {
            "</d:href>"
        } else {
            "</href>"
        };

        if let Some(end_pos) = body_str[start..].find(close_tag) {
            let href = body_str[start..start + end_pos].trim().to_string();
            eprintln!("DEBUG: 找到 href = {}", href);

            // URL 解码
            let decoded_href = urlencoding::decode(&href)
                .map(|cow| cow.to_string())
                .unwrap_or_else(|_| href.clone());
            eprintln!("DEBUG: 解码后 href = {}", decoded_href);

            // 从 href 中提取文件名
            if let Some(filename) = decoded_href.rsplit('/').next() {
                eprintln!("DEBUG: 文件名 = {}", filename);
                if filename.contains("up_videos_backup_") && filename.ends_with(".json") {
                    files.push(WebdavFile {
                        name: filename.to_string(),
                        href: decoded_href,
                    });
                    eprintln!("DEBUG: 添加文件到列表");
                }
            }

            start += end_pos + close_tag.len();
        } else {
            break;
        }
    }

    eprintln!("DEBUG: 找到 {} 个备份文件", files.len());

    Ok(files)
}

#[tauri::command]
async fn webdav_download(config: WebdavConfig, filename: String) -> Result<String, String> {
    let auth = base64::engine::general_purpose::STANDARD.encode(format!("{}:{}", config.username, config.password));
    let file_url = if config.path.starts_with('/') {
        format!("{}{}/{}", config.url.trim_end_matches('/'), config.path, filename)
    } else {
        format!("{}/{}/{}", config.url.trim_end_matches('/'), config.path, filename)
    };

    let client = reqwest::Client::new();
    let response = client
        .get(&file_url)
        .header("Authorization", format!("Basic {}", auth))
        .send()
        .await
        .map_err(|e| format!("下载失败: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("HTTP 错误: {}", response.status()));
    }

    let content = response.text().await.map_err(|e| format!("读取响应失败: {}", e))?;
    Ok(content)
}

// ============ AI Note Generation ============

#[derive(Debug, Serialize, Deserialize)]
pub struct AiNoteRequest {
    pub api_url: String,
    pub token: String,
    pub video_url: String,
    pub video_title: String,
    pub prompt_template: String,
    pub output_path: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AiNoteProgress {
    pub status: String,
    pub message: String,
    pub content_length: usize,
}

#[derive(Debug, Serialize, Deserialize)]
struct SseData {
    code: i32,
    msg_type: i32,
    #[serde(default)]
    data: Option<SseDataContent>,
}

#[derive(Debug, Serialize, Deserialize)]
struct SseDataContent {
    #[serde(default)]
    msg: String,
    #[serde(default)]
    note_id: Option<String>,
    #[serde(default)]
    link_title: Option<String>,
}

#[tauri::command]
async fn generate_ai_note(request: AiNoteRequest) -> Result<String, String> {
    // 直接调用内部函数，不使用 catch_unwind 和 block_on
    generate_ai_note_internal(request).await
}

async fn generate_ai_note_internal(request: AiNoteRequest) -> Result<String, String> {
    eprintln!("=== 开始生成 AI 笔记 ===");
    eprintln!("API URL: {}", request.api_url);
    eprintln!("视频 URL: {}", request.video_url);
    eprintln!("视频标题: {}", request.video_title);
    eprintln!("输出路径: {}", request.output_path);

    // 参数验证
    if request.api_url.trim().is_empty() {
        eprintln!("错误: API URL 为空");
        return Err("API 地址不能为空".to_string());
    }
    if request.token.trim().is_empty() {
        eprintln!("错误: Token 为空");
        return Err("Authorization Token 不能为空".to_string());
    }
    if request.video_url.trim().is_empty() {
        eprintln!("错误: 视频 URL 为空");
        return Err("视频 URL 不能为空".to_string());
    }

    eprintln!("✓ 参数验证通过");

    // 创建输出目录
    let output_path = PathBuf::from(&request.output_path);
    eprintln!("完整输出路径: {:?}", output_path);

    if let Some(parent) = output_path.parent() {
        eprintln!("创建目录: {:?}", parent);
        match std::fs::create_dir_all(parent) {
            Ok(_) => eprintln!("✓ 目录创建成功"),
            Err(e) => {
                eprintln!("✗ 创建目录失败: {}", e);
                return Err(format!("创建目录失败: {}", e));
            }
        }
    }

    // 创建或清空输出文件
    eprintln!("创建文件: {:?}", output_path);
    let mut file = match File::create(&output_path) {
        Ok(f) => {
            eprintln!("✓ 文件创建成功");
            f
        }
        Err(e) => {
            eprintln!("✗ 创建文件失败: {}", e);
            return Err(format!("创建文件失败: {}", e));
        }
    };

    // 写入元数据
    let metadata = format!(
        "# {}\n\n> 视频链接: {}\n> 生成时间: {}\n\n---\n\n",
        request.video_title,
        request.video_url,
        chrono::Local::now().format("%Y-%m-%d %H:%M:%S")
    );

    match file.write_all(metadata.as_bytes()) {
        Ok(_) => eprintln!("✓ 元数据写入成功"),
        Err(e) => {
            eprintln!("✗ 写入元数据失败: {}", e);
            return Err(format!("写入元数据失败: {}", e));
        }
    }

    // 准备请求数据
    eprintln!("准备 API 请求...");
    let request_body = serde_json::json!({
        "attachments": [{
            "size": 100,
            "type": "link",
            "title": "",
            "url": request.video_url
        }],
        "content": request.prompt_template,
        "entry_type": "ai",
        "note_type": "link",
        "source": "web"
    });
    eprintln!("请求体准备完成");

    // 创建 HTTP 客户端，设置超时
    eprintln!("创建 HTTP 客户端...");
    let client = match reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(120))
        .build()
    {
        Ok(c) => {
            eprintln!("✓ HTTP 客户端创建成功");
            c
        }
        Err(e) => {
            eprintln!("✗ 创建 HTTP 客户端失败: {}", e);
            return Err(format!("创建 HTTP 客户端失败: {}", e));
        }
    };

    // 发送 SSE 请求
    eprintln!("发送 API 请求到: {}", request.api_url);
    let response = match client
        .post(&request.api_url)
        .header("Authorization", format!("Bearer {}", request.token))
        .header("Content-Type", "application/json")
        .header("Accept", "text/event-stream")
        .json(&request_body)
        .send()
        .await
    {
        Ok(resp) => {
            eprintln!("✓ 收到响应，状态码: {}", resp.status());
            resp
        }
        Err(e) => {
            eprintln!("✗ 网络请求失败: {}", e);
            return Err(format!("网络请求失败: {}。\n请检查：\n1. API 地址是否正确\n2. 网络连接是否正常\n3. Token 是否有效", e));
        }
    };

    let status = response.status();
    eprintln!("HTTP 状态码: {}", status);

    if !status.is_success() {
        let error_body = match response.text().await {
            Ok(body) => {
                eprintln!("错误响应体: {}", body);
                body
            }
            Err(e) => {
                eprintln!("读取错误响应失败: {}", e);
                format!("(无法读取错误响应: {})", e)
            }
        };

        let error_msg = if status.as_u16() == 403 {
            format!("API 认证失败 (403)。\n请检查 Token 是否正确或已过期。\n服务器返回: {}", error_body)
        } else if status.as_u16() == 401 {
            format!("API 未授权 (401)。\n请检查 Token 是否已配置。\n服务器返回: {}", error_body)
        } else {
            format!("API 返回错误: HTTP {} - {}", status, error_body)
        };

        eprintln!("✗ {}", error_msg);
        return Err(error_msg);
    }

    eprintln!("✓ API 请求成功，开始读取响应...");

    // 读取 SSE 流 - 使用 try_blocks 或直接读取
    let mut current_instruction = String::new();
    let mut current_summary_title = String::new();
    let mut current_content = String::new();
    let mut line_count = 0;
    let mut data_count = 0;
    let mut parse_error_count = 0;

    eprintln!("开始读取响应体...");

    // 直接读取响应体到字符串
    let text = match response.text().await {
        Ok(t) => {
            eprintln!("✓ 读取响应成功，长度: {} 字符", t.len());
            t
        }
        Err(e) => {
            eprintln!("✗ 读取响应失败: {}", e);
            return Err(format!(
                "读取API响应失败: {}。\n可能原因：\n1. 网络连接不稳定\n2. API服务器响应超时\n3. 响应数据过大",
                e
            ));
        }
    };

    // 解析 SSE 事件（带边界检查）
    eprintln!("开始解析 SSE 事件...");
    let mut line_count = 0;
    let mut data_count = 0;
    let mut parse_error_count = 0;

    for line in text.lines() {
        line_count += 1;

        // 安全的字符串切片：检查长度
        if line.len() > 5 && line.starts_with("data:") {
            // 使用 get 方法安全地获取子字符串
            let json_str = match line.get(5..) {
                Some(s) => s,
                None => continue
            };

            let json_str = json_str.trim();

            if json_str.is_empty() {
                continue;
            }

            data_count += 1;

            // 安全地解析 JSON
            match serde_json::from_str::<SseData>(json_str) {
                Ok(sse_data) => {
                    if sse_data.code == 200 {
                        if let Some(data_content) = sse_data.data {
                            match sse_data.msg_type {
                                1 => {
                                    // 内容增量
                                    if let Ok(msg_obj) = serde_json::from_str::<serde_json::Value>(&data_content.msg) {
                                        if let Some(instruction) = msg_obj.get("instruction").and_then(|v| v.as_str()) {
                                            current_instruction.push_str(instruction);
                                        }
                                        if let Some(summary_title) = msg_obj.get("summary_title").and_then(|v| v.as_str()) {
                                            current_summary_title.push_str(summary_title);
                                        }
                                        if let Some(content) = msg_obj.get("content").and_then(|v| v.as_str()) {
                                            current_content.push_str(content);
                                        }
                                    }
                                }
                                104 => {
                                    // 完整内容 - 忽略，我们使用增量构建的内容
                                }
                                6 => {
                                    // 进度消息
                                    eprintln!("  进度: {}", data_content.msg);
                                }
                                _ => {}
                            }
                        }
                    }
                }
                Err(e) => {
                    parse_error_count += 1;
                    if parse_error_count <= 3 {
                        eprintln!("  解析失败 (#{}) {}: {}", parse_error_count, "json", e);
                    }
                    // JSON 解析失败，跳过该行
                    continue;
                }
            }
        }
    }

    eprintln!("✓ SSE 解析完成:");
    eprintln!("    总行数: {}", line_count);
    eprintln!("    data 行数: {}", data_count);
    eprintln!("    解析失败数: {}", parse_error_count);
    eprintln!("    instruction 长度: {}", current_instruction.len());
    eprintln!("    summary 长度: {}", current_summary_title.len());
    eprintln!("    content 长度: {}", current_content.len());

    // 构建最终的 Markdown 内容
    let final_content = format!(
        "{}\n\n## 摘要\n\n{}\n\n## 内容\n\n{}",
        current_instruction, current_summary_title, current_content
    );

    eprintln!("最终内容长度: {} 字节", final_content.len());

    // 写入最终内容
    let write_content = format!(
        "{}{}",
        metadata, final_content
    );

    eprintln!("准备写入文件...");

    // 重新打开文件并写入最终内容
    let mut file = match File::create(&output_path) {
        Ok(f) => f,
        Err(e) => {
            eprintln!("✗ 重新打开文件失败: {}", e);
            return Err(format!("重新打开文件失败: {}", e));
        }
    };

    match file.write_all(write_content.as_bytes()) {
        Ok(_) => {}
        Err(e) => {
            eprintln!("✗ 写入内容失败: {}", e);
            return Err(format!("写入内容失败: {}", e));
        }
    }

    match file.flush() {
        Ok(_) => {
            eprintln!("✓ 文件写入成功");
        }
        Err(e) => {
            eprintln!("✗ 刷新缓冲失败: {}", e);
            return Err(format!("刷新缓冲失败: {}", e));
        }
    }

    eprintln!("=== AI 笔记生成完成 ===");

    Ok(output_path.to_string_lossy().to_string())
}

// ============ 批量 AI 笔记生成 ============

#[derive(Debug, Serialize, Deserialize)]
pub struct BatchNoteRequest {
    pub api_url: String,
    pub token: String,
    pub videos: Vec<VideoNoteRequest>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct VideoNoteRequest {
    pub video_url: String,
    pub video_title: String,
    pub prompt_template: String,
    pub output_path: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BatchNoteResult {
    pub total: usize,
    pub success_count: usize,
    pub failed_count: usize,
    pub results: Vec<SingleNoteResult>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SingleNoteResult {
    pub title: String,
    pub success: bool,
    pub output_file: Option<String>,
    pub error: Option<String>,
}

#[tauri::command]
async fn generate_ai_note_batch(
    request: BatchNoteRequest,
    app_window: tauri::Window,
) -> Result<BatchNoteResult, String> {
    eprintln!("=== 开始批量生成 AI 笔记 ===");
    eprintln!("总视频数: {}", request.videos.len());

    let total = request.videos.len();
    let mut results = Vec::with_capacity(total);

    // 限制并发数为 3（避免过多并发导致API限流）
    let semaphore = Arc::new(Semaphore::new(3));
    let mut tasks = Vec::new();

    for (index, video_req) in request.videos.into_iter().enumerate() {
        let permit = semaphore.clone().acquire_owned().await.unwrap();
        let api_url = request.api_url.clone();
        let token = request.token.clone();
        let window = app_window.clone();

        let task = tokio::spawn(async move {
            let _permit = permit; // 持有信号量

            // 调用Python脚本生成单个笔记
            let result = generate_single_note_py(
                &api_url,
                &token,
                &video_req.video_url,
                &video_req.video_title,
                &video_req.prompt_template,
                &video_req.output_path,
            ).await;

            // 发送进度到前端
            let _ = window.emit("note-progress", json::object! {
                "current": index + 1,
                "total": total,
                "title": video_req.video_title,
                "success": result.success,
                "percent": ((index + 1) as f64 / total as f64) * 100.0
            });

            result
        });

        tasks.push(task);
    }

    // 等待所有任务完成
    for task in tasks {
        let result = task.await.unwrap();
        results.push(result);
    }

    let success_count = results.iter().filter(|r| r.success).count();
    let failed_count = total - success_count;

    eprintln!("=== 批量生成完成 ===");
    eprintln!("成功: {}, 失败: {}", success_count, failed_count);

    Ok(BatchNoteResult {
        total,
        success_count,
        failed_count,
        results,
    })
}

async fn generate_single_note_py(
    api_url: &str,
    token: &str,
    video_url: &str,
    video_title: &str,
    prompt_template: &str,
    output_path: &str,
) -> SingleNoteResult {
    let mut script_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    script_path.push("scripts");
    script_path.push("generate_note.py");

    eprintln!("调用Python脚本: {:?}", script_path);
    eprintln!("视频: {}", video_title);

    let output = match Command::new("python")
        .arg(&script_path)
        .arg(prompt_template)
        .arg(video_url)
        .arg(video_title)
        .arg(output_path)
        .arg(token)
        .output()
    {
        Ok(o) => o,
        Err(e) => {
            eprintln!("启动Python失败: {}", e);
            return SingleNoteResult {
                title: video_title.to_string(),
                success: false,
                output_file: None,
                error: Some(format!("启动Python失败: {}", e)),
            };
        }
    };

    // 解析进度信息（stderr）
    if !output.stderr.is_empty() {
        let stderr_str = String::from_utf8_lossy(&output.stderr);
        for line in stderr_str.lines() {
            if let Ok(progress) = serde_json::from_str::<serde_json::Value>(line) {
                if progress["type"] == "progress" {
                    eprintln!("  进度: {}% - {}", progress["percent"], progress["message"]);
                }
            }
        }
    }

    // 解析最终结果（stdout）
    if !output.stdout.is_empty() {
        let stdout_str = String::from_utf8_lossy(&output.stdout);
        if let Ok(result) = serde_json::from_str::<serde_json::Value>(&stdout_str) {
            return SingleNoteResult {
                title: video_title.to_string(),
                success: result["success"].as_bool().unwrap_or(false),
                output_file: result["output_file"].as_str().map(|s| s.to_string()),
                error: result["error"].as_str().map(|s| s.to_string()),
            };
        }
    }

    SingleNoteResult {
        title: video_title.to_string(),
        success: false,
        output_file: None,
        error: Some("解析输出失败".to_string()),
    }
}

// ============ S3 兼容存储 ============

use s3::{AddressingStyle, Auth, Client, Credentials};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct S3Config {
    pub bucket: String,
    pub region: String,
    #[serde(alias = "access_key_id")]
    pub access_key_id: String,
    #[serde(alias = "secret_access_key")]
    pub secret_access_key: String,
    #[serde(default)]
    pub endpoint: String,
    #[serde(default)]
    pub custom_domain: String,
    #[serde(default)]
    pub addressing_style: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct S3File {
    pub name: String,
    pub size: i64,
    pub last_modified: String,
}

fn normalize_endpoint(raw: &str) -> String {
    let trimmed = raw.trim().trim_end_matches('/');
    if trimmed.is_empty() {
        return String::new();
    }
    if trimmed.starts_with("http://") || trimmed.starts_with("https://") {
        trimmed.to_string()
    } else {
        format!("https://{}", trimmed)
    }
}

// 获取 S3 endpoint
fn get_s3_endpoint(config: &S3Config) -> String {
    if !config.custom_domain.trim().is_empty() {
        normalize_endpoint(&config.custom_domain)
    } else if !config.endpoint.trim().is_empty() {
        normalize_endpoint(&config.endpoint)
    } else if !config.region.trim().is_empty() && config.region.starts_with("cn-") {
        // 中国区域
        format!("https://s3.{}.amazonaws.com", config.region)
    } else {
        // 默认使用 us-east-1
        "https://s3.amazonaws.com".to_string()
    }
}

fn build_s3_client(config: &S3Config) -> Result<Client, String> {
    let endpoint = get_s3_endpoint(config);
    if endpoint.is_empty() {
        return Err("S3 endpoint 不能为空".to_string());
    }

    let region = if config.region.trim().is_empty() {
        "us-east-1".to_string()
    } else {
        config.region.clone()
    };

    let credentials = Credentials::new(
        config.access_key_id.clone(),
        config.secret_access_key.clone(),
    )
    .map_err(|e| format!("无效的访问密钥: {}", e))?;

    Client::builder(&endpoint)
        .map_err(|e| format!("无效的 S3 endpoint: {}", e))?
        .region(region)
        .auth(Auth::Static(credentials))
        .addressing_style(match config.addressing_style.as_str() {
            "virtual" | "virtual-host" | "virtual-hosted" => AddressingStyle::VirtualHosted,
            "auto" => AddressingStyle::Auto,
            _ => AddressingStyle::Path,
        })
        .build()
        .map_err(|e| format!("创建 S3 客户端失败: {}", e))
}

#[tauri::command]
async fn s3_test_connection(config: S3Config) -> Result<String, String> {
    eprintln!("=== 测试 S3 连接 ===");
    eprintln!("Bucket: {}", config.bucket);
    eprintln!("Region: {}", config.region);
    eprintln!("Endpoint: {}", config.endpoint);

    let client = build_s3_client(&config)?;
    let result = client.buckets().head(&config.bucket).send().await;

    match result {
        Ok(_) => {
            eprintln!("✓ S3 连接成功");
            Ok("success".to_string())
        }
        Err(e) => {
            eprintln!("✗ S3 连接失败: {}", e);
            Err(format!("连接失败: {}", e))
        }
    }
}

#[tauri::command]
async fn s3_upload(config: S3Config, filename: String, content: String) -> Result<bool, String> {
    eprintln!("=== 上传到 S3 ===");
    eprintln!("文件名: {}", filename);

    let client = build_s3_client(&config)?;
    let result = client
        .objects()
        .put(&config.bucket, &filename)
        .content_type("application/json")
        .body_bytes(content.into_bytes())
        .send()
        .await;

    match result {
        Ok(_) => {
            eprintln!("✓ 上传成功");
            Ok(true)
        }
        Err(e) => {
            eprintln!("✗ 上传失败: {}", e);
            Err(format!("上传失败: {}", e))
        }
    }
}

#[tauri::command]
async fn s3_list_files(config: S3Config) -> Result<Vec<S3File>, String> {
    eprintln!("=== 列出 S3 文件 ===");

    let client = build_s3_client(&config)?;
    let mut pager = client
        .objects()
        .list_v2(&config.bucket)
        .max_keys(1000)
        .pager();

    let mut files = Vec::new();
    while let Some(page) = pager.next_page().await.map_err(|e| format!("列出文件失败: {}", e))? {
        for obj in page.contents {
            if obj.key.contains("up_videos_backup_") && obj.key.ends_with(".json") {
                let last_modified = obj
                    .last_modified
                    .as_deref()
                    .and_then(|dt_str| {
                        chrono::DateTime::parse_from_rfc3339(dt_str)
                            .map(|dt| dt.format("%Y-%m-%d %H:%M:%S").to_string())
                            .ok()
                    })
                    .unwrap_or_default();

                files.push(S3File {
                    name: obj.key,
                    size: obj.size as i64,
                    last_modified,
                });
            }
        }
    }

    eprintln!("✓ 共找到 {} 个备份文件", files.len());
    Ok(files)
}

#[tauri::command]
async fn s3_download(config: S3Config, filename: String) -> Result<String, String> {
    eprintln!("=== 从 S3 下载 ===");
    eprintln!("文件名: {}", filename);

    let client = build_s3_client(&config)?;
    let result = client.objects().get(&config.bucket, &filename).send().await;

    match result {
        Ok(obj) => {
            let bytes = obj.bytes().await.map_err(|e| format!("读取响应失败: {}", e))?;
            let content = String::from_utf8(bytes.to_vec())
                .map_err(|e| format!("响应内容不是有效 UTF-8: {}", e))?;
            eprintln!("✓ 下载成功，大小: {} bytes", content.len());
            Ok(content)
        }
        Err(e) => {
            eprintln!("✗ 下载失败: {}", e);
            Err(format!("下载失败: {}", e))
        }
    }
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            webdav_test_connection,
            webdav_upload,
            webdav_list_files,
            webdav_download,
            generate_ai_note,
            generate_ai_note_batch,
            s3_test_connection,
            s3_upload,
            s3_list_files,
            s3_download
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
