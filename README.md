# 广智新 PC 预览版

本版根据 Figma「规范 / PC端」的 1920×1080 画板调整。
设计文件：https://www.figma.com/design/4SpQ3M9aVhfppMq5jyFlNq?node-id=0-1

## 本机预览

当前运行地址：http://127.0.0.1:5196/

本机服务使用 dist 目录。修改代码后需重新构建并刷新页面：

```sh
npm install
npm run build
npm run preview -- --host 127.0.0.1 --port 5196 --strictPort
```

也可在 dist 目录运行 `python3 -m http.server 5196 --bind 127.0.0.1`。

## 页面入口

- 工作台默认显示 AI 首页，右侧「常用」切换到业务工作台。
- 左侧打开智能体/技能、知识库；点击知识库卡片进入文件列表。
- 顶部「广新门户」进入资讯页，右侧「数据」切换经营数据页。
- 工作台「统一待办 → 更多」进入待办列表。
- 点击历史会话进入 AI 对话，工具栏下载图标打开文档预览。
- Ctrl/Cmd + K 打开全局搜索，Escape 关闭搜索或预览。

## 本版范围

已调整顶部导航、侧栏、AI 首页与对话、业务工作台、资讯门户、数据门户、待办、智能体与技能、知识库各状态、搜索与文件预览。设计中的原始图片和图标保存在 public/assets/figma；本地阿里巴巴普惠体 Regular 已单独注册并修正旧版字体表的浏览器兼容性，避免误用同名字体的 Heavy 字重；字形保持不变。处理脚本位于 scripts/prepare-webfont.py。

Figma PC端未提供独立的 IM、云盘、数字员工页面画板。IM 和通讯录已按用户补充的两张截图重新调整；云盘、数字员工仍保留已有结构，仅统一公共样式。此项目仍为前端交互原型，AI回答、报表、文件正文和业务数据为演示内容，未接入真实业务服务。IM 头像已保存为本地素材。

## 验证

TypeScript 类型检查、Vite 构建通过。已检查 1920×1080 与 1440×900 布局，以及页面切换、智能体搜索、知识库文件预览/全屏、搜索快捷键、日历切换和待办筛选。

## 第二轮细节校正

按 PC 设计坐标校正数据门户的左右边距；恢复地图独立数值标签、图例与缩放按钮，缩放时标签随地图移动。校正指标分布、图表线宽与投资表格行高。顶部设置和帮助菜单使用 Figma 原始图标，支持点击外部、Escape 收起。知识库恢复团队图标、书本圆角、日期区间控件，并支持按创建日期筛选；智能体分类按钮和页签间距统一。

已复查 1920×1080、1440×900 下的上述页面，验证菜单关闭、地图缩放、日期筛选和原有页面切换。

## 第三轮：首页截图细节校正

按用户提供的首页效果图校正红色品牌字、标题字重、背景色位置、卡片间距与箭头、问答胶囊标签、历史记录行距，以及底部输入栏的原始线性图标和控件间距。右侧 AI 头像使用原始素材并做圆形裁切。

1920×1080 同状态截图及局部对照见 output/playwright/home-compare-v3.png、home-details-v3.png；1440×900 响应式检查见 home-v3-1440.png。详细验收记录见 design-qa.md。预览依旧使用本地 5196 端口。


## 第四轮：通讯录与 IM

- 通讯录直达：http://127.0.0.1:5196/?view=im&section=contacts&v=im-v4
- IM 直达：http://127.0.0.1:5196/?view=im&v=im-v4

按两张 1920×1080 效果图恢复居中 1660px 主面板、300px 会话栏、398px 群详情栏、64px 组织/会话列表行、六列成员头像和独立浮动切换入口。保留 1440px 的宽度适配。

已验证组织和会话搜索、组织进入/返回、最近联系人和群组切换、联系人发起会话、会话消息隔离、成员搜索/添加、发送文字、聊天记录检索、置顶/免打扰及群详情展开/收起。会话状态仅保留在当前页面会话中。文件选择仅演示文件名消息，不上传文件；语音和群二维码尚未接入真实服务。组织下的联系人仍为演示数据。

截图和局部对照位于 output/playwright/im-compare-v4.png、contacts-compare-v4.png；验收记录见 design-qa.md。


## 第五轮：历史记录弹窗

工作台左侧「历史记录 → 更多」以及折叠侧栏的历史记录按钮可打开弹窗。内容参考用户截图，样式沿用现有系统的阿里巴巴普惠体、16px 圆角、橙红色选中态与浅灰背景。

支持搜索、全部/消息/对话/云盘分类、快速新建对话、记录置顶、空结果状态、Enter 打开首个匹配结果，以及 Esc/关闭按钮/遮罩关闭；关闭后焦点返回入口。对话记录进入 AI 会话，云盘记录打开演示文件预览，消息记录进入 IM。历史标题、分类、时间及内容均为演示数据，不读取真实账号历史。

预览：http://127.0.0.1:5196/?v=history-v5 。截图见 output/playwright/history-v5.png 和 history-v5-1440.png。


## 第六轮：工作台应用管理

预览：http://127.0.0.1:5196/?view=dashboard&v=apps-v6

「常用功能 → 更多」和「系统导航 → 更多」分别打开应用/系统管理弹窗。已选项支持移除、拖动排序、方向按钮及 Alt+左右方向键排序；下方分类提供生活服务、办公必备、出行出差、人事服务和智能办公等应用，以及独立的系统目录。支持搜索、添加、空列表状态、取消、保存和 Esc/遮罩关闭。

保存才会更新工作台；取消、关闭或 Esc 不提交草稿。配置存放于当前浏览器 localStorage 的 guangxin.workbench.apps.v1，常用功能与系统导航分别存储，刷新后保留。原有卡片默认配置保持一致。应用目录为演示数据，新增业务应用仍沿用已有前端演示入口，不提供真实第三方系统接入。

同时包含智能体/技能卡片图标及创建加号的白色修正。


## 第七轮：应用浏览与管理状态

当前预览：http://127.0.0.1:5196/?view=dashboard&v=apps-v7

两个更多弹窗默认进入浏览模式：我的应用/我的系统及完整分类目录可直接打开对应的演示入口，不显示增删、拖动和保存控件。点击「管理」才进入编辑状态；保存提交修改并回到浏览模式，取消或第一次 Esc 放弃草稿并回到浏览模式，浏览模式下 Esc 关闭弹窗。关闭按钮或遮罩直接关闭，未保存修改不会提交。

已移除应用管理的搜索框、顶部拖动提示、外侧灰色留白和区块间距；区块改为白底细线分隔。此版本取代第六轮默认可编辑及应用搜索的交互。

## 工作台细节还原 v8

入口：http://127.0.0.1:5196/?view=dashboard&v=workbench-v8

按用户最新 PC 截图重排左侧三段简报、四条统一待办、顶部提醒卡、常用功能、系统导航、邮箱和日程；工作台主内容在 1920×1080 下为 x130/y100/w1660/h960。新增独立素材位于 public/assets/workbench，样式位于 src/components/workbench-dashboard.css。保留应用管理默认只读、点击管理后编辑的功能。

日历采用真实公历日期，2025 年 11 月显示六行日期；源截图日期与月份不一致，未复制错误排列。简报仍为演示文案。已通过类型检查、构建、1920/1440 浏览器截图及交互核验。详见 design-qa.md。

## 历史记录智能体图标 v9

历史记录列表复用智能体页面的 Figma 图标与渐变色，16 条示例会话覆盖智能问答、智能写作、智能数据、法智小新、智能摘要、财务共享、AI+员工服务。图标与 agentId 固定对应，搜索和置顶不改变图标。支持按会话标题或智能体名称搜索。消息、对话、云盘分类及原有打开行为保留。

## 工作台原始矢量图标 v10

从 Figma「PC端 / 工作台1」（71:2817）只读导出 22 个原始 SVG 图层，替换顶部四张提醒卡、10 个常用应用及 8 个系统导航图标。渲染为内联 SVG DOM，无 img 标签或嵌入位图，路径和渐变均保留 Figma 原始值；同一应用在管理弹窗中复用相同图标。每个实例使用独立渐变/蒙版 ID。来源节点记录在 src/assets/workbench-vectors/provenance.json。

预览：http://127.0.0.1:5196/?view=dashboard&v=figma-vectors-v10

## 字体优先级 v11

全站统一为："Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif。覆盖页面、按钮、输入框及数字/字体工具类，旧版自定义字体优先规则已移除。构建通过，浏览器确认 IM、工作台、AI 首页采用同一字体顺序，无横向溢出或页面异常。

## AI 首页字体与间距 v12

预览：http://127.0.0.1:5196/?v=home-spacing-v12

根据最新截图调整左侧导航与历史记录的文字颜色、行距，以及 AI 首页标题、卡片说明、问答标签及双列列表的字号、颜色和间距。保留用户指定字体顺序。样式集中于 src/components/ai-home-refinement.css。

## Workbench v13

Preview: http://127.0.0.1:5196/?view=dashboard&v=workbench-v13

Updated to the latest workbench screenshot. Removed all four reminder cards. Main region: y103, height858; tasks448; app panels214 each; mail/calendar390; brief cards126/240/148. Updated typography, spacing and colors. Added working task tabs with keyboard navigation. Existing application preferences and original SVG icons remain supported.

## Portal refinement v14

Data: http://127.0.0.1:5196/?view=portal&section=data&v=portal-v14

News: http://127.0.0.1:5196/?view=portal&section=news&v=portal-v14

Both pages now follow the supplied PC references: card heights, text hierarchy, spacing, charts, project stage badges, map colors, news cards and service reminders. The existing font stack remains unchanged. News search/categories/carousels/details and reminder actions work with local demonstration content. Portal links open the requested page directly. Original photographs and map geometry are retained.


## PC workspace refinement v15

Six desktop reference states refined on 2026-11-04: agents, skills, team / organization knowledge bases, knowledge files and todos. Typography uses the requested Helvetica Neue-first stack. Existing dashboard, portal and IM routes remain available.

Preview on the running local server:
- Agents: http://127.0.0.1:5196/?view=agents&v=workspace-v15
- Skills: http://127.0.0.1:5196/?view=skills&v=workspace-v15
- Team knowledge: http://127.0.0.1:5196/?view=knowledge&v=workspace-v15
- Organization knowledge: http://127.0.0.1:5196/?view=knowledge&section=org&v=workspace-v15
- Knowledge files: http://127.0.0.1:5196/?view=knowledge&section=files&v=workspace-v15
- Todos: http://127.0.0.1:5196/?view=todos&v=workspace-v15

Local filters, tree navigation, file selections / preview and todo tabs operate against sample data. See design-qa.md and output/playwright for visual and interaction verification.


## Voice input v16 (2026-11-05)
AI composer microphone now opens the approved voice layout. Browser SpeechRecognition/webkitSpeechRecognition provides Chinese interim/final transcription; no canned speech text is used. Cancel/Escape preserves the original draft; arrow stops recognition, waits for final results (bounded 1.2-second fallback), then submits to the existing chat flow. Empty sends are disabled. Errors and unsupported browsers allow keyboard input; retry retains recognized text. Navigation/unmount aborts recognition. Waveform indicates listening/speech activity, not measured volume.

Preview: http://127.0.0.1:5196/?v=voice-v16
TypeScript/build and browser tests with a controlled recognition stub passed. Live microphone accuracy/network service availability have not been verified; speech support depends on the browser. Reference: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition .

## Agent composer, history and cloud drive (v18–v20, 2026-11-05)
- AI composer: `http://127.0.0.1:5196/?v=agent-history-v20`. Select an agent to show its removable label and tools; writing/summary offer PPT templates with category filters, preview and prompt insertion.
- History: nine agent categories, 20px icons and a text “清空” search control.
- Cloud: `http://127.0.0.1:5196/?view=drive&v=cloud-v20`. Directory navigation, create/rename, type/search filters, upload, preview, download, file sending to local IM, single/batch deletion.
- Files and sent cloud messages persist in browser IndexedDB (`guangxin-cloud-drive`) for the same origin. No remote storage or external messaging service is connected. Uploaded files are downloaded byte-for-byte. Seed documents contain labeled sample text; unsupported preview formats can be downloaded.
- Visual evidence and interaction validation are recorded in design-qa.md.

## AI 今日简报与周年祝福（v28，2026-11-05）
- 入口：`http://127.0.0.1:5196/?view=dashboard&v=brief-v28`。六个简报板块使用提供的示例内容，保留系统字体、卡片、按钮；左栏独立滚动。日期与信息截止时间对应这份示例简报，并非实时业务数据。
- 员工关怀插图裁取自用户提供的第一张参考图，未使用整页截图作为界面。
- “AI 帮写感谢”打开原系统风格的祝福弹窗：五种语气、每种两条预设文案、编辑、表情、200 字限制、空内容禁用、关闭及焦点恢复。尚未接入在线生成服务。
- 点击“发送IM祝福”将编辑后的内容写入陈晓晓的本地 IM 会话并跳转；聊天记录存储在同源 localStorage，不发送到外部通讯服务。
- TypeScript、构建以及浏览器交互检查通过；截图位于 `output/playwright/brief*-v28.png`。


## 示例问答与在线发布（2026-11-06）

- 最近记录、热门问答、常用问题各 10 条，回答数据维护在 `src/data/conversationExamples.ts`。
- 左侧历史记录与最近记录共用题目；回答复制、预览和文本下载使用同一份内容。
- 本项目为前端交互预览：问答为预设示例，业务表单、IM 与文件操作未连接企业正式服务。
- GitHub Pages 使用 `.github/workflows/deploy.yml`：推送 main 后自动检查并发布。
- `DEPLOY_BASE=/guangzhixin/ npm run build` 可构建仓库子路径版本；默认构建仍支持根路径。

## 设计规范 v1.0

访问 `?view=design-system` 或系统帮助菜单中的“设计规范”。开发与验收规则见 [规范文档](docs/design-system/README.md)。
