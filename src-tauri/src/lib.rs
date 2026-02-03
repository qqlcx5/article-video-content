use serde::{Deserialize, Serialize};
use base64::Engine;

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
            webdav_download
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
