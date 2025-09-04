// 改进后 - 添加错误处理
let requestDataArray = [];
try {
  requestDataArray = require("./程序员三千.json");
  console.log(`成功加载 ${requestDataArray.length} 条数据`);
} catch (error) {
  console.error("加载JSON文件失败:", error.message);
  process.exit(1);
}

// 基础配置
const myHeaders = new Headers();
myHeaders.append(
  "Authorization",
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEzOTY0OTUsImVudiI6InByb2R1Y3Rpb24iLCJleHAiOjE3NTk1Nzg0OTEsImlhdCI6MTc1Njk4NjQ5MSwiaXNzIjoiZGRsbF9vZmZpY2FsIn0.NKW_XJnVt-XRFDl-zbBnchseQ5HTJFJqfNsEmUoW6Yo"
);
myHeaders.append("X-Request-ID", "1756986574890");
myHeaders.append("Content-Type", "application/json");

// 发送单个请求的函数
function sendRequest(href, index) {
  let pars = {
    attachments: [
      {
        size: 100,
        type: "link",
        url: "https://www.douyin.com/video/7545276390624447801",
      },
    ],
    content: "",
    entry_type: "ai",
    note_type: "link",
    source: "web",
    topic_directory_id: "2155868",
    topic_id: "1874944",
  };
  pars.attachments[0].url = href;
  const raw = JSON.stringify(pars);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  console.log(raw);
  // 发送请求但不等待返回
  fetch(
    "https://get-notes.luojilab.com/voicenotes/web/topics/notes/stream",
    requestOptions
  )
    .then((response) => {
      console.log(`请求 ${index + 1} 已发送，状态: ${response.status}`);
    })
    .catch((error) => {
      console.error(`请求 ${index + 1} 失败:`, error);
    });
}


// 批量发送请求，每个间隔3秒
function batchSendRequests() {
  console.log(`开始批量发送 ${requestDataArray.length} 个请求...`);

  requestDataArray.forEach((data, index) => {
    // 每个请求间隔3秒
    setTimeout(() => {
      sendRequest(data.href, index);
    }, index * 3000); // 3秒 = 3000毫秒
  });
}

// 启动批量请求
batchSendRequests();
