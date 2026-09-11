# 抖音短视频文案采集与语料库 (article-video-content)

> 自动化提取抖音博主短视频口播文案、结构化转写与内容沉淀工具。

[![Node.js](https://img.shields.io/badge/Node.js->=16-green?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

---

## 📖 项目简介

本项目用于批量采集与解析抖音平台指定创作者公开视频的口播文案、视频元数据（标题、发布时间、视频链接等），并将其沉淀为易于检索与分析的结构化 JSON 语料库。

适合用于：
* 爆款视频选题挖掘与内容拆解
* 优秀口播文案风格学习与知识沉淀
* 结合大模型构建自媒体创作专属知识库 / RAG 检索知识源

---

## 📂 已收录博主文案样本

当前语料库已包含多位知识博主与垂直领域创作者的高质量文案数据：

- 💼 **科技与职场**：`深度进化Theo.json`、`程序员三千.json`、`IT咖啡馆.json`、`夏鹏.json`
- 🤖 **AI 与前沿探索**：`阿甘探AI.json`、`ai呀蔡蔡.json`
- 📈 **财经与投资**：`炒股养家.json`、`炒股养家 大 V.json`
- 🧠 **个人成长与认知**：`习惯研究社.json`、`玄离199.json`、`远方os.json`、`阿丽.json`

---

## 🛠️ 核心文件与实现

```text
├── 抖音视频采集.js      # 核心采集与解析执行脚本
├── 1.js                # 数据清洗与格式化辅助脚本
├── *.json              # 各博主结构化视频文案存储文件
└── .gitignore          # 忽略本地临时文件与环境配置
```

---

## 🚀 快速使用

### 1. 环境准备

确保已安装 [Node.js](https://nodejs.org/) (建议 v16+)。

### 2. 克隆项目

```bash
git clone https://github.com/qqlcx5/article-video-content.git
cd article-video-content
```

### 3. 运行采集脚本

```bash
# 执行视频文案提取
node 抖音视频采集.js
```

### 4. 数据格式示例

导出的 JSON 数据结构如下：

```json
[
  {
    "title": "短视频标题 / 主题",
    "content": "完整的视频口播台词与转写文本内容...",
    "publish_time": "2026-05-15",
    "video_url": "https://v.douyin.com/xxxxxx/"
  }
]
```

---

## ⚠️ 免责声明与使用须知

1. 本项目仅供前端网络请求逆向分析、个人学术研究与学习交流使用。
2. 采集脚本请合理设置请求频率与间隔，切勿滥用请求以免对目标服务器造成压力。
3. 文本版权归原短视频创作者所有，严禁将采集内容用于商业盗用或侵权行为。

---

## 📄 开源协议

本项目遵循 [MIT 协议](LICENSE) 开源。
