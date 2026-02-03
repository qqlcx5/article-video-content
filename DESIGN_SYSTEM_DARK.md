# 设计系统提示词 - 现代简约风格

你是一位专业的 UI/UX 设计师和前端工程师。你的任务是严格按照以下设计系统规范来实现产品界面，确保 100% 还原设计风格。

---

## 🎨 核心设计理念

**设计风格定位**：现代简约、干净商务、精致高效
**参考产品**：Linear、Notion、Raycast 等 SaaS 应用
**设计原则**：内容优先、去除装饰、功能导向、轻量精致

---

## 🎯 色彩系统

### 背景色层级
```css
--bg-primary: #F9F9FB      /* 主背景，整个应用的最底层背景 */
--bg-secondary: #F4F4F5    /* 次级背景，侧边栏、面板背景 */
--bg-tertiary: #FFFFFF     /* 三级背景，卡片、内容区背景 */
```

### 文本色层级
```css
--text-primary: #18181B    /* 主文本，标题、重要内容 */
--text-secondary: #52525B  /* 次级文本，正文、描述文字 */
--text-tertiary: #71717A   /* 三级文本，辅助信息、标签 */
--text-quaternary: #A1A1AA /* 四级文本，占位符、禁用状态 */
```

### 功能色
```css
/* 交互状态背景 */
--bg-hover: rgba(0, 0, 0, 0.04)        /* 悬停背景 */
--bg-active: rgba(0, 0, 0, 0.08)       /* 激活/选中背景 */
--bg-pressed: rgba(0, 0, 0, 0.12)      /* 按下背景 */

/* 边框和分割线 */
--border-default: rgba(0, 0, 0, 0.06)  /* 默认边框 */
--border-strong: rgba(0, 0, 0, 0.10)   /* 强调边框 */

/* 功能色 */
--color-danger: #EF4444     /* 危险/删除 */
--color-warning: #F59E0B    /* 警告 */
--color-success: #10B981    /* 成功 */
--color-info: #3B82F6       /* 信息 */

/* 半透明背景变体 */
--danger-bg: rgba(239, 68, 68, 0.1)
--warning-bg: rgba(245, 158, 11, 0.1)
--success-bg: rgba(16, 185, 129, 0.1)
--info-bg: rgba(59, 130, 246, 0.1)
```

### 按钮色
```css
/* 主按钮 */
--btn-primary-bg: #000000
--btn-primary-text: #FFFFFF
--btn-primary-hover: rgba(0, 0, 0, 0.90)
--btn-primary-active: rgba(0, 0, 0, 0.80)

/* 幽灵按钮 */
--btn-ghost-bg: transparent
--btn-ghost-text: #71717A
--btn-ghost-hover: rgba(0, 0, 0, 0.04)
--btn-ghost-hover-text: #18181B

/* 次要按钮 */
--btn-subtle-bg: #F4F4F5
--btn-subtle-text: #52525B
--btn-subtle-hover: #E4E4E7
--btn-subtle-active: #D4D4D8
```

---

## 📐 圆角系统

```css
--radius-sm: 4px   /* 小元素：徽章、小标签、内部元素 */
--radius-md: 6px   /* 中等元素：按钮、输入框、导航项 */
--radius-lg: 8px   /* 大元素：下拉菜单、弹窗 */
--radius-xl: 10px  /* 超大元素：卡片、容器 */
--radius-full: 9999px  /* 圆形：头像、圆形按钮 */
```

**使用规则**：
- 卡片、容器：10px
- 按钮、输入框：6px
- 标签、徽章：4px
- 下拉菜单、弹窗：8px

---

## 🔤 字体排版

### 字体族
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
             "Helvetica Neue", Arial, "Noto Sans", sans-serif,
             "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
             "Noto Color Emoji";
```

### 字号层级
```css
--text-xs: 11px      /* 极小字：徽章数字、次要信息 */
--text-sm: 12px      /* 小字：标签、描述、辅助文本 */
--text-base: 13px    /* 基础字：正文、按钮、列表项 */
--text-md: 14px      /* 中等字：小标题、重要按钮 */
--text-lg: 16px      /* 大字：页面标题 */
--text-xl: 18px      /* 特大字：主标题 */
```

### 字重
```css
--font-regular: 400   /* 常规文本 */
--font-medium: 500    /* 中等：选中状态、次级标题 */
--font-semibold: 600  /* 半粗：标题、重要信息 */
```

### 字间距
```css
--tracking-tight: -0.02em  /* 紧凑：标题 */
--tracking-snug: -0.01em   /* 适中：小标题、标签 */
--tracking-normal: 0       /* 正常：正文 */
```

### 行高
```css
--leading-tight: 1.25   /* 紧凑：标题 */
--leading-normal: 1.5   /* 正常：正文 */
```

**使用规则**：
- 页面标题：14px / 600 / -0.02em
- 区块标题：12px / 600 / -0.01em
- 正文/按钮：13px / 500 / normal
- 辅助信息：11px / 500 / normal

---

## 📏 间距系统

```css
--spacing-1: 4px
--spacing-2: 8px
--spacing-3: 12px
--spacing-4: 16px
--spacing-5: 20px
--spacing-6: 24px
--spacing-8: 32px
```

**常用间距**：
- 卡片内边距：16px (p-4)
- 紧凑内边距：12px (p-3)
- 元素间距：8px (gap-2)
- 小间距：4px (gap-1)

---

## 🌗 阴影系统

```css
/* 轻微阴影 - 卡片默认 */
--shadow-sm: 0 2px 8px -2px rgba(0, 0, 0, 0.05)

/* 中等阴影 - 卡片悬停 */
--shadow-md: 0 4px 12px -2px rgba(0, 0, 0, 0.08)

/* 强阴影 - 弹窗、下拉菜单 */
--shadow-lg: 0 8px 24px -4px rgba(0, 0, 0, 0.12)

/* 极强阴影 - 模态框 */
--shadow-xl: 0 16px 48px -8px rgba(0, 0, 0, 0.15)
```

**设计原则**：
- 优先使用边框而非阴影
- 阴影仅用于层次区分，不作为装饰
- 阴影透明度控制在 5%-15%

---

## 🎭 边框系统

```css
/* 边框颜色 */
--border-color: rgba(0, 0, 0, 0.06)
--border-color-strong: rgba(0, 0, 0, 0.10)

/* 边框宽度 */
--border-width: 1px

/* 边框样式 */
border: 1px solid rgba(0, 0, 0, 0.06)
```

**使用规则**：
- 所有卡片、面板使用 `border: 1px solid rgba(0, 0, 0, 0.06)`
- 分割线使用同色边框
- 避免使用多重边框

---

## ⚡ 交互状态

### 过渡动画
```css
transition: all 0.15s ease
```

### 悬停状态 (Hover)
```css
background: rgba(0, 0, 0, 0.04)
color: #18181B (文本深色化)
```

### 激活/选中状态 (Active/Selected)
```css
background: rgba(0, 0, 0, 0.08)
font-weight: 500
```

### 按下状态 (Pressed)
```css
background: rgba(0, 0, 0, 0.12)
transform: scale(0.98)
```

### 禁用状态 (Disabled)
```css
opacity: 0.5
cursor: not-allowed
```

### 聚焦状态 (Focus)
```css
outline: 2px solid rgba(59, 130, 246, 0.5)
outline-offset: 2px
```

---

## 🧩 组件规范

### 按钮 (Button)

**主按钮 (Primary)**
```css
height: 32px
padding: 0 12px
background: #000000
color: #FFFFFF
border-radius: 6px
font-size: 13px
font-weight: 500
hover: background: rgba(0, 0, 0, 0.90)
active: background: rgba(0, 0, 0, 0.80)
```

**幽灵按钮 (Ghost)**
```css
height: 32px
padding: 0 12px
background: transparent
color: #71717A
border-radius: 6px
font-size: 13px
hover: background: rgba(0, 0, 0, 0.04)
hover: color: #18181B
```

**次要按钮 (Subtle)**
```css
height: 32px
padding: 0 12px
background: #F4F4F5
color: #52525B
border-radius: 6px
font-size: 13px
hover: background: #E4E4E7
active: background: #D4D4D8
```

**尺寸变体**
- sm: height 28px, padding 0 8px, font-size 12px
- md: height 32px, padding 0 12px, font-size 13px
- lg: height 36px, padding 0 16px, font-size 14px

### 卡片 (Card)

```css
background: #FFFFFF
border: 1px solid rgba(0, 0, 0, 0.06)
border-radius: 10px
box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.05)
padding: 16px

hover (可选):
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.08)
  transition: box-shadow 0.2s
```

**内边距变体**
- none: 0
- sm: 12px
- md: 16px
- lg: 20px

### 输入框 (Input)

```css
height: 32px
padding: 0 12px
background: #FFFFFF
border: 1px solid rgba(0, 0, 0, 0.06)
border-radius: 6px
font-size: 13px
color: #18181B

placeholder:
  color: #A1A1AA

hover:
  border-color: rgba(0, 0, 0, 0.10)

focus:
  outline: none
  border-color: rgba(59, 130, 246, 0.5)
```

### 导航项 (Nav Item)

```css
display: flex
align-items: center
gap: 8px
padding: 8px 10px
border-radius: 6px
cursor: pointer
font-size: 13px
color: #52525B
transition: all 0.15s ease

hover:
  background: rgba(0, 0, 0, 0.04)
  color: #18181B

active/selected:
  background: rgba(0, 0, 0, 0.08)
  font-weight: 500
```

### 徽章/标签 (Badge)

```css
display: inline-flex
align-items: center
padding: 2px 6px
background: rgba(0, 0, 0, 0.06)
border-radius: 4px
font-size: 11px
font-weight: 500
color: #71717A
```

### 侧边栏 (Sidebar)

```css
width: 240px
background: #F4F4F5
border-right: 1px solid rgba(0, 0, 0, 0.06)
display: flex
flex-direction: column

/* 区块标题 */
padding: 12px 16px 8px
font-size: 12px
font-weight: 600
color: #71717A
letter-spacing: -0.01em

/* 列表项 */
padding: 6px 8px
margin-bottom: 1px
border-radius: 6px
hover: background: rgba(0, 0, 0, 0.04)
active: background: rgba(0, 0, 0, 0.06)
```

### 滚动条 (Scrollbar)

```css
/* Webkit 浏览器 */
::-webkit-scrollbar
  width: 6px
  height: 6px

::-webkit-scrollbar-track
  background: transparent

::-webkit-scrollbar-thumb
  background: rgba(0, 0, 0, 0.10)
  border-radius: 3px

::-webkit-scrollbar-thumb:hover
  background: rgba(0, 0, 0, 0.15)
```

---

## 📱 布局规范

### 侧边栏布局
```css
 Sidebar 宽度: 240px
 Header 高度: auto (padding 控制)
 Content 区域: flex: 1, overflow: auto
```

### 卡片网格
```css
/* 标准间距 */
gap: 16px

/* 紧凑间距 */
gap: 12px

/* 宽松间距 */
gap: 24px
```

### 响应式断点
```css
--screen-sm: 640px
--screen-md: 768px
--screen-lg: 1024px
--screen-xl: 1280px
```

---

## 🎯 设计检查清单

在实现任何界面时，确保满足以下标准：

- [ ] 使用正确的背景色层级 (#F9F9FB / #F4F4F5 / #FFFFFF)
- [ ] 文本使用正确的颜色层级 (#18181B / #52525B / #71717A)
- [ ] 所有边框使用 `rgba(0, 0, 0, 0.06)`
- [ ] 圆角使用规范值 (4px / 6px / 8px / 10px)
- [ ] 字号符合层级 (11px / 12px / 13px / 14px)
- [ ] 所有交互元素有 0.15s 过渡动画
- [ ] 悬停状态使用 `rgba(0, 0, 0, 0.04)` 背景
- [ ] 卡片使用轻微阴影 `0_2px_8px_-2px_rgba(0,0,0,0.05)`
- [ ] 图标使用线性风格，stroke-width: 1.5 或 2
- [ ] 布局使用 flex/grid，间距为 4 的倍数

---

## 🛠️ 技术实现建议

### CSS 变量定义
```css
:root {
  /* 背景 */
  --bg-primary: #F9F9FB;
  --bg-secondary: #F4F4F5;
  --bg-tertiary: #FFFFFF;

  /* 文本 */
  --text-primary: #18181B;
  --text-secondary: #52525B;
  --text-tertiary: #71717A;

  /* 交互 */
  --bg-hover: rgba(0, 0, 0, 0.04);
  --bg-active: rgba(0, 0, 0, 0.08);
  --border-color: rgba(0, 0, 0, 0.06);

  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 10px;

  /* 阴影 */
  --shadow-sm: 0 2px 8px -2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px -2px rgba(0, 0, 0, 0.08);
}
```

### UnoCSS / Tailwind 配置
```javascript
theme: {
  colors: {
    background: {
      primary: '#F9F9FB',
      secondary: '#F4F4F5',
      tertiary: '#FFFFFF',
    },
    text: {
      primary: '#18181B',
      secondary: '#52525B',
      tertiary: '#71717A',
    },
    border: 'rgba(0, 0, 0, 0.06)',
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '10px',
  },
  boxShadow: {
    sm: '0 2px 8px -2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 12px -2px rgba(0, 0, 0, 0.08)',
  },
}
```

### 推荐图标库
- **Lucide Icons** (首选) - 线性风格，stroke-width: 1.5~2
- **Heroicons** - 备选
- 避免使用填充图标，保持轻量感

---

## 💡 实现要点

1. **色彩克制**：避免使用鲜艳的纯色，全部使用低饱和度、半透明色彩
2. **边框优先**：用极淡边框替代阴影，营造轻盈感
3. **间距紧凑**：不要留过多空白，保持信息密度适中
4. **过渡平滑**：所有交互使用 0.15s ease 过渡
5. **字体清晰**：使用系统字体栈，字间距微调 (-0.01em ~ -0.02em)
6. **去除装饰**：无渐变、无纹理、无多余装饰元素
7. **功能优先**：每个视觉元素都服务于功能，不为了设计而设计

---

## 🌓 暗黑模式

```css
/* 暗黑模式色彩 */
:root[data-theme="dark"] {
  /* 背景 - 暗黑模式 */
  --bg-primary: #09090B        /* 主背景 - 最深 */
  --bg-secondary: #18181B      /* 次级背景 - 侧边栏 */
  --bg-tertiary: #27272A       /* 三级背景 - 卡片 */

  /* 文本 - 暗黑模式 */
  --text-primary: #FAFAFA      /* 主文本 */
  --text-secondary: #A1A1AA    /* 次级文本 */
  --text-tertiary: #71717A     /* 三级文本 */

  /* 交互 - 暗黑模式 */
  --bg-hover: rgba(255, 255, 255, 0.08)
  --bg-active: rgba(255, 255, 255, 0.12)
  --border-color: rgba(255, 255, 255, 0.08)

  /* 阴影 - 暗黑模式 */
  --shadow-sm: 0 2px 8px -2px rgba(0, 0, 0, 0.3)
  --shadow-md: 0 4px 12px -2px rgba(0, 0, 0, 0.4)
}
```

**切换原则**：
- 自动跟随系统主题
- 保持视觉对比度符合 WCAG AA 标准
- 亮度反转，饱和度降低

---

## 🧩 组件规范（续）

### 复选框 (Checkbox)

```css
/* 未选中 */
width: 16px
height: 16px
border: 1.5px solid rgba(0, 0, 0, 0.15)
border-radius: 4px
background: #FFFFFF
hover: border-color: rgba(0, 0, 0, 0.3)

/* 选中 */
background: #000000
border-color: #000000
check-icon: white, 12px

/* 禁用 */
opacity: 0.5
cursor: not-allowed

/* 标签 */
font-size: 13px
color: #18181B
margin-left: 8px
```

### 单选框 (Radio)

```css
/* 未选中 */
width: 16px
height: 16px
border: 1.5px solid rgba(0, 0, 0, 0.15)
border-radius: 50%
background: #FFFFFF
hover: border-color: rgba(0, 0, 0, 0.3)

/* 选中 */
border-color: #000000
dot: 8px, #000000, centered

/* 禁用 */
opacity: 0.5
```

### 开关 (Switch)

```css
width: 36px
height: 20px
background: rgba(0, 0, 0, 0.10)
border-radius: 10px
padding: 2px
transition: all 0.2s ease

/* Thumb */
thumb: 16px, #FFFFFF, shadow-sm

/* 选中状态 */
background: #000000
thumb: translate-x 16px

/* 禁用 */
opacity: 0.5
```

### 选择器 (Select)

```css
/* 触发器 */
height: 32px
padding: 0 12px
background: #FFFFFF
border: 1px solid rgba(0, 0, 0, 0.06)
border-radius: 6px
font-size: 13px
display: flex
align-items: center
justify-content: space-between

/* 下拉菜单 */
background: #FFFFFF
border: 1px solid rgba(0, 0, 0, 0.06)
border-radius: 8px
box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.12)
padding: 4px
min-width: 160px

/* 选项 */
padding: 6px 8px
border-radius: 4px
font-size: 13px
hover: background: rgba(0, 0, 0, 0.04)
selected: background: rgba(0, 0, 0, 0.08)
```

### 文本域 (Textarea)

```css
padding: 8px 12px
background: #FFFFFF
border: 1px solid rgba(0, 0, 0, 0.06)
border-radius: 6px
font-size: 13px
line-height: 1.5
resize: vertical
min-height: 80px

focus:
  outline: none
  border-color: rgba(59, 130, 246, 0.5)
```

### 模态框 (Modal/Dialog)

```css
/* 遮罩 */
background: rgba(0, 0, 0, 0.40)
backdrop-filter: blur(4px)

/* 弹窗 */
background: #FFFFFF
border: 1px solid rgba(0, 0, 0, 0.06)
border-radius: 12px
box-shadow: 0 16px 48px -8px rgba(0, 0, 0, 0.15)
max-width: 520px
width: calc(100% - 32px)

/* Header */
padding: 16px 20px
border-bottom: 1px solid rgba(0, 0, 0, 0.06)
font-size: 14px
font-weight: 600

/* Body */
padding: 20px

/* Footer */
padding: 16px 20px
border-top: 1px solid rgba(0, 0, 0, 0.06)
display: flex
justify-content: flex-end
gap: 8px
```

### 消息提示 (Toast/Message)

```css
/* 容器 */
padding: 10px 12px
background: #FFFFFF
border: 1px solid rgba(0, 0, 0, 0.06)
border-radius: 8px
box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.12)
display: flex
align-items: center
gap: 8px
font-size: 13px

/* 图标 */
- 成功: #10B981
- 警告: #F59E0B
- 错误: #EF4444
- 信息: #3B82F6

/* 关闭按钮 */
width: 20px
height: 20px
color: #71717A
hover: background: rgba(0, 0, 0, 0.04)
border-radius: 4px
```

### 警告框 (Alert)

```css
padding: 12px
border: 1px solid
border-radius: 8px
display: flex
gap: 12px
font-size: 13px

/* 类型变体 */
- Info: bg-#3B82F6/5, border-#3B82F6/20
- Success: bg-#10B981/5, border-#10B981/20
- Warning: bg-#F59E0B/5, border-#F59E0B/20
- Error: bg-#EF4444/5, border-#EF4444/20
```

### 表格 (Table)

```css
/* 容器 */
background: #FFFFFF
border: 1px solid rgba(0, 0, 0, 0.06)
border-radius: 10px
overflow: hidden

/* 表头 */
background: #F9F9FB
border-bottom: 1px solid rgba(0, 0, 0, 0.06)
padding: 10px 16px
font-size: 12px
font-weight: 600
color: #71717A

/* 单元格 */
padding: 10px 16px
border-bottom: 1px solid rgba(0, 0, 0, 0.04)
font-size: 13px

/* 行悬停 */
hover: background: rgba(0, 0, 0, 0.02)

/* 选中行 */
background: rgba(59, 130, 246, 0.05)
```

### 列表 (List)

```css
/* 列表项 */
padding: 10px 12px
border-bottom: 1px solid rgba(0, 0, 0, 0.04)
hover: background: rgba(0, 0, 0, 0.02)

/* 最后一项 */
border-bottom: none

/* 紧凑模式 */
padding: 6px 8px
font-size: 12px
```

### 头像 (Avatar)

```css
/* 尺寸变体 */
- xs: 20px
- sm: 24px
- md: 32px
- lg: 40px
- xl: 48px

border-radius: 50%
background: #F4F4F5
object-fit: cover

/* 在线状态指示器 */
dot: 8px, positioned at bottom-right
- online: #10B981
- offline: #71717A
- busy: #EF4444
```

### 标签 (Tag)

```css
display: inline-flex
padding: 4px 8px
background: #F4F4F5
border-radius: 4px
font-size: 11px
font-weight: 500

/* 颜色变体 */
- 默认: bg-#F4F4F5, text-#52525B
- 蓝色: bg-#3B82F6/10, text-#3B82F6
- 绿色: bg-#10B981/10, text-#10B981
- 橙色: bg-#F59E0B/10, text-#F59E0B
- 红色: bg-#EF4444/10, text-#EF4444

/* 可删除 */
padding-right: 4px
close-icon: 14px, hover: opacity-0.6
```

### 提示框 (Tooltip)

```css
padding: 6px 10px
background: #18181B
color: #FFFFFF
font-size: 12px
border-radius: 6px
box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.20)
max-width: 240px
line-height: 1.4

/* 箭头 */
triangle: 4px, #18181B

/* 延迟 */
show-delay: 0ms
hide-delay: 0ms
```

### 分割线 (Divider)

```css
height: 1px
background: rgba(0, 0, 0, 0.06)
margin: 12px 0

/* 文字分割线 */
display: flex
align-items: center
gap: 12px
text: 12px, #71717A

before/after: flex-1, height-1px, bg-rgba(0,0,0,0.06)
```

### 进度条 (Progress)

```css
height: 4px
background: rgba(0, 0, 0, 0.06)
border-radius: 2px
overflow: hidden

/* 进度条填充 */
background: #000000
height: 100%
transition: width 0.3s ease

/* 状态颜色 */
- 默认: #000000
- 成功: #10B981
- 警告: #F59E0B
- 错误: #EF4444
```

### 加载状态 (Loading/Spinner)

```css
/* 圆形加载 */
size: 20px
border: 2px solid rgba(0, 0, 0, 0.08)
border-top-color: #000000
border-radius: 50%
animation: spin 0.6s linear infinite

@keyframes spin:
  to: transform: rotate(360deg)

/* 尺寸变体 */
- sm: 16px
- md: 20px
- lg: 24px
```

### 骨架屏 (Skeleton)

```css
background: linear-gradient(
  90deg,
  rgba(0, 0, 0, 0.04) 0%,
  rgba(0, 0, 0, 0.08) 50%,
  rgba(0, 0, 0, 0.04) 100%
)
background-size: 200% 100%
border-radius: 4px
animation: shimmer 1.5s infinite

@keyframes shimmer:
  0%: background-position: 200% 0
  100%: background-position: -200% 0

/* 变体 */
- 文本: height: 14px, margin-bottom: 8px
- 圆形: border-radius: 50%
- 卡片: border-radius: 10px, padding: 16px
```

### 空状态 (Empty State)

```css
text-align: center
padding: 48px 24px

/* 图标 */
size: 64px
color: rgba(0, 0, 0, 0.10)
margin-bottom: 16px

/* 标题 */
font-size: 14px
font-weight: 600
color: #18181B
margin-bottom: 8px

/* 描述 */
font-size: 13px
color: #71717A
margin-bottom: 20px
max-width: 280px

/* 操作按钮 */
margin-top: 16px
```

---

## 📊 图标系统

### 图标尺寸
```css
--icon-xs: 12px   /* 紧凑空间 */
--icon-sm: 14px   /* 小图标、徽章内 */
--icon-md: 16px   /* 标准尺寸、按钮内 */
--icon-lg: 20px   /* 大图标 */
--icon-xl: 24px   /* 特大图标 */
```

### 图标使用规范
- **线条粗细**：stroke-width: 1.5 或 2
- **风格**：线性图标（outline），不使用填充图标
- **颜色**：继承文本颜色或使用语义色
- **间距**：图标与文字间距 8px

### 推荐图标库
```json
{
  "primary": "Lucide Icons",
  "fallback": "Heroicons",
  "reason": "线性风格、2px stroke-width、一致的视觉语言"
}
```

### 图标组合
```css
/* 按钮图标 */
icon + text: gap-8px

/* 独立图标按钮 */
padding: 8px
hover: background: rgba(0, 0, 0, 0.04)
border-radius: 6px

/* 图标背景 */
size: 32px
background: #F4F4F5
border-radius: 8px
icon: centered, 16px
```

---

## 🎭 层级系统

```css
/* Z-Index 规范 */
--z-index-base: 0
--z-index-dropdown: 100
--z-index-sticky: 200
--z-index-fixed: 300
--z-index-modal-backdrop: 400
--z-index-modal: 500
--z-index-popover: 600
--z-index-tooltip: 700
--z-index-toast: 800
```

**使用原则**：
- 避免使用大于 1000 的 z-index
- 使用 CSS 变量管理层级
- 层级叠加最多不超过 3 层

---

## 🎬 动画系统

### 缓动函数
```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1)    /* 推荐：自然流畅 */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1) /* 标准 */
--ease-in: cubic-bezier(0.4, 0, 1, 1)       /* 加速 */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1) /* 弹性 */
```

### 动画时长
```css
--duration-instant: 0.1s   /* 即时反馈 */
--duration-fast: 0.15s     /* 快速交互（推荐） */
--duration-normal: 0.2s    /* 标准过渡 */
--duration-slow: 0.3s      /* 慢速动画 */
--duration-slower: 0.5s    /* 复杂动画 */
```

### 常用动画
```css
/* 淡入淡出 */
@keyframes fadeIn {
  from: { opacity: 0 }
  to: { opacity: 1 }
}

/* 滑入 */
@keyframes slideInUp {
  from: { transform: translateY(10px); opacity: 0 }
  to: { transform: translateY(0); opacity: 1 }
}

/* 缩放 */
@keyframes scaleIn {
  from: { transform: scale(0.95); opacity: 0 }
  to: { transform: scale(1); opacity: 1 }
}

/* 使用示例 */
animation: fadeIn 0.2s ease-out
```

### 动画原则
- 优先使用 opacity 和 transform（GPU 加速）
- 避免使用 width/height/left/top 动画
- 微交互使用 0.15s 快速过渡
- 复杂动画不超过 0.5s

---

## ♿ 可访问性

### 颜色对比度
```css
/* WCAG AA 标准 */
- 正文文本（14px+）：对比度 ≥ 4.5:1
- 大文本（18px+或粗体14px+）：对比度 ≥ 3:1
- 交互元素：对比度 ≥ 3:1

/* 当前设计已符合 */
#18181B on #FFFFFF: 15.2:1 ✓
#52525B on #FFFFFF: 7.5:1 ✓
#71717A on #FFFFFF: 4.6:1 ✓
```

### 键盘导航
```css
/* 焦点样式 */
outline: 2px solid rgba(59, 130, 246, 0.5)
outline-offset: 2px

/* Tab 顺序 */
遵循 DOM 顺序，逻辑从上到下、从左到右

/* 快捷键示例 */
- Cmd/Ctrl + K: 打开搜索
- Cmd/Ctrl + /: 打开快捷键面板
- Esc: 关闭弹窗/下拉
```

### ARIA 标签
```html
<!-- 按钮 -->
<button aria-label="关闭">×</button>

<!-- 图标按钮 -->
<button aria-label="设置">
  <Settings aria-hidden="true" />
</button>

<!-- 加载状态 -->
<div role="status" aria-live="polite">
  <span aria-hidden="true">⏳</span>
  <span>加载中...</span>
</div>

<!-- 错误消息 -->
<div role="alert" aria-live="assertive">
  错误信息
</div>
```

### 屏幕阅读器
```css
/* 仅屏幕阅读器可见 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## 📱 响应式设计

### 断点系统
```css
/* 移动优先 */
--screen-xs: 0px
--screen-sm: 640px   /* 手机横屏 */
--screen-md: 768px   /* 平板 */
--screen-lg: 1024px  /* 桌面 */
--screen-xl: 1280px  /* 大桌面 */
--screen-2xl: 1536px /* 超大屏 */
```

### 响应式调整
```css
/* 移动端 (默认) */
.container {
  padding: 12px;
  font-size: 13px;
}

/* 平板及以上 */
@media (min-width: 768px) {
  .container {
    padding: 16px;
    font-size: 14px;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container {
    padding: 24px;
  }
}
```

### 移动端优化
```css
/* 触控目标最小尺寸 */
min-width: 44px
min-height: 44px

/* 侧边栏 */
移动端: 底部导航或抽屉式
桌面端: 固定左侧，240px

/* 表格 */
移动端: 卡片视图或横向滚动
桌面端: 完整表格

/* 弹窗 */
移动端: 底部全屏抽屉
桌面端: 居中弹窗
```

---

## 🔍 设计检查清单

在实现任何界面时，确保满足以下标准：

### 基础规范
- [ ] 使用正确的背景色层级 (#F9F9FB / #F4F4F5 / #FFFFFF)
- [ ] 文本使用正确的颜色层级 (#18181B / #52525B / #71717A)
- [ ] 所有边框使用 `rgba(0, 0, 0, 0.06)`
- [ ] 圆角使用规范值 (4px / 6px / 8px / 10px)
- [ ] 字号符合层级 (11px / 12px / 13px / 14px)

### 交互规范
- [ ] 所有交互元素有 0.15s 过渡动画
- [ ] 悬停状态使用 `rgba(0, 0, 0, 0.04)` 背景
- [ ] 卡片使用轻微阴影 `0_2px_8px_-2px_rgba(0,0,0,0.05)`
- [ ] 焦点状态有明确的视觉反馈
- [ ] 加载状态有明确的视觉指示

### 图标与图像
- [ ] 图标使用线性风格，stroke-width: 1.5 或 2
- [ ] 图标尺寸符合规范 (12px/14px/16px/20px/24px)
- [ ] 头像使用圆形或统一圆角
- [ ] 图像有合适的占位符

### 可访问性
- [ ] 颜色对比度符合 WCAG AA 标准
- [ ] 交互元素可通过键盘访问
- [ ] 表单输入有明确的 label
- [ ] 图标按钮有 aria-label
- [ ] 错误信息有明确的视觉和文本提示

### 响应式
- [ ] 移动端触控目标至少 44px × 44px
- [ ] 文本在小屏幕上可读
- [ ] 布局在不同断点下合理调整
- [ ] 表格和复杂组件在移动端有替代方案

### 性能
- [ ] 动画使用 transform 和 opacity
- [ ] 避免同步布局抖动
- [ ] 图片使用合适的格式和尺寸
- [ ] 过度效果不会引起性能问题

---

## 💻 Vue 组件代码示例

### Button 组件

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

export interface ButtonProps {
  variant?: 'default' | 'ghost' | 'subtle'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  icon?: any
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'default',
  size: 'md',
  disabled: false,
})

const emit = defineEmits(['click'])

const buttonClass = computed(() => {
  const base = [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'font-medium',
    'transition-all',
    'duration-200',
    'rounded-md',
    'cursor-pointer',
    'border-none',
    'outline-none',
  ]

  const variants = {
    default: [
      'bg-black',
      'text-white',
      'hover:bg-black/90',
      'active:bg-black/80',
    ],
    ghost: [
      'bg-transparent',
      'text-zinc-500',
      'hover:bg-black/[0.04]',
      'hover:text-zinc-900',
      'active:bg-black/[0.08]',
    ],
    subtle: [
      'bg-zinc-100',
      'text-zinc-700',
      'hover:bg-zinc-200',
      'active:bg-zinc-300',
    ],
  }

  const sizes = {
    sm: ['h-7', 'px-2', 'text-[12px]'],
    md: ['h-8', 'px-3', 'text-[13px]'],
    lg: ['h-9', 'px-4', 'text-[14px]'],
  }

  return cn(
    base,
    variants[props.variant],
    sizes[props.size],
    props.disabled && ['opacity-50', 'cursor-not-allowed']
  )
})

const handleClick = (e: MouseEvent) => {
  if (!props.disabled) {
    emit('click', e)
  }
}
</script>

<template>
  <button :class="buttonClass" :disabled="disabled" @click="handleClick">
    <component v-if="icon" :is="icon" class="w-4 h-4" stroke-width="1.5" />
    <slot />
  </button>
</template>
```

### Card 组件

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

export interface CardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const props = withDefaults(defineProps<CardProps>(), {
  padding: 'md',
  hover: false,
})

const cardClass = computed(() => {
  const base = [
    'bg-white',
    'rounded-[10px]',
    'border',
    'border-black/[0.06]',
    'shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]',
  ]

  const paddings = {
    none: [],
    sm: ['p-3'],
    md: ['p-4'],
    lg: ['p-5'],
  }

  return cn(
    base,
    paddings[props.padding],
    props.hover && ['transition-shadow', 'duration-200', 'hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]']
  )
})
</script>

<template>
  <div :class="cardClass">
    <slot />
  </div>
</template>
```

### Input 组件

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

export interface InputProps {
  modelValue: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
}

const props = withDefaults(defineProps<InputProps>(), {
  placeholder: '',
  disabled: false,
  error: false,
})

const emit = defineEmits(['update:modelValue'])

const inputClass = computed(() => {
  const base = [
    'w-full',
    'h-8',
    'px-3',
    'bg-white',
    'border',
    'border-black/[0.06]',
    'rounded-md',
    'text-[13px]',
    'text-[#18181B]',
    'placeholder:text-[#A1A1AA]',
    'transition-all',
    'outline-none',
  ]

  const states = {
    default: ['hover:border-black/[0.10]', 'focus:border-blue-500/50'],
    error: ['border-red-500/50', 'focus:border-red-500'],
  }

  return cn(
    base,
    props.error ? states.error : states.default,
    props.disabled && ['opacity-50', 'cursor-not-allowed']
  )
})

const handleInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <input
    :class="inputClass"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="handleInput"
  />
</template>
```

### Checkbox 组件

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

export interface CheckboxProps {
  modelValue: boolean
  disabled?: boolean
  label?: string
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  disabled: false,
  label: '',
})

const emit = defineEmits(['update:modelValue'])

const wrapperClass = computed(() => {
  return cn(
    'inline-flex',
    'items-center',
    'gap-2',
    'cursor-pointer',
    props.disabled && 'opacity-50 cursor-not-allowed'
  )
})

const checkboxClass = computed(() => {
  const base = [
    'w-4',
    'h-4',
    'border',
    'border-black/[0.15]',
    'rounded',
    'transition-all',
    'flex',
    'items-center',
    'justify-center',
  ]

  const checked = props.modelValue
    ? ['bg-black', 'border-black']
    : ['bg-white', 'hover:border-black/[0.30]']

  return cn(base, checked, props.disabled && 'cursor-not-allowed')
})

const labelClass = computed(() => {
  return cn(
    'text-[13px]',
    'text-[#18181B]',
    'select-none'
  )
})

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
  <div :class="wrapperClass" @click="toggle">
    <div :class="checkboxClass">
      <Check v-if="modelValue" :size="12" color="white" stroke-width="3" />
    </div>
    <span v-if="label" :class="labelClass">{{ label }}</span>
  </div>
</template>
```

---

## 📋 使用说明

每次开始新项目时：

1. **复制本提示词到项目**
   ```bash
   cp DESIGN_SYSTEM.md your-project/docs/
   ```

2. **设置 CSS 变量**
   - 复制「色彩系统」中的 CSS 变量到全局样式文件
   - 配置暗黑模式支持

3. **创建基础组件库**
   - Button（按钮）
   - Card（卡片）
   - Input（输入框）
   - Checkbox（复选框）
   - 使用上方提供的 Vue 代码示例

4. **配置开发工具**
   - UnoCSS / Tailwind 配置（参考「技术实现建议」）
   - 安装 Lucide Icons 图标库

5. **遵循设计规范**
   - 使用「设计检查清单」验证每个界面
   - 新组件参考「组件规范」部分
   - 保持与现有产品 100% 一致

6. **团队协作**
   - 将此文档加入 README
   - PR 审查时检查清单项目
   - 定期审查代码一致性

---

## 🎯 核心原则

### 一致性 > 创新性
- 严格遵循设计规范，不要"创新"
- 保持所有产品的视觉一致性
- 设计系统是约束，不是限制

### 功能 > 形式
- 每个视觉元素都服务于功能
- 去除所有不必要的装饰
- 简洁是终极的复杂

### 细节决定成败
- 1px 的差异也会影响整体
- 间距、圆角、颜色都要精确
- 过渡动画要自然流畅

### 性能与体验
- 使用 GPU 加速动画
- 避免同步布局抖动
- 保持 60fps 流畅体验

---

**记住：好的设计系统是看不见的，用户只会觉得产品"好用"和"美观"！**
