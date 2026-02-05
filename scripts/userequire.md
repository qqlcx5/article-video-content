## AI

### Analyzing network data

**Request:**
````
curl 'https://get-notes.luojilab.com/voicenotes/web/notes/stream' \
  -H 'Accept: */*' \
  -H 'Accept-Language: zh-CN,zh;q=0.9' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsInZlciI6Mn0.eyJ1aWQiOjIwMTg3MDcsImVudiI6InByb2R1Y3Rpb24iLCJqdGkiOiJlMWZjMDRlMC02ZDMzLTQ3ZjAtOGExMS0wZThiN2VkNjk5OWYiLCJkZXZpY2VfaWQiOiJiYWQ5ZTgzZDRmMzVlMjZlMjg4ZTlhYjFhNmM2ZWUyOSIsImV4cCI6MTc3MDI2MDk3MywiaWF0IjoxNzcwMjU5MTczLCJpc3MiOiJkZGxsX29mZmljYWwifQ.XkPOuvfGPdxaTAtVENYHalob9FBIns4GlfhXU1Kb9Oo' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://www.biji.com' \
  -H 'Referer: https://www.biji.com/' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: cross-site' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36' \
  -H 'X-Request-ID: 1770259427175' \
  -H 'sec-ch-ua: "Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  --data-raw '{"attachments":[{"size":100,"type":"link","title":"","url":"https://www.douyin.com/video/7534706512447491354"}],"content":"**这个问题，世界上谁最懂？TA 会怎么说? 写出他们的思考过程？** 最强大脑、顶级专家、世界级、best minds ## 原则 1. **找真正最懂的** — 不是找\"合适的\"，是找\"最强的\" 2. **基于真实** — 模拟要基于 TA 公开的思想、著作、言论 3. **引用原话** — 尽可能用 TA 说过的话","entry_type":"ai","note_type":"link","source":"web","prompt_template_id":""}'
````

**Response:**
````
Response Status: 200 OK

Response headers:
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin,X-Requested-With,Content-Type,Accept,X-Uid,X-Av,*
Access-Control-Allow-Methods: *
Access-Control-Allow-Origin: *
Cache-Control: no-cache
Connection: keep-alive
Content-Type: text/event-stream
Date: Thu, 05 Feb 2026 02:12:01 GMT
Set-Cookie: <redacted>
Set-Cookie: <redacted>
Transfer-Encoding: chunked

Response body:
 id:0
data: {"code":200,"retry":30000,"msg_type":-1,"data":{"msg":"","note_id":"1900799539548426344"}}

id:1
data: {"code":200,"retry":60000,"msg_type":6,"data":{"msg":"[{\"msg\":\"正在浏览链接\",\"processName\":\"received_req\",\"processStatus\":\"end\"}]"}}

id:2
data: {"code":200,"retry":60000,"msg_type":6,"data":{"msg":"[{\"msg\":\"正在浏览链接\",\"processName\":\"received_req\",\"processStatus\":\"end\"},{\"msg\":\"链接分析中\",\"processName\":\"analysis_web_page\",\"processStatus\":\"end\"}]"}}

id:3
data: {"code":200,"retry":60000,"msg_type":6,"data":{"msg":"[{\"msg\":\"正在浏览链接\",\"processName\":\"received_req\",\"processStatus\":\"end\"},{\"msg\":\"链接分析中\",\"processName\":\"analysis_web_page\",\"processStatus\":\"end\"},{\"msg\":\"AI 正在写笔记\",\"processName\":\"build_answer\",\"processStatus\":\"end\"}]"}}

id:4
data: {"code":200,"retry":30000,"msg_type":-1,"data":{"msg":"","note_id":"1900799539548426344","link_title":"怎样才能做到知行合一？ #个人成长 #深度思考 #知行合一 #认知提升"}}

id:5
data: {"code":200,"data":{"msg":"{\"instruction\":\"\"}"},"msg_type":1,"retry":30000}

id:6
data: {"code":200,"data":{"msg":"{\"instruction\":\"**\"}"},"msg_type":1,"retry":30000}

id:7
data: {"code":200,"data":{"msg":"{\"instruction\":\"这个\"}"},"msg_type":1,"retry":30000}

id:8
data: {"code":200,"data":{"msg":"{\"instruction\":\"问题\"}"},"msg_type":1,"retry":30000}

id:9
data: {"code":200,"data":{"msg":"{\"instruction\":\"，\"}"},"msg_type":1,"retry":30000}

id:10
data: {"code":200,"data":{"msg":"{\"instruction\":\"世界\"}"},"msg_type":1,"retry":30000}

id:11
data: {"code":200,"data":{"msg":"{\"instruction\":\"上\"}"},"msg_type":1,"retry":30000}

id:12
data: {"code":200,"data":{"msg":"{\"instruction\":\"谁\"}"},"msg_type":1,"retry":30000}

id:13
data: {"code":200,"data":{"msg":"{\"instruction\":\"最\"}"},"msg_type":1,"retry":30000}

id:14
data: {"code":200,"data":{"msg":"{\"instruction\":\"懂\"}"},"msg_type":1,"retry":30000}

id:15
data: {"code":200,"data":{"msg":"{\"instruction\":\"？\"}"},"msg_type":1,"retry":30000}

id:16
data: {"code":200,"data":{"msg":"{\"instruction\":\"TA\"}"},"msg_type":1,"retry":30000}

id:17
data: {"code":200,"data":{"msg":"{\"instruction\":\" \"}"},"msg_type":1,"retry":30000}

id:18
data: {"code":200,"data":{"msg":"{\"instruction\":\"会\"}"},"msg_type":1,"retry":30000}

id:19
data: {"code":200,"data":{"msg":"{\"instruction\":\"怎么\"}"},"msg_type":1,"retry":30000}

id:20
data: {"code":200,"data":{"msg":"{\"instruction\":\"说\"}"},"msg_type":1,"retry":30000}

id:21
data: {"code":200,"data":{"msg":"{\"instruction\":\"?\"}"},"msg_type":1,"retry":30000}

id:22
data: {"code":200,"data":{"msg":"{\"instruction\":\" \"}"},"msg_type":1,"retry":30000}

id:23
data: {"code":200,"data":{"msg":"{\"instruction\":\"写出\"}"},"msg_type":1,"retry":30000}

id:24
data: {"code":200,"data":{"msg":"{\"instruction\":\"他们\"}"},"msg_type":1,"retry":30000}

id:25
data: {"code":200,"data":{"msg":"{\"instruction\":\"的\"}"},"msg_type":1,"retry":30000}

id:26
data: {"code":200,"data":{"msg":"{\"instruction\":\"思考\"}"},"msg_type":1,"retry":30000}

id:27
data: {"code":200,"data":{"msg":"{\"instruction\":\"过程\"}"},"msg_type":1,"retry":30000}

id:28
data: {"code":200,"data":{"msg":"{\"instruction\":\"？\"}"},"msg_type":1,"retry":30000}

id:29
data: {"code":200,"data":{"msg":"{\"instruction\":\"**\"}"},"msg_type":1,"retry":30000}

id:30
data: {"code":200,"data":{"msg":"{\"instruction\":\" \"}"},"msg_type":1,"retry":30000}

id:31
data: {"code":200,"data":{"msg":"{\"instruction\":\"最\"}"},"msg_type":1,"retry":30000}

id:32
data: {"code":200,"data":{"msg":"{\"instruction\":\"强大\"}"},"msg_type":1,"retry":30000}

id:33
data: {"code":200,"data":{"msg":"{\"instruction\":\"脑\"}"},"msg_type":1,"retry":30000}

id:34
data: {"code":200,"data":{"msg":"{\"instruction\":\"、\"}"},"msg_type":1,"retry":30000}

id:35
data: {"code":200,"data":{"msg":"{\"instruction\":\"顶级\"}"},"msg_type":1,"retry":30000}

id:36
data: {"code":200,"data":{"msg":"{\"instruction\":\"专家\"}"},"msg_type":1,"retry":30000}

id:37
data: {"code":200,"data":{"msg":"{\"instruction\":\"、\"}"},"msg_type":1,"retry":30000}

id:38
data: {"code":200,"data":{"msg":"{\"instruction\":\"世界级\"}"},"msg_type":1,"retry":30000}

id:39
data: {"code":200,"data":{"msg":"{\"instruction\":\"、\"}"},"msg_type":1,"retry":30000}

id:40
data: {"code":200,"data":{"msg":"{\"instruction\":\"best\"}"},"msg_type":1,"retry":30000}

id:41
data: {"code":200,"data":{"msg":"{\"instruction\":\" minds\"}"},"msg_type":1,"retry":30000}

id:42
data: {"code":200,"data":{"msg":"{\"instruction\":\" ## 原则 1. **找真正最懂的** — 不是找\\\"合适的\\\"，是找\\\"最强的\\\" 2. **基于真实** — 模拟要基于 TA 公开的思想、著作、言论 3. **引用原话** — 尽可能用 TA 说过的话\\n\"}"},"msg_type":1,"retry":30000}

id:43
data: {"code":200,"data":{"msg":"{\"instruction\":\"\"}"},"msg_type":1,"retry":30000}

id:44
data: {"code":200,"data":{"msg":"{\"instruction\":\"**这个问题，世界上谁最懂？TA 会怎么说? 写出他们的思考过程？** 最强大脑、顶级专家、世界级、best minds ## 原则 1. **找真正最懂的** — 不是找\\\"合适的\\\"，是找\\\"最强的\\\" 2. **基于真实** — 模拟要基于 TA 公开的思想、著作、言论 3. **引用原话** — 尽可能用 TA 说过的话\\n\"}"},"msg_type":104,"retry":30000}

id:45
data: {"code":200,"data":{"msg":"{\"summary_title\":\"\"}"},"msg_type":1,"retry":30000}

id:46
data: {"code":200,"data":{"msg":"{\"summary_title\":\"王阳明\"}"},"msg_type":1,"retry":30000}

id:47
data: {"code":200,"data":{"msg":"{\"summary_title\":\"论\"}"},"msg_type":1,"retry":30000}

id:48
data: {"code":200,"data":{"msg":"{\"summary_title\":\"“\"}"},"msg_type":1,"retry":30000}

id:49
data: {"code":200,"data":{"msg":"{\"summary_title\":\"知行\"}"},"msg_type":1,"retry":30000}

id:50
data: {"code":200,"data":{"msg":"{\"summary_title\":\"合一\"}"},"msg_type":1,"retry":30000}

id:51
data: {"code":200,"data":{"msg":"{\"summary_title\":\"”\"}"},"msg_type":1,"retry":30000}

id:52
data: {"code":200,"data":{"msg":"{\"summary_title\":\"：\"}"},"msg_type":1,"retry":30000}

id:53
data: {"code":200,"data":{"msg":"{\"summary_title\":\"从\"}"},"msg_type":1,"retry":30000}

id:54
data: {"code":200,"data":{"msg":"{\"summary_title\":\"认知\"}"},"msg_type":1,"retry":30000}

id:55
data: {"code":200,"data":{"msg":"{\"summary_title\":\"重构\"}"},"msg_type":1,"retry":30000}

id:56
data: {"code":200,"data":{"msg":"{\"summary_title\":\"到\"}"},"msg_type":1,"retry":30000}

id:57
data: {"code":200,"data":{"msg":"{\"summary_title\":\"行动\"}"},"msg_type":1,"retry":30000}

id:58
data: {"code":200,"data":{"msg":"{\"summary_title\":\"自然\"}"},"msg_type":1,"retry":30000}

id:59
data: {"code":200,"data":{"msg":"{\"summary_title\":\"流露\"}"},"msg_type":1,"retry":30000}

id:60
data: {"code":200,"data":{"msg":"{\"summary_title\":\"的\"}"},"msg_type":1,"retry":30000}

id:61
data: {"code":200,"data":{"msg":"{\"summary_title\":\"哲学\"}"},"msg_type":1,"retry":30000}

id:62
data: {"code":200,"data":{"msg":"{\"summary_title\":\"路径\"}"},"msg_type":1,"retry":30000}

id:63
data: {"code":200,"data":{"msg":"{\"summary_title\":\"\\n\"}"},"msg_type":1,"retry":30000}

id:64
data: {"code":200,"data":{"msg":"{\"summary_title\":\"\"}"},"msg_type":1,"retry":30000}

id:65
data: {"code":200,"data":{"msg":"{\"summary_title\":\"王阳明论“知行合一”：从认知重构到行动自然流露的哲学路径\\n\"}"},"msg_type":104,"retry":30000}

id:66
data: {"code":200,"data":{"msg":"{\"content\":\"\"}"},"msg_type":1,"retry":30000}

id:67
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"### **🧠 谁是“知行合一”的顶级思想权威？**\\n\"}"}}

id:68
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"\\n**\"}"}}

id:69
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"王守\"}"}}

id:70
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"仁\"}"}}

id:71
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:72
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"王阳明\"}"}}

id:73
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:74
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"1472-1529）\"}"}}

id:75
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:76
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:77
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"明代\"}"}}

id:78
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"心\"}"}}

id:79
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"学\"}"}}

id:80
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"集\"}"}}

id:81
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"大成\"}"}}

id:82
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"者\"}"}}

id:83
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:84
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:85
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知行\"}"}}

id:86
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"合一\"}"}}

id:87
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:88
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"理论\"}"}}

id:89
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:90
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"创立\"}"}}

id:91
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"者\"}"}}

id:92
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"。\"}"}}

id:93
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"其\"}"}}

id:94
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"思想\"}"}}

id:95
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"融合\"}"}}

id:96
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"儒\"}"}}

id:97
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"释\"}"}}

id:98
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"道\"}"}}

id:99
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"精髓\"}"}}

id:100
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:101
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"强调\"}"}}

id:102
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:103
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"心\"}"}}

id:104
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"即\"}"}}

id:105
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"理\"}"}}

id:106
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

: ping

id:107
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:108
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"致\"}"}}

id:109
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"良知\"}"}}

id:110
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:111
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:112
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"对\"}"}}

id:113
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"东亚\"}"}}

id:114
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"哲学\"}"}}

id:115
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"影响\"}"}}

id:116
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"深远\"}"}}

id:117
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:118
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"被\"}"}}

id:119
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"视为\"}"}}

id:120
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"理解\"}"}}

id:121
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:122
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知行\"}"}}

id:123
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"关系\"}"}}

id:124
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:125
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:126
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"终极\"}"}}

id:127
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"权威\"}"}}

id:128
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"。\"}"}}

id:129
data: {"code":200,"data":{"msg":"{\"content\":\"\\n\"}"},"msg_type":1,"retry":30000}

id:130
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"\\n### **💡 王阳明对“知行割裂”的诊断**\\n\"}"}}

id:131
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"\\n#### **(一) 对“知而不行”的批判**\\n\"}"}}

id:132
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"- **\"}"}}

id:133
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"核心\"}"}}

id:134
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"观点\"}"}}

id:135
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:136
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"：\"}"}}

id:137
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:138
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知\"}"}}

id:139
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"而\"}"}}

id:140
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"不行\"}"}}

id:141
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:142
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"只是\"}"}}

id:143
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"未知\"}"}}

id:144
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"。\"}"}}

id:145
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:146
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:147
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"《\"}"}}

id:148
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"传\"}"}}

id:149
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"习\"}"}}

id:150
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"录\"}"}}

id:151
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"》\"}"}}

id:152
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:153
data: {"code":200,"data":{"msg":"{\"content\":\"  \\n\"}"},"msg_type":1,"retry":30000}

id:154
data: {"code":200,"data":{"msg":"{\"content\":\"\"}"},"msg_type":1,"retry":30000}

id:155
data: {"code":200,"data":{"msg":"{\"content\":\"\"}"},"msg_type":1,"retry":30000}

id:156
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"  王阳明\"}"}}

id:157
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"认为\"}"}}

id:158
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:159
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"多数\"}"}}

id:160
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"人\"}"}}

id:161
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"所谓\"}"}}

id:162
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:163
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:164
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知\"}"}}

id:165
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:166
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"仅是\"}"}}

id:167
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:168
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"信息\"}"}}

id:169
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"接收\"}"}}

id:170
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:171
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:172
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"如\"}"}}

id:173
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:174
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"早睡\"}"}}

id:175
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"有益\"}"}}

id:176
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:177
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:178
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"读书\"}"}}

id:179
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"重要\"}"}}

id:180
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:181
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:182
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:183
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"而非\"}"}}

id:184
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:185
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"认知\"}"}}

id:186
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"内化\"}"}}

id:187
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:188
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"。\"}"}}

id:189
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"正如\"}"}}

id:190
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"用户\"}"}}

id:191
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"所述\"}"}}

id:192
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:193
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"脑子里\"}"}}

id:194
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"装\"}"}}

id:195
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:196
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"不是\"}"}}

id:197
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"信念\"}"}}

id:198
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:199
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"只是\"}"}}

id:200
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"一段\"}"}}

id:201
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"信息\"}"}}

id:202
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:203
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:204
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"这种\"}"}}

id:205
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:206
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知\"}"}}

id:207
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:208
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"缺乏\"}"}}

id:209
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"情感\"}"}}

id:210
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"认同\"}"}}

id:211
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"与\"}"}}

id:212
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"价值\"}"}}

id:213
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"连接\"}"}}

id:214
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:215
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"故\"}"}}

id:216
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"无法\"}"}}

id:217
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"转化\"}"}}

id:218
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"为\"}"}}

id:219
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"行动\"}"}}

id:220
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"。\"}"}}

id:221
data: {"code":200,"data":{"msg":"{\"content\":\"  \\n\"}"},"msg_type":1,"retry":30000}

id:222
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"\\n- **\"}"}}

id:223
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"经典\"}"}}

id:224
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"类比\"}"}}

id:225
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:226
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"：\"}"}}

id:227
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:228
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"如\"}"}}

id:229
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"好好\"}"}}

id:230
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"色\"}"}}

id:231
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:232
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"如\"}"}}

id:233
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"恶\"}"}}

id:234
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"恶臭\"}"}}

id:235
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:236
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:237
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"《\"}"}}

id:238
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"传\"}"}}

id:239
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"习\"}"}}

id:240
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"录\"}"}}

id:241
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"》\"}"}}

id:242
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:243
data: {"code":200,"data":{"msg":"{\"content\":\"  \\n\"}"},"msg_type":1,"retry":30000}

id:244
data: {"code":200,"data":{"msg":"{\"content\":\"\"}"},"msg_type":1,"retry":30000}

id:245
data: {"code":200,"data":{"msg":"{\"content\":\"\"}"},"msg_type":1,"retry":30000}

id:246
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"  看见\"}"}}

id:247
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"美色\"}"}}

id:248
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"自然\"}"}}

id:249
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"喜欢\"}"}}

id:250
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:251
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知\"}"}}

id:252
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"与\"}"}}

id:253
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"行\"}"}}

id:254
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"同时\"}"}}

id:255
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"发生\"}"}}

id:256
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:257
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:258
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"闻到\"}"}}

id:259
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"恶臭\"}"}}

id:260
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"自然\"}"}}

id:261
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"厌恶\"}"}}

id:262
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:263
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"无需\"}"}}

id:264
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"刻意\"}"}}

id:265
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"克制\"}"}}

id:266
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:267
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"。\"}"}}

id:268
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"真正\"}"}}

id:269
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:270
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:271
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知\"}"}}

id:272
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:273
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"应\"}"}}

id:274
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"如\"}"}}

id:275
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"本能\"}"}}

id:276
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"反应\"}"}}

id:277
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:278
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"而非\"}"}}

id:279
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"理性\"}"}}

id:280
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"层面\"}"}}

id:281
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:282
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:283
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"听说\"}"}}

id:284
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:285
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"或\"}"}}

id:286
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:287
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知道\"}"}}

id:288
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:289
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"。\"}"}}

id:290
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"用户\"}"}}

: ping

id:291
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"提到\"}"}}

id:292
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:293
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"行为\"}"}}

id:294
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"不会\"}"}}

id:295
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"背叛\"}"}}

id:296
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"认知\"}"}}

id:297
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:298
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:299
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"恰\"}"}}

id:300
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"与\"}"}}

id:301
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"王阳明\"}"}}

id:302
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:303
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知行\"}"}}

id:304
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"本\"}"}}

id:305
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"是\"}"}}

id:306
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"一体\"}"}}

id:307
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:308
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:309
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"思想\"}"}}

id:310
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"高度\"}"}}

id:311
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"契合\"}"}}

id:312
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"。\"}"}}

id:313
data: {"code":200,"data":{"msg":"{\"content\":\"\\n\"}"},"msg_type":1,"retry":30000}

id:314
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"\\n#### **(二) “假知”与“真知”的本质区别**\\n\"}"}}

id:315
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"\\n|\"}"}}

id:316
data: {"code":200,"data":{"msg":"{\"content\":\" \"}"},"msg_type":1,"retry":30000}

id:317
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"维度\"}"}}

id:318
data: {"code":200,"data":{"msg":"{\"content\":\"      \"}"},"msg_type":1,"retry":30000}

id:319
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" |\"}"}}

id:320
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" **\"}"}}

id:321
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"假\"}"}}

id:322
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知\"}"}}

id:323
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:324
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"信息\"}"}}

id:325
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"层面\"}"}}

id:326
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:327
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:328
data: {"code":200,"data":{"msg":"{\"content\":\"              \"}"},"msg_type":1,"retry":30000}

id:329
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" |\"}"}}

id:330
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" **\"}"}}

id:331
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"真知\"}"}}

id:332
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:333
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"认知\"}"}}

id:334
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"层面\"}"}}

id:335
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:336
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:337
data: {"code":200,"data":{"msg":"{\"content\":\"              \"}"},"msg_type":1,"retry":30000}

id:338
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" |\"}"}}

id:339
data: {"code":200,"data":{"msg":"{\"content\":\"\\n\"}"},"msg_type":1,"retry":30000}

id:340
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"|\"}"}}

id:341
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"------------|\"}"}}

id:342
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"-----------------------------------|\"}"}}

id:343
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"-----------------------------------|\"}"}}

id:344
data: {"code":200,"data":{"msg":"{\"content\":\"\\n\"}"},"msg_type":1,"retry":30000}

id:345
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"|\"}"}}

id:346
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" **\"}"}}

id:347
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"特征\"}"}}

id:348
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:349
data: {"code":200,"data":{"msg":"{\"content\":\"  \"}"},"msg_type":1,"retry":30000}

id:350
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" |\"}"}}

id:351
data: {"code":200,"data":{"msg":"{\"content\":\" \"}"},"msg_type":1,"retry":30000}

id:352
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"被动\"}"}}

id:353
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"接收\"}"}}

id:354
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:355
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"缺乏\"}"}}

id:356
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"情感\"}"}}

id:357
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"连接\"}"}}

id:358
data: {"code":200,"data":{"msg":"{\"content\":\"           \"}"},"msg_type":1,"retry":30000}

id:359
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" |\"}"}}

id:360
data: {"code":200,"data":{"msg":"{\"content\":\" \"}"},"msg_type":1,"retry":30000}

id:361
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"主动\"}"}}

id:362
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"认同\"}"}}

id:363
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:364
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"形成\"}"}}

id:365
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"信念\"}"}}

id:366
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"系统\"}"}}

id:367
data: {"code":200,"data":{"msg":"{\"content\":\"           \"}"},"msg_type":1,"retry":30000}

id:368
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" |\"}"}}

id:369
data: {"code":200,"data":{"msg":"{\"content\":\"\\n\"}"},"msg_type":1,"retry":30000}

id:370
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"|\"}"}}

id:371
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" **\"}"}}

id:372
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"表现\"}"}}

id:373
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:374
data: {"code":200,"data":{"msg":"{\"content\":\"  \"}"},"msg_type":1,"retry":30000}

id:375
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" |\"}"}}

id:376
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" “\"}"}}

id:377
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"明\"}"}}

id:378
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知道\"}"}}

id:379
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"要\"}"}}

id:380
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"早睡\"}"}}

id:381
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"却\"}"}}

id:382
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"熬夜\"}"}}

id:383
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:384
data: {"code":200,"data":{"msg":"{\"content\":\"             \"}"},"msg_type":1,"retry":30000}

id:385
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" |\"}"}}

id:386
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" “\"}"}}

id:387
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知\"}"}}

id:388
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"好色\"}"}}

id:389
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"则\"}"}}

id:390
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"必\"}"}}

id:391
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"好\"}"}}

id:392
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"之\"}"}}

id:393
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:394
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知\"}"}}

id:395
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"恶臭\"}"}}

id:396
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"则\"}"}}

id:397
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"必\"}"}}

id:398
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"恶\"}"}}

id:399
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"之\"}"}}

id:400
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:401
data: {"code":200,"data":{"msg":"{\"content\":\" \"}"},"msg_type":1,"retry":30000}

id:402
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" |\"}"}}

id:403
data: {"code":200,"data":{"msg":"{\"content\":\"\\n\"}"},"msg_type":1,"retry":30000}

id:404
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"|\"}"}}

id:405
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" **\"}"}}

id:406
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"根源\"}"}}

id:407
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:408
data: {"code":200,"data":{"msg":"{\"content\":\"  \"}"},"msg_type":1,"retry":30000}

id:409
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" |\"}"}}

id:410
data: {"code":200,"data":{"msg":"{\"content\":\" \"}"},"msg_type":1,"retry":30000}

id:411
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"未\"}"}}

id:412
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:413
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"致\"}"}}

id:414
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"良知\"}"}}

id:415
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:416
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:417
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"未\"}"}}

id:418
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"唤醒\"}"}}

id:419
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"内心\"}"}}

id:420
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"本\"}"}}

id:421
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"具\"}"}}

id:422
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:423
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"理\"}"}}

id:424
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:425
data: {"code":200,"data":{"msg":"{\"content\":\" \"}"},"msg_type":1,"retry":30000}

id:426
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" |\"}"}}

id:427
data: {"code":200,"data":{"msg":"{\"content\":\" \"}"},"msg_type":1,"retry":30000}

id:428
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"已\"}"}}

id:429
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:430
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"致\"}"}}

id:431
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"良知\"}"}}

id:432
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:433
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:434
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"内心\"}"}}

id:435
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"与\"}"}}

id:436
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"道理\"}"}}

id:437
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"合一\"}"}}

id:438
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:439
data: {"code":200,"data":{"msg":"{\"content\":\"     \"}"},"msg_type":1,"retry":30000}

id:440
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" |\"}"}}

id:441
data: {"code":200,"data":{"msg":"{\"content\":\"\\n\"}"},"msg_type":1,"retry":30000}

id:442
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"\\n### **🔄 王阳明的“知行合一”实践路径**\\n\"}"}}

id:443
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"\\n#### **(一) 核心方法论：“致良知”**\\n\"}"}}

id:444
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"- **\"}"}}

id:445
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"定义\"}"}}

id:446
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:447
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"：\"}"}}

id:448
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:449
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"良知\"}"}}

id:450
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"者\"}"}}

id:451
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:452
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"心\"}"}}

id:453
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"之\"}"}}

id:454
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"本体\"}"}}

id:455
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"。\"}"}}

id:456
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:457
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:458
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"《\"}"}}

id:459
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"传\"}"}}

id:460
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"习\"}"}}

id:461
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"录\"}"}}

id:462
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"》\"}"}}

id:463
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:464
data: {"code":200,"data":{"msg":"{\"content\":\"  \\n\"}"},"msg_type":1,"retry":30000}

: ping

id:465
data: {"code":200,"data":{"msg":"{\"content\":\"\"}"},"msg_type":1,"retry":30000}

id:466
data: {"code":200,"data":{"msg":"{\"content\":\"\"}"},"msg_type":1,"retry":30000}

id:467
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"  王阳明\"}"}}

id:468
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"认为\"}"}}

id:469
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:470
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"每个人\"}"}}

id:471
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"内心\"}"}}

id:472
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"都\"}"}}

id:473
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"有\"}"}}

id:474
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"判断\"}"}}

id:475
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"是非\"}"}}

id:476
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"善恶\"}"}}

id:477
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:478
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:479
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"良知\"}"}}

id:480
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:481
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:482
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"但\"}"}}

id:483
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"被\"}"}}

id:484
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"私欲\"}"}}

id:485
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"蒙蔽\"}"}}

id:486
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"。\"}"}}

id:487
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:488
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"致\"}"}}

id:489
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"良知\"}"}}

id:490
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:491
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"即\"}"}}

id:492
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"通过\"}"}}

id:493
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:494
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"内\"}"}}

id:495
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"省\"}"}}

id:496
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:497
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:498
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"如\"}"}}

id:499
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"用户\"}"}}

id:500
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"建议\"}"}}

id:501
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:502
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:503
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"重新\"}"}}

id:504
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"建立\"}"}}

id:505
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"认知\"}"}}

id:506
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"链路\"}"}}

id:507
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:508
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:509
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"去除\"}"}}

id:510
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"蒙蔽\"}"}}

id:511
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:512
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"让\"}"}}

id:513
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"良知\"}"}}

id:514
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"自然\"}"}}

id:515
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"显现\"}"}}

id:516
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"。\"}"}}

id:517
data: {"code":200,"data":{"msg":"{\"content\":\"  \\n\"}"},"msg_type":1,"retry":30000}

id:518
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"\\n- **\"}"}}

id:519
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"与\"}"}}

id:520
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"用户\"}"}}

id:521
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"观点\"}"}}

id:522
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:523
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"呼应\"}"}}

id:524
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:525
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"：\"}"}}

id:526
data: {"code":200,"data":{"msg":"{\"content\":\"  \\n\"}"},"msg_type":1,"retry":30000}

id:527
data: {"code":200,"data":{"msg":"{\"content\":\"\"}"},"msg_type":1,"retry":30000}

id:528
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"  用户\"}"}}

id:529
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"提出\"}"}}

id:530
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:531
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"找到\"}"}}

id:532
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"让\"}"}}

id:533
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"你\"}"}}

id:534
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"发自\"}"}}

id:535
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"内心\"}"}}

id:536
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"想\"}"}}

id:537
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"做\"}"}}

id:538
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:539
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"理由\"}"}}

id:540
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:541
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:542
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"本质\"}"}}

id:543
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"上\"}"}}

id:544
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"是\"}"}}

id:545
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"通过\"}"}}

id:546
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"观察\"}"}}

id:547
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"他人\"}"}}

id:548
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"案例\"}"}}

id:549
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:550
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:551
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"靠\"}"}}

id:552
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"读书\"}"}}

id:553
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"翻盘\"}"}}

id:554
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:555
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"人\"}"}}

id:556
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:557
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:558
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"、\"}"}}

id:559
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"想象\"}"}}

id:560
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"自身\"}"}}

id:561
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"改变\"}"}}

id:562
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:563
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:564
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"变成\"}"}}

id:565
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"什么样\"}"}}

id:566
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:567
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:568
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"来\"}"}}

id:569
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"激活\"}"}}

id:570
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"内心\"}"}}

id:571
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"对\"}"}}

id:572
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:573
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"读书\"}"}}

id:574
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"价值\"}"}}

id:575
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:576
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:577
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"认同\"}"}}

id:578
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:579
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"这\"}"}}

id:580
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"与\"}"}}

id:581
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"王阳明\"}"}}

id:582
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:583
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"事\"}"}}

id:584
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"上\"}"}}

id:585
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"磨炼\"}"}}

id:586
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:587
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:588
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"在\"}"}}

id:589
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"具体\"}"}}

id:590
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"事务\"}"}}

id:591
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"中\"}"}}

id:592
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"体\"}"}}

id:593
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"认\"}"}}

id:594
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"良知\"}"}}

id:595
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:596
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:597
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"实践\"}"}}

id:598
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"方法\"}"}}

id:599
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"一致\"}"}}

id:600
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"。\"}"}}

id:601
data: {"code":200,"data":{"msg":"{\"content\":\"\\n\"}"},"msg_type":1,"retry":30000}

id:602
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"\\n#### **(二) 从“认知重构”到“行动自然”**\\n\"}"}}

id:603
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"1.\"}"}}

id:604
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" **\"}"}}

id:605
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"破\"}"}}

id:606
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:607
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知行\"}"}}

id:608
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"割裂\"}"}}

id:609
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:610
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:611
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"迷\"}"}}

id:612
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"思\"}"}}

id:613
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:614
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"：\"}"}}

id:615
data: {"code":200,"data":{"msg":"{\"content\":\"  \\n\"}"},"msg_type":1,"retry":30000}

id:616
data: {"code":200,"data":{"msg":"{\"content\":\"\"}"},"msg_type":1,"retry":30000}

id:617
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"   “\"}"}}

id:618
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"今人\"}"}}

id:619
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"却\"}"}}

id:620
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"就\"}"}}

id:621
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"将\"}"}}

id:622
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知行\"}"}}

id:623
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"分\"}"}}

id:624
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"作\"}"}}

id:625
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"两件\"}"}}

id:626
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"去\"}"}}

id:627
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"做\"}"}}

id:628
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:629
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"以为\"}"}}

id:630
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"必\"}"}}

id:631
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"先知\"}"}}

id:632
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"了\"}"}}

id:633
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:634
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"然后\"}"}}

id:635
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"能\"}"}}

id:636
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"行\"}"}}

id:637
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"。\"}"}}

id:638
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:639
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:640
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"《\"}"}}

id:641
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"传\"}"}}

id:642
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"习\"}"}}

id:643
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"录\"}"}}

id:644
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"》\"}"}}

id:645
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:646
data: {"code":200,"data":{"msg":"{\"content\":\"  \\n\"}"},"msg_type":1,"retry":30000}

id:647
data: {"code":200,"data":{"msg":"{\"content\":\"\"}"},"msg_type":1,"retry":30000}

id:648
data: {"code":200,"data":{"msg":"{\"content\":\"\"}"},"msg_type":1,"retry":30000}

id:649
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"   王阳明\"}"}}

id:650
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"反对\"}"}}

id:651
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:652
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"先\"}"}}

id:653
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"学\"}"}}

id:654
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"理论\"}"}}

id:655
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"再\"}"}}

id:656
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"实践\"}"}}

id:657
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:658
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:659
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"割裂\"}"}}

id:660
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"模式\"}"}}

id:661
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:662
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"强调\"}"}}

: ping

id:663
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:664
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知\"}"}}

id:665
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"是\"}"}}

id:666
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"行\"}"}}

id:667
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:668
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"主意\"}"}}

id:669
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:670
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"行\"}"}}

id:671
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"是\"}"}}

id:672
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知\"}"}}

id:673
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:674
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"功夫\"}"}}

id:675
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"；\"}"}}

id:676
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知\"}"}}

id:677
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"是\"}"}}

id:678
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"行\"}"}}

id:679
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"之\"}"}}

id:680
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"始\"}"}}

id:681
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:682
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"行\"}"}}

id:683
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"是\"}"}}

id:684
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知\"}"}}

id:685
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"之\"}"}}

id:686
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"成\"}"}}

id:687
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"。\"}"}}

id:688
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:689
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:690
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"《\"}"}}

id:691
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"传\"}"}}

id:692
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"习\"}"}}

id:693
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"录\"}"}}

id:694
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"》\"}"}}

id:695
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:696
data: {"code":200,"data":{"msg":"{\"content\":\"  \\n\"}"},"msg_type":1,"retry":30000}

id:697
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"\\n2.\"}"}}

id:698
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\" **\"}"}}

id:699
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"通过\"}"}}

id:700
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:701
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"行\"}"}}

id:702
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:703
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"深化\"}"}}

id:704
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:705
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知\"}"}}

id:706
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:707
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:708
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"：\"}"}}

id:709
data: {"code":200,"data":{"msg":"{\"content\":\"  \\n\"}"},"msg_type":1,"retry":30000}

id:710
data: {"code":200,"data":{"msg":"{\"content\":\"\"}"},"msg_type":1,"retry":30000}

id:711
data: {"code":200,"data":{"msg":"{\"content\":\"\"}"},"msg_type":1,"retry":30000}

id:712
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"   若\"}"}}

id:713
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"想\"}"}}

id:714
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"真正\"}"}}

id:715
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:716
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知\"}"}}

id:717
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"读书\"}"}}

id:718
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"重要\"}"}}

id:719
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:720
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:721
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"需\"}"}}

id:722
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"先\"}"}}

id:723
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:724
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"尝试\"}"}}

id:725
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"读书\"}"}}

id:726
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:727
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:728
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"行\"}"}}

id:729
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:730
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:731
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"在\"}"}}

id:732
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"阅读\"}"}}

id:733
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"中\"}"}}

id:734
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"体会\"}"}}

id:735
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"思维\"}"}}

id:736
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"提升\"}"}}

id:737
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"、\"}"}}

id:738
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"视野\"}"}}

id:739
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"拓展\"}"}}

id:740
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:741
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知\"}"}}

id:742
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:743
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:744
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"进而\"}"}}

id:745
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"强化\"}"}}

id:746
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:747
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"读书\"}"}}

id:748
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"有用\"}"}}

id:749
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:750
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:751
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"信念\"}"}}

id:752
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"。\"}"}}

id:753
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"正如\"}"}}

id:754
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"用户\"}"}}

id:755
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"所言\"}"}}

id:756
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"：\"}"}}

id:757
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:758
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"只有\"}"}}

id:759
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"当\"}"}}

id:760
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"你\"}"}}

id:761
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"真\"}"}}

id:762
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"信\"}"}}

id:763
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"他\"}"}}

id:764
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"有用\"}"}}

id:765
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:766
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"你\"}"}}

id:767
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"才\"}"}}

id:768
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"会\"}"}}

id:769
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"真\"}"}}

id:770
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:771
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"去\"}"}}

id:772
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"做\"}"}}

id:773
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"。\"}"}}

id:774
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:775
data: {"code":200,"data":{"msg":"{\"content\":\"\\n\"}"},"msg_type":1,"retry":30000}

id:776
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"\\n### **📝 补充细节：王阳明对“自律”与“意志力”的超越**\\n\"}"}}

id:777
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"- **\"}"}}

id:778
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"反对\"}"}}

id:779
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:780
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"强迫\"}"}}

id:781
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"式\"}"}}

id:782
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"自律\"}"}}

id:783
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:784
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:785
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"：\"}"}}

id:786
data: {"code":200,"data":{"msg":"{\"content\":\"  \\n\"}"},"msg_type":1,"retry":30000}

id:787
data: {"code":200,"data":{"msg":"{\"content\":\"\"}"},"msg_type":1,"retry":30000}

id:788
data: {"code":200,"data":{"msg":"{\"content\":\"\"}"},"msg_type":1,"retry":30000}

id:789
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"  王阳明\"}"}}

id:790
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"认为\"}"}}

id:791
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:792
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"依赖\"}"}}

id:793
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"意志力\"}"}}

id:794
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"强迫\"}"}}

id:795
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"行动\"}"}}

id:796
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"是\"}"}}

id:797
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:798
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"外\"}"}}

id:799
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"求\"}"}}

id:800
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:801
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:802
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"而非\"}"}}

id:803
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:804
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"内\"}"}}

id:805
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"求\"}"}}

id:806
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"良知\"}"}}

id:807
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:808
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"。\"}"}}

id:809
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"真正\"}"}}

id:810
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:811
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"行动\"}"}}

id:812
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"应\"}"}}

id:813
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"如\"}"}}

id:814
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:815
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"心\"}"}}

id:816
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"若\"}"}}

id:817
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"明镜\"}"}}

id:818
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:819
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"形如\"}"}}

id:820
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"影\"}"}}

id:821
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"随\"}"}}

id:822
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:823
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:824
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"用户\"}"}}

id:825
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"语\"}"}}

id:826
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:827
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:828
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"是\"}"}}

id:829
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"内心\"}"}}

id:830
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"信念\"}"}}

id:831
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:832
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"自然\"}"}}

id:833
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"流露\"}"}}

id:834
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:835
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"而非\"}"}}

id:836
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"刻意\"}"}}

id:837
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"坚持\"}"}}

id:838
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"。\"}"}}

id:839
data: {"code":200,"data":{"msg":"{\"content\":\"  \\n\"}"},"msg_type":1,"retry":30000}

id:840
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"\\n- **\"}"}}

id:841
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"与\"}"}}

id:842
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"现代\"}"}}

id:843
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"心理学\"}"}}

id:844
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"的\"}"}}

id:845
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"印证\"}"}}

id:846
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"**\"}"}}

id:847
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"：\"}"}}

id:848
data: {"code":200,"data":{"msg":"{\"content\":\"  \\n\"}"},"msg_type":1,"retry":30000}

id:849
data: {"code":200,"data":{"msg":"{\"content\":\"\"}"},"msg_type":1,"retry":30000}

id:850
data: {"code":200,"data":{"msg":"{\"content\":\"\"}"},"msg_type":1,"retry":30000}

id:851
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"  其\"}"}}

id:852
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:853
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"知行\"}"}}

id:854
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"合一\"}"}}

id:855
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:856
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"思想\"}"}}

id:857
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"与\"}"}}

id:858
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"当代\"}"}}

id:859
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"认知\"}"}}

id:860
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"行为\"}"}}

id:861
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"理论\"}"}}

id:862
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:863
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"C\"}"}}

id:864
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"BT\"}"}}

id:865
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:866
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"中的\"}"}}

: ping

id:867
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"“\"}"}}

id:868
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"认知\"}"}}

id:869
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"重构\"}"}}

id:870
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"”\"}"}}

id:871
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"高度\"}"}}

id:872
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"契合\"}"}}

id:873
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"，\"}"}}

id:874
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"均\"}"}}

id:875
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"强调\"}"}}

id:876
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"通过\"}"}}

id:877
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"改变\"}"}}

id:878
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"核心\"}"}}

id:879
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"信念\"}"}}

id:880
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"（\"}"}}

id:881
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"而非\"}"}}

id:882
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"单纯\"}"}}

id:883
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"行为\"}"}}

id:884
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"矫正\"}"}}

id:885
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"）\"}"}}

id:886
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"实现\"}"}}

id:887
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"持久\"}"}}

id:888
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"改变\"}"}}

id:889
data: {"code":200,"retry":30000,"msg_type":1,"data":{"msg":"{\"content\":\"。\"}"}}

id:890
data: {"code":200,"data":{"msg":"{\"content\":\"\\n\"}"},"msg_type":1,"retry":30000}

id:891
data: {"code":200,"data":{"msg":"{\"content\":\"\"}"},"msg_type":1,"retry":30000}

id:892
data: {"code":200,"retry":30000,"msg_type":104,"data":{"msg":"{\"content\":\"### **🧠 谁是“知行合一”的顶级思想权威？**\\n\\n**王守仁（王阳明，1472-1529）**，明代心学集大成者，“知行合一”理论的创立者。其思想融合儒释道精髓，强调“心即理”“致良知”，对东亚哲学影响深远，被视为理解“知行关系”的终极权威。\\n\\n### **💡 王阳明对“知行割裂”的诊断**\\n\\n#### **(一) 对“知而不行”的批判**\\n- **核心观点**：“知而不行，只是未知。”（《传习录》）  \\n  王阳明认为，多数人所谓的“知”仅是**信息接收**（如“早睡有益”“读书重要”），而非**认知内化**。正如用户所述“脑子里装的不是信念，只是一段信息”，这种“知”缺乏情感认同与价值连接，故无法转化为行动。  \\n\\n- **经典类比**：“如好好色，如恶恶臭”（《传习录》）  \\n  看见美色自然喜欢（知与行同时发生），闻到恶臭自然厌恶（无需刻意克制）。真正的“知”应如本能反应，而非理性层面的“听说”或“知道”。用户提到“行为不会背叛认知”，恰与王阳明“知行本是一体”的思想高度契合。\\n\\n#### **(二) “假知”与“真知”的本质区别**\\n\\n| 维度       | **假知（信息层面）**               | **真知（认知层面）**               |\\n|------------|-----------------------------------|-----------------------------------|\\n| **特征**   | 被动接收，缺乏情感连接            | 主动认同，形成信念系统            |\\n| **表现**   | “明知道要早睡却熬夜”              | “知好色则必好之，知恶臭则必恶之”  |\\n| **根源**   | 未“致良知”（未唤醒内心本具的理）  | 已“致良知”（内心与道理合一）      |\\n\\n### **🔄 王阳明的“知行合一”实践路径**\\n\\n#### **(一) 核心方法论：“致良知”**\\n- **定义**：“良知者，心之本体。”（《传习录》）  \\n  王阳明认为，每个人内心都有判断是非善恶的“良知”，但被私欲蒙蔽。“致良知”即通过**内省**（如用户建议的“重新建立认知链路”）去除蒙蔽，让良知自然显现。  \\n\\n- **与用户观点的呼应**：  \\n  用户提出“找到让你发自内心想做的理由”，本质上是通过观察他人案例（“靠读书翻盘的人”）、想象自身改变（“变成什么样”）来激活内心对“读书价值”的认同，这与王阳明“事上磨炼”（在具体事务中体认良知）的实践方法一致。\\n\\n#### **(二) 从“认知重构”到“行动自然”**\\n1. **破“知行割裂”的迷思**：  \\n   “今人却就将知行分作两件去做，以为必先知了，然后能行。”（《传习录》）  \\n   王阳明反对“先学理论再实践”的割裂模式，强调“知是行的主意，行是知的功夫；知是行之始，行是知之成。”（《传习录》）  \\n\\n2. **通过“行”深化“知”**：  \\n   若想真正“知读书重要”，需先“尝试读书”（行），在阅读中体会思维提升、视野拓展（知），进而强化“读书有用”的信念。正如用户所言：“只有当你真信他有用，你才会真的去做。”\\n\\n### **📝 补充细节：王阳明对“自律”与“意志力”的超越**\\n- **反对“强迫式自律”**：  \\n  王阳明认为，依赖意志力强迫行动是“外求”，而非“内求良知”。真正的行动应如“心若明镜，形如影随”（用户语），是内心信念的自然流露，而非刻意坚持。  \\n\\n- **与现代心理学的印证**：  \\n  其“知行合一”思想与当代认知行为理论（CBT）中的“认知重构”高度契合，均强调通过改变核心信念（而非单纯行为矫正）实现持久改变。\\n\"}"}}

id:893
data: {"code":200,"data":{"msg":"{\"tags\":[\"王阳明\"]}"},"msg_type":1,"retry":30000}

id:894
data: {"code":200,"data":{"msg":"{\"tags\":[\"知行合一\"]}"},"msg_type":1,"retry":30000}

id:895
data: {"code":200,"data":{"msg":"{\"tags\":[\"心学\"]}"},"msg_type":1,"retry":30000}

id:896
data: {"code":200,"data":{"msg":"stop"},"msg_type":101,"retry":30000}

id:897
data: {"code":200,"retry":30000,"msg_type":104,"data":{"msg":"{\"tags\":[\"王阳明\",\"知行合一\",\"心学\"]}"}}

id:898
data: {"code":200,"retry":60000,"msg_type":-2,"data":{"msg":"{\"topics\":[],\"book_topics\":[],\"post\":{\"follow_id\":0},\"id\":\"1900799539548426344\",\"note_id\":\"1900799539548426344\",\"source\":\"web\",\"entry_type\":\"ai\",\"note_type\":\"link\",\"title\":\"王阳明论“知行合一”：从认知重构到行动自然流露的哲学路径\",\"json_content\":\"\",\"content\":\"### **🧠 谁是“知行合一”的顶级思想权威？**\\n\\n**王守仁（王阳明，1472-1529）**，明代心学集大成者，“知行合一”理论的创立者。其思想融合儒释道精髓，强调“心即理”“致良知”，对东亚哲学影响深远，被视为理解“知行关系”的终极权威。\\n\\n### **💡 王阳明对“知行割裂”的诊断**\\n\\n#### **(一) 对“知而不行”的批判**\\n- **核心观点**：“知而不行，只是未知。”（《传习录》）  \\n  王阳明认为，多数人所谓的“知”仅是**信息接收**（如“早睡有益”“读书重要”），而非**认知内化**。正如用户所述“脑子里装的不是信念，只是一段信息”，这种“知”缺乏情感认同与价值连接，故无法转化为行动。  \\n\\n- **经典类比**：“如好好色，如恶恶臭”（《传习录》）  \\n  看见美色自然喜欢（知与行同时发生），闻到恶臭自然厌恶（无需刻意克制）。真正的“知”应如本能反应，而非理性层面的“听说”或“知道”。用户提到“行为不会背叛认知”，恰与王阳明“知行本是一体”的思想高度契合。\\n\\n#### **(二) “假知”与“真知”的本质区别**\\n\\n| 维度       | **假知（信息层面）**               | **真知（认知层面）**               |\\n|------------|-----------------------------------|-----------------------------------|\\n| **特征**   | 被动接收，缺乏情感连接            | 主动认同，形成信念系统            |\\n| **表现**   | “明知道要早睡却熬夜”              | “知好色则必好之，知恶臭则必恶之”  |\\n| **根源**   | 未“致良知”（未唤醒内心本具的理）  | 已“致良知”（内心与道理合一）      |\\n\\n### **🔄 王阳明的“知行合一”实践路径**\\n\\n#### **(一) 核心方法论：“致良知”**\\n- **定义**：“良知者，心之本体。”（《传习录》）  \\n  王阳明认为，每个人内心都有判断是非善恶的“良知”，但被私欲蒙蔽。“致良知”即通过**内省**（如用户建议的“重新建立认知链路”）去除蒙蔽，让良知自然显现。  \\n\\n- **与用户观点的呼应**：  \\n  用户提出“找到让你发自内心想做的理由”，本质上是通过观察他人案例（“靠读书翻盘的人”）、想象自身改变（“变成什么样”）来激活内心对“读书价值”的认同，这与王阳明“事上磨炼”（在具体事务中体认良知）的实践方法一致。\\n\\n#### **(二) 从“认知重构”到“行动自然”**\\n1. **破“知行割裂”的迷思**：  \\n   “今人却就将知行分作两件去做，以为必先知了，然后能行。”（《传习录》）  \\n   王阳明反对“先学理论再实践”的割裂模式，强调“知是行的主意，行是知的功夫；知是行之始，行是知之成。”（《传习录》）  \\n\\n2. **通过“行”深化“知”**：  \\n   若想真正“知读书重要”，需先“尝试读书”（行），在阅读中体会思维提升、视野拓展（知），进而强化“读书有用”的信念。正如用户所言：“只有当你真信他有用，你才会真的去做。”\\n\\n### **📝 补充细节：王阳明对“自律”与“意志力”的超越**\\n- **反对“强迫式自律”**：  \\n  王阳明认为，依赖意志力强迫行动是“外求”，而非“内求良知”。真正的行动应如“心若明镜，形如影随”（用户语），是内心信念的自然流露，而非刻意坚持。  \\n\\n- **与现代心理学的印证**：  \\n  其“知行合一”思想与当代认知行为理论（CBT）中的“认知重构”高度契合，均强调通过改变核心信念（而非单纯行为矫正）实现持久改变。\",\"body_text\":\"王守仁（王阳明，1472-1529），明代心学集大成者，“知行合一”理论的创立者。其思想融合儒释道精髓，强调“心即理”“致良知”，对东亚哲学影响深远，被视为理解“知行关系”的终极权威。\\u003cbr\\u003e核心观点：“知而不行，只是未知。”（《传习录》）王阳明认为，多数人所谓的“知”仅是信息接收（如“早睡有益”“读书重要”），而非认知内化。正如用户所述“脑子里装的不是信念，只是一段信息”，这种“知”缺乏情感认同与价值连接，故无法转化为行动。\\u003cbr\\u003e经典类比：“如好好色，如恶恶臭”（《传习录》）看见美色自然喜欢（知与行同时发生），闻到恶臭自然厌恶（无需刻意克制）。真正的“知”应如本能反应，而非理性层面的...\",\"ref_content\":\"\",\"res_info\":{\"title\":\"\",\"url\":\"\",\"ptype\":0,\"ptype_cn_name\":\"\"},\"tags\":[],\"is_ai_generated\":true,\"date_str\":\"\",\"attachments\":[{\"type\":\"link\",\"url\":\"https://www.douyin.com/video/7534706512447491354\",\"size\":100,\"title\":\"怎样才能做到知行合一？ #个人成长 #深度思考 #知行合一 #认知提升\",\"sub_title\":\"\",\"duration\":0,\"favicon\":\"https://get-notes.umiwi.com/site-favicon%2Fabd8e29881cf02896e71545e39960b01?Expires=1772800648\\u0026OSSAccessKeyId=LTAI5t7toTp72R3TvdXf9QdK\\u0026Signature=SXOu7Xr5OU5f%2BZs1m%2BLns7nSne0%3D\"}],\"relevant_questions\":[],\"audio_state\":0,\"status\":0,\"display_status\":0,\"share_scope\":0,\"share_exclude_audio\":false,\"share_id\":\"6gRYNWjbM2R9v\",\"is_child_note\":false,\"parent_id\":\"\",\"small_images\":[],\"original_images\":[],\"has_ai_processed\":true,\"ai_error_type\":\"\",\"ai_error_reason\":\"\",\"edit_time\":\"2026-02-05 10:12:01\",\"created_at\":\"2026-02-05 10:12:01\",\"updated_at\":\"2026-02-05 10:12:01\",\"version\":1,\"event_status\":0,\"is_author\":true,\"is_in_topic\":false,\"is_in_book_topic\":false,\"can_append_note\":false,\"hide_source_entrance\":false,\"book\":{\"can_read_online\":false,\"chapter_name\":\"\",\"jump_url\":\"\"}}"}}
id:899
data: {"code":200,"data":{"msg":"[END]"},"msg_type":3,"retry":30000}

... <truncated>
````
