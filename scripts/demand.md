scripts/userequire.md，前端来请求相关的比较合适，后端处理md文件

A[用户选中视频] --> B[点击生成AI笔记]
D --> E[发送SSE请求]
E --> F[实时接收流式数据]
F --> G[解析SSE事件]
G --> H[提取Markdown内容]
H --> I[实时写入文件]
I --> J[更新UI进度]
F --> K[请求完成]
K --> L[生成元数据]

设置添加子类菜单栏
配置API
