export const specVersion = '1.0.0';
export const sections = [
  ['overview', '总览与使用'], ['foundations', '基础样式'], ['components', '公共组件'],
  ['interaction', '状态与交互'], ['patterns', '页面与业务模式'], ['inventory', '页面盘点'], ['acceptance', '开发与验收'],
] as const;
export const pages = [
  { name:'AI 会话首页', group:'工作台', url:'', source:'AIChatView.tsx', rules:'24/32 欢迎标题；四张功能卡；三个问答分类；输入区宽度上限 850px', check:'标题字号、问题切换、输入框与模型选择' },
  { name:'AI 回答详情', group:'工作台', url:'', source:'AIChatView.tsx', rules:'16/28 正文；主色 #03091B；30px 头像；操作栏不加分隔线', check:'从问题示例进入；思考展开、复制、预览、下载' },
  { name:'常用工作台', group:'工作台', url:'?view=dashboard', source:'WorkbenchDashboard.tsx', rules:'20px 模块间距；16px 面板圆角；常用/AI 切换固定右侧', check:'简报固定头、日程、待办、最近使用表单、应用排序' },
  { name:'智能体列表', group:'工作台', url:'?view=agents', source:'AgentsAndSkillsView.tsx', rules:'搜索框 32px；卡片标题悬浮变红；创建表单选项统一菜单', check:'分类、搜索、创建入口及空结果' },
  { name:'技能列表', group:'工作台', url:'?view=skills', source:'AgentsAndSkillsView.tsx', rules:'与智能体共用列表布局；标签页状态清晰', check:'页签、分类、搜索和卡片操作' },
  { name:'知识库列表', group:'文档', url:'?view=knowledge', source:'KnowledgeBaseView.tsx', rules:'统一搜索及日期范围；卡片标题层级一致', check:'筛选、空结果、进入目录' },
  { name:'知识库目录', group:'文档', url:'?view=knowledge', source:'KnowledgeTree.tsx', rules:'目录选中底色与文字反馈；展开与选择分开；省略文本有完整标题', check:'从知识库卡片进入；树展开、选择、文件预览' },
  { name:'云盘', group:'文档', url:'?view=drive', source:'CloudDriveView.tsx', rules:'32px 筛选；统一下拉；文件表格与空状态；删除需确认', check:'文件类型、搜索、创建、上传、预览、删除确认' },
  { name:'待办中心', group:'工作台', url:'?view=todos', source:'TodoView.tsx', rules:'搜索/日期/类型同高；表头 40px、行高 60px；分页保留筛选', check:'分类、日期、清空、每页条数和无匹配记录' },
  { name:'数字员工', group:'工作台', url:'?view=employees', source:'../App.tsx', rules:'使用公共空状态，文案为“暂无内容”', check:'内容居中、无旧卡片或注册按钮' },
  { name:'门户资讯', group:'门户', url:'?view=portal', source:'PortalNewsView.tsx', rules:'两组资讯轮播；箭头仅区域悬浮/键盘聚焦时出现；标题悬浮变红', check:'分类搜索、左右切换、边界禁用、新闻详情' },
  { name:'门户数据', group:'门户', url:'?view=portal&section=data', source:'PortalDataView.tsx', rules:'26px 紧凑筛选例外；图表使用业务配色，不替换为交互红', check:'九个筛选菜单、图表布局和地图缩放' },
  { name:'IM 会话', group:'协作', url:'?view=im', source:'IMChatView.tsx', rules:'会话列表/消息/输入区分层；图标操作可聚焦并具备名称', check:'联系人搜索、消息输入、附件与本地发送' },
  { name:'IM 通讯录', group:'协作', url:'?view=im&section=contacts', source:'IMChatView.tsx', rules:'共用搜索；组织树与联系人卡片区分选中及悬浮', check:'组织切换、搜索、打开会话' },
];
export const components = [
  ['Button', 'UI.tsx', '主操作、次操作、文字、危险；支持 disabled / loading', '应用管理保存/取消、简报祝福', '高度 32 · 圆角 8 · 图文间距 8'],
  ['PanelHeading', 'UI.tsx', 'title、可选 icon、可选 onAction；无图标不占位', '工作台五个模块标题', '标题 16/24 · 更多 12px'],
  ['StatusBadge', 'UI.tsx', 'success / info / warning / danger / neutral，必须包含文字', '工作台待办、日程', '字号 12 · 行高 22 · 圆角 4'],
  ['EmptyState', 'UI.tsx', 'title、description、可选 action；状态可被辅助技术读取', '数字员工、云盘空结果', '标题 14/22 · 内容居中'],
  ['SearchField', 'FieldControls.tsx', 'value / onChange / label；清空后焦点回到输入框', '智能体、知识库、云盘、待办、门户、IM', '高度 32 · 圆角 8 · 左右 10'],
  ['DateRangeField', 'FieldControls.tsx', '开始/结束日期约束、清空、日期范围标签', '知识库、待办', '高度 32 · 宽度 250'],
  ['SelectField', 'SelectField.tsx', 'field / compact / pill；可选图标；键盘与视口定位', '模型选择、云盘、智能体创建、待办、门户', '默认 32 · 紧凑 26 · 菜单圆角 8'],
  ['NewsCarousel', 'NewsCarousel.tsx', 'label / count / resetKey；边界禁用、键盘方向键', '门户两组资讯', '卡片间距 20 · 区域悬浮显示箭头'],
];
export const interactions = [
  ['默认', '主文字使用 text-primary，次要说明使用 text-secondary。', '不把图表系列色、文件类型色改成主色。'],
  ['悬浮', '文字交互变红；菜单与工具按钮可用 hover-bg。', '主操作按钮保留白字；静态面板不浮起。'],
  ['选中', '使用 selected-bg + 红色文字，且保留 aria-selected / pressed。', '选中不等于悬浮；日历保留蓝色日期选中态。'],
  ['聚焦', '可操作元素有可见焦点；输入焦点使用 focus 边框。', '不能为去掉浏览器样式而删除键盘焦点。'],
  ['禁用', '按钮禁用、光标禁用、透明度降低；不触发动作。', '禁用菜单项由方向键跳过。'],
  ['加载', '按钮 aria-busy，保留操作名称，防止重复提交。', '错误提示不能用永不结束的加载替代。'],
  ['错误', '说明发生了什么及恢复方式，使用 role=alert。', '表单保留已输入内容；删除必须先确认。'],
  ['空状态', '无内容、无匹配、未添加应使用不同文案。', '有明确恢复路径时提供“清空筛选”或“添加”。'],
];
export const rules = [
  { title:'布局与滚动', text:'桌面头部 80px，侧栏 240px（折叠 64px），门户/工作台内容上限 1660px，模块间距 20px。1500px 以下调整栏宽，900px 以下工作台改为单列。复杂表格允许容器内横向滚动，不挤压列文字。' },
  { title:'今日简报', text:'头部固定在简报列内；正文独立滚动。左右内容间距均为 20px，滚动条占用右侧留白，不改变正文对齐。正文 14px、行高 22px；默认隐藏滚动条，移入显示。' },
  { title:'AI 对话', text:'首页标题 24/32；回答正文 16/28；辅助文字 12/18。回答、状态栏和工具栏共用左基线，工具栏无顶部横线。生成中允许停止；复制/下载对应当前回答。示例回答不能宣称已查询或提交真实企业数据。' },
  { title:'资讯与提醒', text:'新闻与提醒卡片悬浮时标题变红，保留既有轻微浮起反馈。轮播箭头默认隐藏，区域悬浮或键盘焦点进入才显示；头尾禁用；减少动态效果时不用平滑滚动。' },
  { title:'应用管理', text:'仅在编辑态允许拖动排序，提供 Alt + 左右键替代。保存后持久化，取消放弃草稿；移除只改变快捷入口，不卸载系统。失败时保留草稿并提示。' },
  { title:'图标与图片', text:'界面动作优先复用 lucide-react 或现有矢量图标。常规图标 16/18/20px，菜单图标 15px；无图标不留空槽。装饰图 alt 为空，内容图提供说明；吉祥物不替代按钮标签。' },
  { title:'文字与数据', text:'按钮使用明确动词；正文保持中文标点及数字单位。单行省略必须可查看完整内容。日期 YYYY-MM-DD，时间 HH:mm，金额保留统一小数位；未知内容用“—”，不能用 0 代替未知。' },
  { title:'响应式与可访问性', text:'默认面向桌面办公；规范页支持窄屏。产品桌面基线验证 1920、1440、1280px。颜色不作为唯一状态信息；按 Tab 可见焦点，菜单支持 Escape，弹窗返回触发点；遵循减少动态效果偏好。移动端全面适配与完整 WCAG 审计不在本次通过范围。' },
];
