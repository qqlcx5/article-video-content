"""
AI笔记生成脚本 - 单个视频处理
用法: python generate_note.py <content> <link_url> <link_title> <output_path> <token>
"""
import sys
import json
import urllib.request
from pathlib import Path
from datetime import datetime


def log_progress(percent, message):
    """输出进度信息（stderr，不影响最终JSON输出）"""
    progress_data = {
        "type": "progress",
        "percent": percent,
        "message": message,
        "timestamp": datetime.now().isoformat()
    }
    print(json.dumps(progress_data, ensure_ascii=False), file=sys.stderr, flush=True)


def generate_note(content, link_url, link_title, output_path, token):
    """生成单个 Markdown 文件"""
    api_url = "https://get-notes.luojilab.com/voicenotes/web/notes/stream"

    payload = {
        "attachments": [{
            "size": 100,
            "type": "link",
            "title": "",
            "url": link_url
        }],
        "content": content,
        "entry_type": "ai",
        "note_type": "link",
        "source": "web",
        "prompt_template_id": ""
    }

    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    try:
        log_progress(10, f"开始处理: {link_title}")

        req = urllib.request.Request(
            api_url,
            data=json.dumps(payload).encode('utf-8'),
            headers=headers,
            method='POST'
        )

        log_progress(30, f"正在请求API: {link_title}")

        with urllib.request.urlopen(req, timeout=120) as response:
            markdown_content = ""
            current_instruction = ""
            current_summary_title = ""
            current_content = ""
            chunk_count = 0

            for line in response:
                line = line.decode('utf-8').strip()

                if line.startswith('data:'):
                    json_str = line[5:].strip()
                    if not json_str:
                        continue

                    try:
                        data = json.loads(json_str)

                        if data.get('code') == 200 and data.get('data', {}).get('msg'):
                            msg = json.loads(data['data']['msg'])
                            msg_type = data.get('msg_type', 1)

                            # 内容增量
                            if msg_type == 1:
                                if 'instruction' in msg:
                                    current_instruction += msg['instruction']
                                if 'summary_title' in msg:
                                    current_summary_title += msg['summary_title']
                                if 'content' in msg:
                                    current_content += msg['content']

                                chunk_count += 1
                                if chunk_count % 50 == 0:
                                    progress = 30 + min(50, chunk_count // 5)
                                    log_progress(progress, f"接收内容中: {link_title} ({chunk_count} chunks)")

                            # 结束标记
                            elif msg_type == 101:
                                break

                    except json.JSONDecodeError:
                        continue

            log_progress(85, f"正在保存文件: {link_title}")

            # 构建最终内容
            final_content = f"""# {link_title}

> 视频链接: {link_url}
> 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

---

## 摘要

{current_summary_title}

## 内容

{current_content}
"""

            # 保存文件
            output_file = Path(output_path)
            output_file.parent.mkdir(parents=True, exist_ok=True)
            output_file.write_text(final_content, encoding='utf-8')

            log_progress(100, f"完成: {link_title}")

            # 输出最终结果（stdout）
            result = {
                "type": "result",
                "success": True,
                "output_file": str(output_file),
                "title": link_title,
                "content_length": len(final_content)
            }
            print(json.dumps(result, ensure_ascii=False), flush=True)

    except urllib.error.HTTPError as e:
        error_result = {
            "type": "result",
            "success": False,
            "title": link_title,
            "error": f"HTTP 错误: {e.code} - {e.reason}"
        }
        print(json.dumps(error_result, ensure_ascii=False), flush=True)

    except Exception as e:
        error_result = {
            "type": "result",
            "success": False,
            "title": link_title,
            "error": str(e)
        }
        print(json.dumps(error_result, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    if len(sys.argv) < 6:
        print(json.dumps({
            "type": "error",
            "message": "用法: python generate_note.py <content> <link_url> <link_title> <output_path> <token>"
        }, ensure_ascii=False), file=sys.stderr)
        sys.exit(1)

    generate_note(
        content=sys.argv[1],
        link_url=sys.argv[2],
        link_title=sys.argv[3],
        output_path=sys.argv[4],
        token=sys.argv[5]
    )
