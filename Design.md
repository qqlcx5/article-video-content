# Role
你是一位精通 Rust (Tauri) 和前端架构 (Vue3 Ecosystem) 的全栈开发专家。你擅长构建高性能、设计极简的桌面应用程序。

# Goal
我要开发一个基于 Tauri v2 的桌面端应用，用于管理和监控抖音 UP 主的视频状态（URL 管理与 Diff 检测）。
请基于以下技术栈为我生成项目的基础架构配置和核心布局代码。

# Tech Stack
- **Styling**: UnoCSS
- **UI Component**: shadcn-vue (Radix Vue based).
- **Icons**: @phosphor-icons/vue.

# Design Requirements
1. **风格**: 极简主义、数据密集型工具风格 (Linear/Vercel Style)。
2. **主题**: 使用 Zinc/Slate 色系。
3. **布局**:
   - 左侧：极简侧边栏 (Sidebar)，包含导航图标 (Phosphor Icons)。
   - 顶部：自定义拖拽区域 (Custom Titlebar)，集成搜索框。
   - 主体：数据表格区域，用于展示 UP 主列表和状态标记。

# Specific Tasks & Constraints (Critical)

1. **UnoCSS Integration with shadcn-vue**:
   - 这是最关键的一步。请提供详细的 `uno.config.ts` 配置。
   - 必须包含 `preset-shadcn` (或者手动配置 theme extend)，确保 shadcn-vue 的组件（如 Button, Table, Dialog）能正确读取 CSS 变量 (如 --primary, --foreground)。
   - 配置 `presetIcons` 以支持 iconify (可选) 但主要使用 Phosphor Vue 组件。

2. **Global Components Setup**:
   - 展示如何在 `main.ts` 或 `App.vue` 中正确引入 Phosphor Icons 的全局配置（或者演示按需引入）。
   - 展示如何配置 shadcn-vue 的 `components.json` (如果需要) 或手动封装基础组件。

3. **Core Layout Implementation**:
   - 编写 `layouts/MainLayout.vue`。
   - 使用 shadcn-vue 的组件（如 `ResizablePanel` 或手动 Flex布局）实现左侧导航 + 右侧内容的结构。
   - 侧边栏按钮需使用 Phosphor Icons (如 `User`, `Video`, `ClockCounterClockwise`, `Gear`)。
