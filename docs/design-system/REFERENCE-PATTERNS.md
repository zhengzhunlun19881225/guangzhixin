# 六类参考图补充 · v3.3.0

日期：2026-11-06。范围：设计规范、下载文档、隔离的可操作预览。用户明确要求先检查规范，再改系统；本轮六类样式尚未接入业务组件。

## 来源与入口

| 参考图 | 规范入口 | 补充内容 |
| --- | --- | --- |
| Radio单选框备份.png | `?view=design-system&component=radio#library` | 基础、禁用、边框、灰底分段、品牌渐变胶囊 |
| Checkbox 多选框备份.png | `?view=design-system&component=checkbox#library` | 未选/已选/半选，三种禁用态，全选联动，边框型 |
| Switch 开关备份.png | `?view=design-system&component=switch#library` | 蓝色/绿色、关闭、左右文字、禁用 |
| Radio单选框备份 2.png | `?view=design-system&component=tabs#library` | 六项下划线页签、九项胶囊页签 |
| Radio单选框备份 3.png | `?view=design-system&component=empty#library` | 灰色文档插画，基础/带按钮空状态 |
| MessageBox 弹框.png | `?view=design-system&component=dialog#library` | 短/长消息、确认消息、必填输入弹框 |

原始参考图均由用户提供，位于用户桌面。Empty 插画从参考图裁取到 `src/assets/spec/empty-reference.png`，保留原始灰色风格；并非新生成或现有公共 EmptyState 的替换资产。其他图形使用 CSS 与项目已有 lucide 图标。

## 尺寸与状态

- Radio / Checkbox：指示器14px、文字14/22、图文间距8px；主题红选中，禁用灰色。边框型32px高、8px圆角、白底，选中外边框使用主题色50%透明度，文字及内部指示器保持实色；Checkbox指示器在未选、选中、半选、禁用时均为4px圆角，选中与半选主题红；支持原生indeterminate。2026-11-07已将复选框外观统一到系统两种模式，其他参考控件仍按各自迁移范围执行。图中“单选框组”按实际多选语义纠正为“多选框组”。
- Radio按钮型：灰底分段260px宽、32px高；胶囊300px宽、40px高，选中保留系统品牌渐变。Radio表示单值选择；页面内容切换使用Tabs。
- Switch：40×20px轨道、16px白色滑块、2px边距；开启使用现有信息蓝或成功绿，关闭使用输入边框灰；禁用透明度50%。蓝/绿色是参考图指定的功能色变体，不机械改成红色。
- Tabs：下划线型16/24、间距24px、20×2px主题红线；胶囊型14/22、32px高、左右16px、浅红选中底。两种未选中文字按v3.4最新要求统一正文灰#4E5969。两组独立管理内容面板，窄屏换行。
- Empty：100×80px原图插画、14/22辅助灰文字、16px纵向间距；带按钮版本使用32px纯红按钮。点击添加仅产生本地示例数据，支持恢复空状态。
- MessageBox：360px宽、12px圆角、白底浅阴影；标题16/24、600字重、顶部20px/左右30px；内容14/22，上距20px；按钮区上距26px/下距30px，按钮36px高、最小78px宽、间距40px。这些为依据截图确定的布局值，视觉字形顶部约22px。移动端最大宽度为视口减32px，左右内边距20px。通用Dialog的现有64px标题栏规范另行保留。

## 交互与边界

Radio使用原生组名和方向键；Checkbox全选与子项保持同步；Switch支持Space，禁用态不可操作。Tabs具有独立tablist、tabpanel和关联ID，支持左右方向键与Home/End。

MessageBox外观示例持续展示，下方按钮可打开真实模态预览。消息/确认型默认聚焦确定，输入型聚焦字段。输入为空时不关闭，错误关联字段并回焦；取消、关闭、Escape放弃草稿并回到触发按钮；遮罩点击不关闭。示例不删除文件、不保存密码、不调用后端。

v3.4追加：确认消息的警告图标使用既有Figma实心字形，可见圆形16×16px，文字间距8px。原导出32px画板的2px留白通过遮罩等比补偿，图形不变形；颜色沿用警告色。

## 实现与验收

实现集中在 `src/design/ReferencePatterns.tsx` 与 `reference-patterns.css`，选择器限定为 `rp-*`。结构化规则更新 `componentReference.json` 后生成两个Markdown文档。没有为这六类改写 `UI.tsx`、系统复选框/开关样式或业务使用处。

运行 `npm run check:reference-patterns` 检查交互、禁用态、回焦、校验、桌面及390px布局。浏览器环境变量沿用项目已有Playwright脚本；实际结果见 ACCEPTANCE.md。规范预览通过不等于用户已批准系统迁移。
