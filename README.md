# 抖音UP主视频管理器（Tauri + Vue3）

本仓库实现了 `1.md` 中的核心“本地数据同步（Repository Pattern + Soft Delete）”逻辑，并提供可运行的桌面 UI。
同时支持按“UP主（JSON 文件名）”分组管理、批量导入多个 UP 主数据，并可导出类似 `1.js` 的批量请求脚本（不包含任何敏感 token）。

## 目录

- `src/`：同步算法与类型（可复用模块）
- `scripts/`：Node CLI（用于批处理/验证）
- `app/`：Vue3 + Element Plus 前端
- `src-tauri/`：Tauri 桌面壳

## 核心命令

### 1) Node 同步（验证合并效果）

```bash
npm install
npm run sync -- --latest "D:/Desktop/article-video-content/阿丽.json" --db "D:/Desktop/article-video-content/data/app_database.json" --up "阿丽"
```

### 2) 生成批量请求脚本（类似 1.js）

```bash
npm run export:script -- --db "D:/Desktop/article-video-content/data/app_database.json" --up "阿丽" --out "D:/Desktop/article-video-content/data/阿丽.request.js"
```

### 3) 启动前端（Web 模式）

```bash
cd app
npm install
npm run dev
```

### 4) 启动桌面应用（需要 Rust + Tauri 环境）

```bash
cd app
npm install
cd ..
cargo tauri dev
```
