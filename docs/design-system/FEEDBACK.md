# 反馈组件参考更新 v3.2.0

日期：2026-11-06。范围：现有设计规范页中的 Alert、Message、Tooltip、Notification，以及 Badge 新增样式与下拉宽度规则。

## 设计依据

- [Figma Page 6 — Alert](https://www.figma.com/design/4SpQ3M9aVhfppMq5jyFlNq/规范?node-id=181-5090)：基础版 620×40，说明版 620×76，四种语义类型。
- [Figma Page 6 — Message](https://www.figma.com/design/4SpQ3M9aVhfppMq5jyFlNq/规范?node-id=181-4941)：白底 48px 高、随文案自适应宽度、顶部出现、3秒消失。
- 用户附件 `Tooltip 文字提示.png`、`Notification 通知.png`：白底箭头提示及白底通知卡片。
- 用户附件 `codex-clipboard-4b8de13b-7302-41b1-acb6-c2603fa1a54b.png`、`codex-clipboard-0845af9f-d64b-4ac8-b1a4-1460fb6df8c2.png`：99、99+和右上角小点；红色按用户要求映射为现有主题红。
- 用户下拉菜单截图：默认与上方触发器等宽、左对齐，仅内容超过时允许更宽。

## 样式与行为

| 项目 | 视觉规则 | 交互规则 |
| --- | --- | --- |
| Alert | 四种功能浅底、无描边、12px圆角；基础最小40px，带说明最小76px；标题16/24常规字重，描述14/22 | 页面内持续展示，各项独立关闭，示例可恢复；不设自动消失 |
| Message | 白底、卡片边框、12px圆角、最小48px、左右约20px、20px图标槽、10px图文间距 | 顶部居中，3秒消失，无关闭图标；重复操作替换并重新计时，Escape可提前关闭 |
| Tooltip | 白底、正文灰12/18、4px圆角、卡片边框、8px箭头、距目标8px、单行32px | 八个实际展示方向；hover150ms、离开100ms、聚焦立即显示、Escape关闭；边缘翻转与滚动定位 |
| Notification | 330px宽、12px圆角、卡片边框、约16×24px内边距、标题16/24加粗、正文14/22 | 四角定位；手动版有关闭按钮，自动版无关闭图标；演示默认4.5秒，悬浮暂停剩余计时；重复触发替换并重新计时 |
| Badge | 计数20px高、白色2px描边、主题红；小点外径10px含1px白边；附着目标右上角 | 默认隐藏0、大于99显示99+；可访问名称保留完整数量；点击示例标记已读 |
| Dropdown / Select | 默认跟随按钮宽度及左边缘，最长内容需要时才加宽；视口内避让 | 保留键盘选择、禁用项跳过、Escape、回焦及高度上限 |

Message、Tooltip、Notification 共用新增 `--gx-shadow-feedback: 0 0 12px rgba(0,0,0,.08)`，不替换普通菜单的既有阴影。

Figma SVG 原始文件保存在 `src/assets/feedback/`；使用原始轮廓作为 CSS mask，颜色取当前语义变量。没有重绘图标。参考文件中个别旧绿色、错误标题浅红和警告微小色差映射为已确认的 #00B578、#FF0000、#FF7D00。

长文案使用系统14/22行高与自然换行；40/76/48px是最小高度，窄屏不裁切文字。Tooltip参考页文字写“9种”，实际只有8个图例，本规范按可见图例记录。Notification参考截图未指定秒数，4.5秒为本地示例约定。

## 实现边界

`src/design/FeedbackExamples.tsx` 和 `BadgeExample.tsx` 提供规范预览与可操作示例。静态图例持续展示，Message/Notification通过按钮触发真实浮层计时。动态反馈不抢焦点，关闭按钮支持键盘；退出该组件或重置会清理浮层与定时器。输入焦点单层边框、标签上下2px等既有规则保持。

本次规范与示例更新不表示业务页面已全部切换到统一反馈组件；公共 SelectField 的菜单尺寸规则实际同步到使用该组件的系统页面。未新增真实上传、业务消息投递、系统通知权限或后端服务。后续接入应根据业务重要程度选择持续反馈，不能依赖自动消失作为唯一结果记录。

2026-11-07最新调整：Popover、Popconfirm、Alert、Message、Notification、Dialog / MessageBox规范示例统一12px圆角，静态及弹出版本一致，共用`--gx-radius-feedback`。基础样式提供12px圆角展示与参数下载；普通下拉菜单、Tooltip及Drawer维持各自规范。
