这是一个非常标准但“坑”很多的过程。**Windows 上安装 Rust/Tauri 必须严格按照顺序来，否则后期报错会让你非常头疼。**

这是世界上最懂这行的人（比如 Tauri 核心团队或 Rust 资深开发者）会给你的 **“避坑指南”**。

---

### 核心原则：不要跳步，特别是第一步。

### 第一步：安装 C++ 生成工具 (最重要，必须先做)
Rust 在 Windows 上编译需要依赖 Microsoft 的链接器 (MSVC)。**千万不要直接去装 Rust，先装这个。**

1.  **下载**: 访问 [Visual Studio Downloads](https://visualstudio.microsoft.com/zh-hans/visual-studio-tools/)。
2.  **寻找**: 往下翻，找到 **“Visual Studio 2022 生成工具 (Build Tools for Visual Studio 2022)”**，点击下载。
3.  **安装 (关键点)**:
    *   运行安装程序。
    *   **勾选**: 在“工作负荷 (Workloads)”标签页中，**必须勾选【使用 C++ 的桌面开发 (Desktop development with C++)】**。
    *   右侧详情里，确保勾选了 `Windows 10 (或 11) SDK`。
    *   点击“安装”。(这步大概需要下载 2-3GB，喝杯咖啡等待)。

### 第二步：安装 Rust (Rustup)
1.  **下载**: 访问 [Rust 官网](https://www.rust-lang.org/tools/install)。
2.  **运行**: 下载 `rustup-init.exe` (64-bit)。
3.  **操作**:
    *   双击运行，会弹出一个黑框终端。
    *   它会检测到你已经安装了 C++ Build Tools。
    *   看到提示 `1) Proceed with installation (default)` 时，直接输入 **1** 并回车。
4.  **配置环境**: 安装完成后，脚本会提示你配置好了。
    *   **重要**: 关闭所有终端 (CMD/PowerShell/VSCode)，重新打开一个新的，让环境变量生效。

### 第三步：验证安装
打开 PowerShell 或 CMD，输入以下命令：

```bash
rustc --version
# 应该输出类似: rustc 1.75.0 (xxxxxx)

cargo --version
# 应该输出类似: cargo 1.75.0 (xxxxxx)
```

### 第四步：解决国内网络问题 (选做，但强烈建议)
如果你在中国大陆，`cargo` 下载依赖包会极慢甚至失败。你需要配置**国内镜像源**。

1.  在用户目录下找到 `.cargo` 文件夹 (通常在 `C:\Users\你的用户名\.cargo`)。
2.  新建一个没有后缀名的文件，叫 `config` (如果有了就打开编辑)。
3.  粘贴以下内容 (使用字节跳动或清华源)：

```toml
[source.crates-io]
replace-with = 'rsproxy'

[source.rsproxy]
registry = "https://rsproxy.cn/crates.io-index"

[source.rsproxy-sparse]
registry = "sparse+https://rsproxy.cn/index/"

[registries.crates-io]
protocol = "sparse"
```

### 换个更稳的源（推荐：清华源或由上海交大源）
```toml
[source.crates-io]
replace-with = 'tuna'

[source.tuna]
registry = "https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"

# 如果清华源也卡，可以把上面的注释掉，试一下下面的上海交大源（二选一）
# [source.crates-io]
# replace-with = 'sjtu'
#
# [source.sjtu]
# registry = "https://mirrors.sjtug.sjtu.edu.cn/git/crates.io-index"
```

### 第五步：安装 Tauri CLI 并创建项目
假设你已经安装了 Node.js (建议 v18 LTS 或 v20 LTS)。

1.  **创建项目**:
    ```bash
    npm create tauri-app@latest
    ```
2.  **回答问题**:
    *   Project name: `my-video-manager`
    *   Frontend language: `JavaScript` (既然你刚才选了不想用 TS)
    *   Package manager: `pnpm` (推荐) 或 `npm`
    *   UI Template: `Vue`
    *   UI Flavor: `Element Plus` (或者选 TypeScript 稍后手动改)

3.  **运行开发环境**:
    ```bash
    cd my-video-manager
    npm install
    npm run tauri dev
    ```

**成功标志**: 你的电脑会弹出一个空白的 Windows 窗口，里面显示 Vue 的欢迎界面。此时，Rust 后端和 Web 前端已经打通了。