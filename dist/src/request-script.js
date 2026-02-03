"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRequestScript = generateRequestScript;
function jsString(value) {
    return JSON.stringify(value);
}
function generateRequestScript(videos, options = {}) {
    const endpoint = options.endpoint ?? "https://get-notes.luojilab.com/voicenotes/web/topics/notes/stream";
    const delayMs = options.delayMs ?? 3000;
    const topicId = options.topicId ?? "<topic_id>";
    const topicDirectoryId = options.topicDirectoryId ?? "<topic_directory_id>";
    const authorization = options.authorization ?? "Bearer <YOUR_TOKEN>";
    const xRequestId = options.xRequestId ?? String(Date.now());
    const list = videos.map((v) => ({
        id: String(v.id ?? ""),
        href: String(v.href ?? ""),
        title: String(v.title ?? "")
    }));
    return `// 由“抖音UP主视频管理器”生成
// 运行环境：Node.js 18+（全局 fetch）
// 使用说明：填好 CONFIG 里的 token / topic 配置后，执行：node request.js

const CONFIG = {
  endpoint: ${jsString(endpoint)},
  authorization: ${jsString(authorization)},
  xRequestId: ${jsString(xRequestId)},
  topicId: ${jsString(topicId)},
  topicDirectoryId: ${jsString(topicDirectoryId)},
  delayMs: ${delayMs}
};

const videos = ${JSON.stringify(list, null, 2)};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function buildRequestBody(url) {
  return {
    attachments: [
      {
        size: 100,
        type: "link",
        url
      }
    ],
    content: "",
    entry_type: "ai",
    note_type: "link",
    source: "web",
    topic_directory_id: CONFIG.topicDirectoryId,
    topic_id: CONFIG.topicId
  };
}

async function sendOne(video, index) {
  const headers = new Headers();
  headers.append("Authorization", CONFIG.authorization);
  headers.append("X-Request-ID", CONFIG.xRequestId);
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify(buildRequestBody(video.href));
  const res = await fetch(CONFIG.endpoint, {
    method: "POST",
    headers,
    body,
    redirect: "follow"
  });

  console.log(\`[\${index + 1}/\${videos.length}] \${video.id} \${res.status} \${video.title}\`);
  return res.status;
}

async function main() {
  console.log(\`开始发送 \${videos.length} 个请求，间隔 \${CONFIG.delayMs}ms\`);

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    if (!video.href) continue;
    try {
      await sendOne(video, i);
    } catch (e) {
      console.error(\`请求失败：\${video.id}\`, e);
    }
    if (i < videos.length - 1) {
      await sleep(CONFIG.delayMs);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
`;
}
