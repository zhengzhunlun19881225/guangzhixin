# 广智新完整设计规范 v3.6.0

版本日期：2026-11-07。本文仅包含基础样式、组件规范全览、状态与交互三个模块；组件共6类、59项。

在线入口：`?view=design-system`。参数取自当前系统，组件说明与在线预览共用数据源。

## 01 基础样式

### 已确认配色 / 品牌与功能色

| 名称 | 变量 | 当前值 | 用途 |
| --- | --- | --- | --- |
| 主品牌色 | `--gx-brand` | `#FF0000` | 主要行动 / 当前状态 |
| 成功 | `--gx-success` | `#00B578` | 成功与正常状态 |
| 警告 | `--gx-warning` | `#FF7D00` | 警告 / 业务分类 |
| 其他 | `--gx-text-muted` | `#878B99` | 辅助信息 / 弱化 |
| 紫色 | `--gx-purple` | `#722ED1` | 咨询业务分类 |
| 蓝色 | `--gx-info` | `#006DFF` | 链接 / 创作业务 |
| 青色 | `--gx-cyan` | `#14C9C9` | 辅助分类 / 图表 |

### 中性色与背景色

| 名称 | 变量 | 当前值 | 用途 |
| --- | --- | --- | --- |
| 主要文字 | `--gx-text-primary` | `#03091B` | 主要正文与标题 |
| 正文灰 | `--gx-text-secondary` | `#4E5969` | 正文次级信息 |
| 卡片白底 | `--gx-surface` | `#FFFFFF` | 卡片 / 弹窗 |
| 浅底色 | `--gx-neutral-bg` | `#F4F6F8` | 工具背景 / 悬浮背景 |
| 输入边框 | `--gx-input-border` | `#DCDFE6` | 输入框 / 文本框 / 选择框 |
| 卡片边框 | `--gx-border` | `#EBEEF5` | 卡片 / 分隔线 |
| 弱提示 | `--gx-text-placeholder` | `#9CA3AF` | 占位文字 / 弱提示 |

### 交互派生色

| 名称 | 变量 | 当前值 | 用途 |
| --- | --- | --- | --- |
| 悬浮文字 | `--gx-hover-text` | `#E60101` | 交互悬浮 |
| 焦点边框 | `--gx-focus` | `#CC0000` | 单层聚焦边框 |
| 选中背景 | `--gx-selected-bg` | `#FFF1F2` | 浅红选中底色 |
| 成功背景 | `--gx-success-bg` | `#EAF8ED` | 成功标签浅底 |
| 警告背景 | `--gx-warning-bg` | `#FFF4DC` | 警告标签浅底 |
| 信息背景 | `--gx-info-bg` | `#E7F1FF` | 信息标签浅底 |

### 文字层级

| 层级 | 字号 / 行高 | 用途 |
| --- | --- | --- |
| 大标题 | 24px / 32px | 首页欢迎语 |
| 回答标题 | 18px / 28px | AI 回答与详情标题 |
| 区块标题 | 16px / 24px | 业务模块标题 / AI 正文用 16/28 |
| 正文 | 14px / 22px | 业务内容与简报 |
| 辅助说明 | 12px / 18px | 时间、来源和辅助状态 |

默认字体："Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif。

### 间距、圆角与控件

| 维度 | 当前规则 |
| --- | --- |
| 间距 | 4px、8px、12px、16px、20px、24px、32px；局部4/8、组件12/16、面板20、大区块24/32。 |
| 圆角 | 4px（菜单项）；8px（控件）；12px（反馈浮层）；16px（面板）；999px（胶囊）。 |
| 按钮 | 默认32px高、14px字；小号26px高、12px字。页面主操作渐变白字、主题红solid白字均无描边；弹窗主操作纯红白字；普通图标16px、小号14px。 |
| 标签 | 4px圆角、12/18、600字重，上下2px、左右6px。 |
| 表格与分页 | 数据表头#F9F9F9；日历网格除外。分页每页条数选择框与下拉菜单90px；表格搜索和文件类型最大250px并按原业务自适应。 |
| 滚动条 | 默认滑块#DCDFE6，保留原hover/focus加深；原有隐藏滚动条保持隐藏。 |
| 单选和复选 | 带边框选项选中外边框为主题色50%透明度，文字与内部指示器保持实色；禁用灰色。复选指示器14px、4px圆角、勾形10px，半选横线8×2px。 |
| 业务弹窗 | 表单、搜索、详情、列表标题18/28、600字重；标题区上下20px、左右30px，最小高64px。页脚按钮36px高、最小宽78px、横距40px。 |
| 反馈浮层 | Popover、Popconfirm、Alert、Message、Notification、规范Dialog/MessageBox圆角12px；保留原标题字号。普通下拉、Tooltip和Drawer按各自规则。 |
| 资讯 | 卡片与列表标题16/24、400字重，摘要12/22；卡片宽240px、横距24px，悬浮无阴影。文章左右和底部30px；更多列表最大1080px，分页与内容等宽居中。 |
| 订阅 | 选项横纵间距12px；手动/AI切换260×32px灰底分段，选中白底、主文字色600字重，保留AI图标；底部名称“保存”。 |
| 日期时间示例 | 日期与时间框均300×32px，窄容器自适应；双月日历不显示滚动条，短视口内容仍可访问。时间为15分钟步长下拉列表，带时钟与清空；业务原日期字段按各自契约。 |

### 当前语义参数表

| 变量 | 当前值 |
| --- | --- |
| `--gx-font-family` | `"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif` |
| `--gx-text-primary` | `#03091B` |
| `--gx-text-secondary` | `#4E5969` |
| `--gx-text-muted` | `#878B99` |
| `--gx-text-placeholder` | `#9CA3AF` |
| `--gx-text-on-accent` | `#FFFFFF` |
| `--gx-hover-text` | `#E60101` |
| `--gx-focus` | `#CC0000` |
| `--gx-hover-bg` | `#F4F6F8` |
| `--gx-selected-bg` | `#FFF1F2` |
| `--gx-selected-text` | `#FF0000` |
| `--gx-surface` | `#FFFFFF` |
| `--gx-table-header-bg` | `#F9F9F9` |
| `--gx-border` | `#EBEEF5` |
| `--gx-menu-border` | `#EBEEF5` |
| `--gx-brand` | `#FF0000` |
| `--gx-purple` | `#722ED1` |
| `--gx-cyan` | `#14C9C9` |
| `--gx-input-border` | `#DCDFE6` |
| `--gx-scrollbar-thumb` | `#DCDFE6` |
| `--gx-accent` | `#FF0000` |
| `--gx-dialog-primary` | `#FF0000` |
| `--gx-dialog-backdrop` | `#00000088` |
| `--gx-shadow-dialog` | `0 16px 60px #17203326` |
| `--gx-brand-gradient` | `linear-gradient(159deg, #FF9622 13%, #FF0000 92%)` |
| `--gx-success` | `#00B578` |
| `--gx-success-bg` | `#EAF8ED` |
| `--gx-info` | `#006DFF` |
| `--gx-info-bg` | `#E7F1FF` |
| `--gx-warning` | `#FF7D00` |
| `--gx-warning-bg` | `#FFF4DC` |
| `--gx-danger` | `#FF0000` |
| `--gx-danger-bg` | `#FFF1F2` |
| `--gx-neutral-bg` | `#F4F6F8` |
| `--gx-status-padding-y` | `2px` |
| `--gx-font-caption` | `12px` |
| `--gx-font-body` | `14px` |
| `--gx-font-section` | `16px` |
| `--gx-font-heading` | `18px` |
| `--gx-font-title` | `24px` |
| `--gx-line-caption` | `18px` |
| `--gx-line-body` | `22px` |
| `--gx-line-section` | `24px` |
| `--gx-line-answer` | `28px` |
| `--gx-line-title` | `32px` |
| `--gx-space-1` | `4px` |
| `--gx-space-2` | `8px` |
| `--gx-space-3` | `12px` |
| `--gx-space-4` | `16px` |
| `--gx-space-5` | `20px` |
| `--gx-space-6` | `24px` |
| `--gx-space-8` | `32px` |
| `--gx-radius-small` | `4px` |
| `--gx-radius-compact` | `6px` |
| `--gx-radius-control` | `8px` |
| `--gx-radius-feedback` | `12px` |
| `--gx-choice-selected-border` | `color-mix(in srgb, var(--gx-brand) 50%, transparent)` |
| `--gx-radius-card` | `16px` |
| `--gx-radius-pill` | `999px` |
| `--gx-control-height` | `32px` |
| `--gx-control-compact` | `26px` |
| `--gx-header-height` | `80px` |
| `--gx-sidebar-width` | `240px` |
| `--gx-content-max` | `1660px` |
| `--gx-conversation-max` | `850px` |
| `--gx-shadow-feedback` | `0 0 12px rgba(0,0,0,.08)` |
| `--gx-shadow-menu` | `0 5px 5px -3px #0000001A, 0 8px 10px 1px #0000000F, 0 3px 14px 2px #0000000D` |
| `--gx-shadow-card-hover` | `0 6px 18px rgba(30,41,59,.10)` |
| `--gx-duration-fast` | `160ms` |
| `--gx-duration-card` | `180ms` |

## 02 组件规范全览

六类59项，按用途、视觉、状态、键盘、边界与接入约定记录。入口：`?view=design-system#library`；单项：`?view=design-system&component=button#library`。各项连续展示、独立重置，支持分类和名称检索。

### 使用与落地状态

- **shared**：公共组件：已有共享 API。
- **business**：业务实现：已有页面用法，尚非独立公共 API。
- **proposal**：规范示例：新增建议，尚未在业务上线。

公共组件按既有API接入；业务实现不等于独立公共API；规范示例用于确认外观及交互。预览只修改示例状态，真实后端和异步错误按业务契约接入。

### 2.1 基础原子组件

#### Button 按钮

**落地状态**：公共组件：已有共享 API。

**代码依据**：`src/components/UI.tsx`。

- **用途与选择**：提交、确认和独立动作；跳转使用Link，同一区域只有一个主要操作。
- **结构与视觉**：默认32px高、8px圆角、14px字；小号26px高、12px字、左右10px、图文间距6px。页面主按钮橙红渐变，solid主题红按钮#FF0000白字，均无描边；次按钮白底，文本按钮透明，危险操作红字。普通图文按钮图标16px、间距8px；小号图标14px。保留键盘焦点提示，提供禁用及加载示例。
- **状态与交互**：默认/hover/active/focus/disabled/loading；禁用不触发，loading保留文案并阻止重复提交。 Hover详规及系统场景对比见“状态与交互”：卡片180ms、控件160ms，禁用不响应；保留键盘焦点及减少动态效果。
- **键盘与焦点**：Tab聚焦，Enter/Space触发；关闭弹窗后回到触发按钮。
- **边界与恢复**：长文案允许自适应宽度，不缩小字号；请求失败恢复可操作并保留输入。
- **接入约定**：Button: variant=primary/solid/secondary/text/danger；size=default/small（32/26px）；disabled、loading、type、onClick。图标通过children传入并设aria-hidden，按钮保留文字名称；表单提交显式type=submit。

**示例入口**：`?view=design-system&component=button#library`。

#### Icon 图标

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/WorkbenchVectorIcon.tsx`。

- **用途与选择**：规范收录用户提供的图标资产，按实际外观区分线性与面性；可按名称或重复别名检索。系统现有动作图标与品牌资产保留；资讯详情已按用户要求接入库内点赞/踩及其已选变体。
- **结构与视觉**：138个输入按图形去重为133个：线性119、面性14。默认24px，可切换16/20/24px。普通单色使用主文字色#03091B，可预览主题红；警告#FF7D00、提示#006DFF、事件主题红；渐变文档保留原色，镂空保留。
- **状态与交互**：全部/线性/面性分类、名称/别名搜索、尺寸和颜色预览均为规范本地状态；同名不同图形与已选变体独立保留，重复只合并展示、不删除原文件。空搜索可重置。 Hover详规及系统场景对比见“状态与交互”：卡片180ms、控件160ms，禁用不响应；保留键盘焦点及减少动态效果。
- **键盘与焦点**：装饰图标aria-hidden；图标按钮有完整aria-label和键盘焦点。
- **边界与恢复**：按视觉轮廓而非SVG的fill/stroke属性分类；资源按原viewBox等比缩放，不裁掉细节；原始文件字节不改，CSS遮罩仅为普通单色图标着色。彩色/渐变采用原图，不压成实心块。
- **接入约定**：提供规范IconCatalog与资源目录；资讯详情直接复用点赞/踩SVG并以CSS mask着色，不新增系统公共图标API。装饰图标aria-hidden；操作图标放入有完整aria-label的button。源文件、分类、去重别名见iconCatalog.json。

用户提供的138个SVG；本轮仅补充规范，133个独立图标的线面分类和去重已人工核对。

**示例入口**：`?view=design-system&component=icon#library`。

#### Link 文字链接

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/PortalNewsView.tsx`。

- **用途与选择**：导航到详情、文档和外部资源；执行提交使用Button。
- **结构与视觉**：正文14/22、功能蓝#006DFF；默认和hover均不加下划线，hover使用交互红，保留键盘焦点轮廓。面包屑、锚点和页头返回链接沿用这一规则。
- **状态与交互**：默认/hover/focus/visited按浏览器语义；不可访问时显示说明，不能保留空href。 Hover详规及系统场景对比见“状态与交互”：卡片180ms、控件160ms，禁用不响应；保留键盘焦点及减少动态效果。
- **键盘与焦点**：Tab/Enter；打开新页面时rel=noreferrer，并标注跳转类型。
- **边界与恢复**：长链接换行，下载使用真实文件与文件名；无目标显示普通文字。
- **接入约定**：原生a: href、target、download；业务点击不能伪装成功跳转。

**示例入口**：`?view=design-system&component=link#library`。

#### Typography 文字

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/design/tokens.css`。

- **用途与选择**：建立标题、正文、辅助说明层级；语义标题按h1-h6顺序使用。
- **结构与视觉**：欢迎24/32；业务表单/搜索/详情/列表弹窗标题18/28、600，区块16/24；Popover、Popconfirm、Alert、Message、Notification及规范Dialog / MessageBox保留各自原字号。业务正文14/22；辅助12/18；AI正文16/28。门户资讯卡片标题16/24、400，列表标题16/24、400，描述12/22，保留原行高与截断区域。
- **状态与交互**：静态文字不设置hover；可点击标题才使用红色hover，错误文案使用danger。
- **键盘与焦点**：内容可选择复制；省略标题提供完整title或详情，不能只能悬浮才能读取。
- **边界与恢复**：中文、长英文与数字不能挤压布局；未知值为—，0为真实零值；资讯卡片最多两行。
- **接入约定**：token: font-*、line-*、text-primary/secondary/muted/placeholder；不要把AI正文改为14px。

**示例入口**：`?view=design-system&component=typography#library`。

#### Divider 分割线

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/design/tokens.css`。

- **用途与选择**：分隔不同信息区域；避免重复线框和用线代替合理留白。
- **结构与视觉**：1px、#EBEEF5；水平线占容器宽度，竖线与文字区域对齐；间距16/24px。
- **状态与交互**：静态，无禁用/加载/选中；语义分隔可用hr。
- **键盘与焦点**：不进入Tab顺序，不作为拖拽手柄。
- **边界与恢复**：订阅高级设置上方分隔线已取消；卡片内部不额外增加无用途分割线。
- **接入约定**：hr或边框；引用--gx-border，不能误用输入边框色。

**示例入口**：`?view=design-system&component=divider#library`。

#### Avatar 头像

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/IMChatView.tsx`。

- **用途与选择**：人员、联系人、消息发起者识别；组织头像不可冒充具体个人。
- **结构与视觉**：头部/列表32或40px，详情48px；图片object-fit:cover；相邻姓名间距8/12px。
- **状态与交互**：默认、无图/失败的姓名缩写占位；可打开资料时才有hover/focus。
- **键盘与焦点**：可点击头像使用有名称的button；图片与旁边姓名重复时alt为空。
- **边界与恢复**：图片失败保持尺寸，长姓名省略并保留完整名称；多个头像不共享文件身份。
- **接入约定**：img src/alt；onError回退；业务资料动作由外层按钮承担。

**示例入口**：`?view=design-system&component=avatar#library`。

#### Tag 标签

**落地状态**：公共组件：已有共享 API。

**代码依据**：`src/components/UI.tsx`。

- **用途与选择**：表达对象状态或分类；状态标签不作为主要动作按钮。
- **结构与视觉**：StatusBadge 4px圆角、12/18、600字重；上下2px、左右6px；成功/信息/警告/危险色及浅底。
- **状态与交互**：五种语义色与文本；可关闭分类另有关闭按钮，状态标签本身不伪装可点击。
- **键盘与焦点**：纯状态不进入Tab；可关闭标签的按钮读出“移除某标签”。
- **边界与恢复**：未知状态使用中性标签和明确文字；不能只用红/绿区分；长文字不强制固定宽度。
- **接入约定**：StatusBadge tone=success/info/warning/danger/neutral；当前公共组件不提供关闭或选择API。

**示例入口**：`?view=design-system&component=tag#library`。

#### Badge 徽标 / 红点

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/WorkbenchDashboard.tsx`。

- **用途与选择**：表示未读数量、待办数量或新内容；不替代状态标签。
- **结构与视觉**：参考新增截图：42px浅底圆角方块右上附着计数胶囊，常见99与99+；胶囊高20px、最小宽28px、左右6px、数字12/16常规字重、2px白色描边。小红点外径10px、含1px白边。计数与圆点统一使用当前主题红#FF0000，不沿用截图橙色。
- **状态与交互**：0默认隐藏，超过99显示99+；无精确数量时使用红点，不编造计数。
- **键盘与焦点**：附着按钮的名称包含未读数量；红点装饰aria-hidden，更新避免持续打断读屏。
- **边界与恢复**：999等完整数量通过可访问名称提供；隐藏后不改变按钮布局。
- **接入约定**：count、dot、max=99、showZero作为统一建议契约；规范预览在design/BadgeExample.tsx，业务数量由各模块维护。

用户提供99/99+计数和小红点截图（2026-11-06）

**示例入口**：`?view=design-system&component=badge#library`。

#### Space 间距容器

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/design/tokens.css`。

- **用途与选择**：组织一组同级控件，保持可读节奏；不能替代页面栅格。
- **结构与视觉**：通用4/8/12/16/20/24/32px；表单工具8/12px；资讯卡片横向24px；按钮间距按场景规则。
- **状态与交互**：静态布局；支持wrap与水平/垂直方向，无额外交互状态。
- **键盘与焦点**：保持DOM与视觉顺序一致，换行不改变Tab顺序。
- **边界与恢复**：窄屏允许换行，不用空格或空div撑开；不统一覆盖已有10px控件内边距。
- **接入约定**：CSS flex/grid gap；direction、gap、wrap是布局参数，不创建无语义交互组件。

**示例入口**：`?view=design-system&component=space#library`。

### 2.2 布局组件

#### Grid 栅格

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/WorkbenchDashboard.tsx`。

- **用途与选择**：页面区域与表单列组织；重复卡片按最小可用宽度重排。
- **结构与视觉**：页面最大1660px，业务面板间距20px；表单双列50px列距为日程例外；示例24列仅用于补充布局表达。
- **状态与交互**：桌面多列，空间不足重排；不通过缩小字体强塞列。
- **键盘与焦点**：DOM阅读顺序与视觉顺序相同。
- **边界与恢复**：1920/1440/1280是验收视口；实际断点1500/900，不能将视口数值误当CSS断点。
- **接入约定**：CSS grid-template-columns/minmax/gap；示例列数可切换，不新增产品栅格API。

**示例入口**：`?view=design-system&component=grid#library`。

#### Layout 布局容器

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/App.tsx`。

- **用途与选择**：组合Header/Sider/Content/Footer并分配滚动；业务区内部根据任务调整。
- **结构与视觉**：业务Header80px、Sider240px/折叠64px；内容min-width:0；Footer仅有明确操作或信息时出现。
- **状态与交互**：侧栏展开/折叠，内容独立滚动；固定区域不遮挡页面。
- **键盘与焦点**：跳过导航入口；侧栏折叠后图标保留名称；键盘焦点不能进入隐藏内容。
- **边界与恢复**：规范页自身72px头部是展示容器，不代表产品头部；移动端全站适配仍需逐页验证。
- **接入约定**：App现有布局状态；规范缩略图为结构示意，尺寸标注按真实布局。

**示例入口**：`?view=design-system&component=layout#library`。

#### Card 卡片

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/PortalNewsView.tsx`。

- **用途与选择**：聚合一个主题及其操作；整卡点击不能嵌套另一个按钮。
- **结构与视觉**：白底、边框EBEEF5、16px圆角；常规20px内边距；资讯宽240px、间距24px、文案16px内边距。
- **状态与交互**：静态卡片不浮起；可点资讯hover轻浮起且标题红；支持loading/empty/error。 Hover详规及系统场景对比见“状态与交互”：卡片180ms、控件160ms，禁用不响应；保留键盘焦点及减少动态效果。
- **键盘与焦点**：整卡使用button或a，可聚焦；详细内容经链接打开，不依赖悬浮。
- **边界与恢复**：AI及集团资讯卡片标题16/24、字重400，保留两行48px区域；列表标题16/24、字重400。卡片和列表摘要12/22、最多两行；AI卡片标题与摘要两端对齐、末行左对齐；来源日期左右分列。
- **接入约定**：业务Card尚未统一抽象；NewsCarousel承载资讯卡，复用现有字段与数据源。 规范预览复用门户原图、aiNews/groupNews数据及卡片样式，含两类真实资讯卡与本地详情。

**示例入口**：`?view=design-system&component=card#library`。

#### Collapse 折叠面板

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/NewsSubscriptionDialog.tsx`。

- **用途与选择**：隐藏低频设置，标题需说明展开内容；重要错误不能藏在折叠区。
- **结构与视觉**：标题14/22与16px方向图标；展开内容间距16/24px；订阅高级设置无顶部线。
- **状态与交互**：展开/收起；切换不清空草稿；错误在内部时先展开再定位。
- **键盘与焦点**：button aria-expanded/controls；Enter/Space切换；收起后隐藏内容退出Tab序列。
- **边界与恢复**：长标题换行；不将所有表单默认折叠；保存仍包含已填高级字段。
- **接入约定**：advanced布尔值由父层控制；示例用details/summary演示相同行为。

**示例入口**：`?view=design-system&component=collapse#library`。

#### Split 分割面板

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/CloudDriveView.tsx`。

- **用途与选择**：目录与内容并排；当前业务为固定分栏，可拖动版本为规范补充。
- **结构与视觉**：默认侧栏300px，最小200px；1px分隔线，拖拽命中区8px；内容最小240px。规范预览缩比展示为25%—65%，不作为业务最小宽度。
- **状态与交互**：补充示例支持拖动及键盘调整，拖动时仅改变宽度，不改变选择。
- **键盘与焦点**：separator具备orientation与valuenow/min/max；左右键10px步进，Home/End到界限。
- **边界与恢复**：空间不足改为上下排列，不产生负宽度；真实业务尚未接入拖动。
- **接入约定**：现有CloudDriveView固定宽度；width/min/max/onResize为建议契约，示例不等于生产实现。

**示例入口**：`?view=design-system&component=split#library`。

#### Scrollbar 滚动条

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/schedule.css`。

- **用途与选择**：内容超出容器时滚动，区分页面与卡片的滚动归属。
- **结构与视觉**：细滚动条约6px；默认滑块色#DCDFE6（--gx-scrollbar-thumb），hover/focus-within保留既有加深反馈；标题与操作栏固定在滚动区外。
- **状态与交互**：可滚动、到底、筛选回顶部；不在零内容时显示无用途滚动框。
- **键盘与焦点**：滚动区可聚焦并有名称；PageUp/Down、Home/End按浏览器行为；焦点项滚入视口。
- **边界与恢复**：不能全局隐藏滚动导致无法发现内容；资讯列表五条后滚动，间距32px。
- **接入约定**：overflow:auto、overscroll-behavior:contain；内容区min-height:0保证flex内部可滚动。

**示例入口**：`?view=design-system&component=scrollbar#library`。

### 2.3 导航组件

#### Menu 侧边菜单

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/Sidebar.tsx`。

- **用途与选择**：页面主导航，不与动作菜单混用；当前项唯一。
- **结构与视觉**：侧栏240px/64px；项高40px、圆角8px、14px字；选中浅红+主题红、字重400。 规范示例依次为智能体·技能、知识库、数字员工管理、云盘，复用20px原始黑红业务图标，图文间距8px、菜单项间距8px。
- **状态与交互**：默认/hover/当前/折叠；当前项与hover不同，彩色业务图标按已确认规则保留。 示例初始未选择，点击或键盘激活后显示当前项；仅演示选择，不跳转业务页面。
- **键盘与焦点**：nav标注名称、当前项aria-current=page；原生button/a可Tab及Enter操作。
- **边界与恢复**：长名称省略仍可访问；折叠显示图标名称；不可用入口不要伪造跳转成功。
- **接入约定**：Sidebar currentMenu/onSelectMenu/collapsed；菜单路由由App维护。

**示例入口**：`?view=design-system&component=menu#library`。

#### Tabs / Tab 选项卡

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/PortalNewsView.tsx`。

- **用途与选择**：在同一区域切换同级内容；页面跳转使用Menu或Link。
- **结构与视觉**：两种样式：下划线型16/24、横距24px、选中红色600字重、底部20×2px红线；胶囊型14/22、高32px、左右16px、选中浅红底红字。未选项统一使用正文灰#4E5969（--gx-text-secondary）；窄屏换行。
- **状态与交互**：下划线组6项和胶囊组9项独立切换并更新各自面板；与Radio按钮组的单值录入语义区分，不在一个分组混用两种外观。 Hover文字交互红，未选胶囊灰底；按下文字焦点红、胶囊浅红。点击更新选中项和内容面板，移出保留选中。
- **键盘与焦点**：tablist/tab/tabpanel，方向键循环、Home/End；焦点与选中状态一致，禁用项跳过。
- **边界与恢复**：溢出可换行/横滚但不能缩字号；示例补齐键盘规则，不宣称旧页签全部已实现。
- **接入约定**：业务页签API不同；建议activeKey/onChange/items，示例为规范参考。

2026-11-06 用户提供的组件参考图；本轮仅补充设计规范和隔离预览，待检查确认后再应用到系统。

**示例入口**：`?view=design-system&component=tabs#library`。

#### Steps 步骤条

**落地状态**：规范示例：新增建议，尚未在业务上线。

**代码依据**：无生产公共组件；见规范示例。

- **用途与选择**：有顺序的多步任务；纯分类切换使用Tabs。
- **结构与视觉**：编号圆24px、连接线1px、标题14/22；当前红、完成绿、待办灰；窄屏垂直。
- **状态与交互**：待进行/当前/完成/错误；下一步校验当前字段，完成后仍可查看。
- **键盘与焦点**：步骤列表含aria-current=step；仅允许返回的步骤可用button，其他为静态项。
- **边界与恢复**：步骤名两行内，至少2步；不允许直接跳过未完成必填步骤。
- **接入约定**：建议current/items/status/onChange；当前仅规范示例，未接业务流程。

**示例入口**：`?view=design-system&component=steps#library`。

#### Breadcrumb 面包屑

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/IMChatView.tsx`。

- **用途与选择**：表示当前位置的层级路径，不替代主导航或操作工具栏。
- **结构与视觉**：14/22次级灰，分隔图标12px，间距8px；当前项主文字且不可点击。
- **状态与交互**：点击祖先返回层级；当前项aria-current=page；加载中保留已知路径。
- **键盘与焦点**：nav aria-label=面包屑，祖先链接可Tab/Enter。
- **边界与恢复**：层级过深中间折叠需可展开；名称长时当前项可换行，不制造不存在的路径。
- **接入约定**：路径由当前目录/组织状态产生；items label/key/onSelect为建议统一契约。

**示例入口**：`?view=design-system&component=breadcrumb#library`。

#### Pagination 分页

**落地状态**：公共组件：已有共享 API。

**代码依据**：`src/components/Pagination.tsx`。

- **用途与选择**：对有明确总量的列表分页；无总量的流式数据使用加载更多。
- **结构与视觉**：参考知识库与云盘：左侧总条数和90px每页条数选择，右侧上/下一页、页码及前往页码输入。控件32px高、8px圆角、间距8px；当前页橙红渐变白字、无描边。
- **状态与交互**：默认20条/页，可选10/20/50/100。总数跟随筛选；切换目录、搜索、筛选或每页条数回到第一页；删除末页最后一条自动回有效页。页码点击更新列表；首页/末页禁用前后按钮。Hover灰底红字红边；当前页保留渐变白字、悬浮提亮、按下压暗。翻页保留已选文件，表头全选仅作用当前页，跨页选择不被覆盖。
- **键盘与焦点**：Tab访问前后页、页码、每页条数及跳页输入；Enter提交页码，空白/非整数/越界显示错误且保留当前页，Escape还原当前页。输入仅单层焦点边框，按钮保留2px焦点外轮廓。
- **边界与恢复**：总数0显示空态、当前页1，前后页及跳页禁用；长页码间隔用省略号。窄屏只显示当前页/总页数及前后操作，统计与跳页可换行。列表内部滚动，分页留在文件区底部。
- **接入约定**：Pagination接受total/page/pageSize/onPageChange/onPageSizeChange/label；usePagination处理筛选重置及末页回退。知识库文件列表、云盘及规范示例共用；不改其他页面的既有分页。

**示例入口**：`?view=design-system&component=pagination#library`。

#### Dropdown 下拉菜单

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/Header.tsx`。

- **用途与选择**：呈现动作集合，不用于选择字段值；字段使用Select。
- **结构与视觉**：菜单默认与触发按钮等宽、左边缘对齐；仅内容放不下时按最长条目加宽，仍受视口约束。白底、8px圆角、菜单阴影、项高32px；图标15px，缺图标不占位，hover灰底红字。
- **状态与交互**：打开/关闭/禁用项；点击外部或选择关闭；危险项红字并二次确认。
- **键盘与焦点**：menu/menuitem，方向键移动、Home/End、Escape回触发器；Tab退出。
- **边界与恢复**：贴近边缘自动翻转；菜单最多280px高后滚动；示例动作仅更新本地演示状态。
- **接入约定**：Header现有账户菜单；建议items/onAction/placement，不等同Select的value。

**示例入口**：`?view=design-system&component=dropdown#library`。

#### Affix 固钉

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/FloatingAITools.tsx`。

- **用途与选择**：让区域标题或高频入口在指定容器滚动时保持可见。
- **结构与视觉**：位置相对实际滚动容器；头部下方预留offset，不遮挡系统Header和弹窗。
- **状态与交互**：到阈值固定，离开区域解除；示例展示容器内sticky标题。
- **键盘与焦点**：不改变Tab顺序；固定后同一元素不复制出第二份焦点目标。
- **边界与恢复**：先确认滚动祖先；业务浮动入口已有固定定位，通用Affix包装尚未抽取。
- **接入约定**：position:sticky/fixed + top；建议target/offsetTop，需实测容器边界。

**示例入口**：`?view=design-system&component=affix#library`。

#### Anchor 锚点

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/design/DesignSpec.tsx`。

- **用途与选择**：长页面分节定位；固定标题遮挡时设置scroll-margin。
- **结构与视觉**：14/22目录文字，当前项浅红红字；章节间距32/64px按内容密度。
- **状态与交互**：点击定位、滚动联动当前项；保留view查询参数及其他路由信息。
- **键盘与焦点**：链接可Tab/Enter；定位后章节可聚焦，减少动态效果时即时滚动。
- **边界与恢复**：锚点必须唯一且存在；异步内容加载后才能定位；不能使用只有#且丢失页面参数的错误路径。
- **接入约定**：section id + IntersectionObserver；当前规范页就是生产示例。

**示例入口**：`?view=design-system&component=anchor#library`。

#### BackTop 返回顶部

**落地状态**：规范示例：新增建议，尚未在业务上线。

**代码依据**：无生产公共组件；见规范示例。

- **用途与选择**：长内容已离开顶部时快速回到当前滚动区顶部。
- **结构与视觉**：32/40px按钮、8px圆角，右下角距边16px；避免与AI浮动入口重叠。
- **状态与交互**：超过阈值显示，到顶隐藏；点击只滚动自己的容器。
- **键盘与焦点**：按钮名称“返回顶部”，Enter/Space；返回后焦点留在可见入口或顶部标题。
- **边界与恢复**：不是回首页；嵌套滚动不得滚错容器；无滚动内容不显示。
- **接入约定**：建议target/visibilityHeight=200；当前为规范示例，未在业务页全局新增。

**示例入口**：`?view=design-system&component=backtop#library`。

#### PageHeader 页头

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/CloudDriveView.tsx`。

- **用途与选择**：承载页面标题、返回、路径和关键操作；不放整个筛选表单。
- **结构与视觉**：标题16/24或任务页18/28；标题与操作两端对齐，间距16px；窄屏工具栏换行。返回入口复用待办页样式：16px左尖角图标、6px图文间距、16px常规字重“返回”、正文主色，无下划线。
- **状态与交互**：返回保存已有筛选；主要操作只出现一次；权限不足的动作按业务规则隐藏或禁用。
- **键盘与焦点**：返回按钮有名称，标题语义明确；文档标题与页面名称一致。
- **边界与恢复**：长标题允许换行，按钮不挤小；取消编辑与返回上级不是同一操作。
- **接入约定**：当前由各页面header组合；title/back/actions/breadcrumb为建议公共参数。

**示例入口**：`?view=design-system&component=pageheader#library`。

### 2.4 表单录入组件

#### Input 输入框

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/NewsSubscriptionDialog.tsx`。

- **用途与选择**：单行短文本、多行描述；必须有可见标签，placeholder不能替代标签。
- **结构与视觉**：单行高32px、8px圆角、14/22、边框DCDFE6；多行至少60px；focus单层CC0000边框。
- **状态与交互**：默认/hover/focus/filled/readonly/disabled/error；最大字数提示，输入不自动提交。 可编辑字段Hover交互红边框；点击聚焦为焦点红单层边框，不加光圈。只读可聚焦复制，不展示可编辑悬浮态；禁用不可聚焦或编辑。
- **键盘与焦点**：Tab进入，输入保留原生编辑与复制；错误aria-invalid/aria-describedby。
- **边界与恢复**：错误获得焦点时保留错误提示；只读可复制，禁用不能编辑；不自动裁掉用户草稿。
- **接入约定**：原生input/textarea + label；value/onChange/maxLength/readOnly/disabled，当前表单分别实现。

**示例入口**：`?view=design-system&component=input#library`。

#### InputNumber 数字输入框

**落地状态**：公共组件：已有共享 API。

**代码依据**：`src/components/NumberInput.tsx`。

- **用途与选择**：数量、页码、金额等数值；证件号/手机号使用Input而非数值计算。
- **结构与视觉**：32px高、8px圆角；数量输入右侧内嵌16px宽调节列，上下按钮各占内部可用高度一半并铺满，无右侧留白。数字与按钮之间保留内边距，单位在字段外明确。
- **状态与交互**：min/max/step；上下限、只读及禁用按钮不可操作；直接输入越界值限制在边界内，清空时暂不提交，失焦恢复原值。
- **键盘与焦点**：上下方向键按step调整；Tab可访问输入和上下按钮，按钮支持Enter/Space；输入框单层焦点边框。
- **边界与恢复**：数量示例整数0—100，未读数量0—9999；小数步进采用原生stepUp/stepDown规则，金额精度仍按业务定义。
- **接入约定**：NumberInput接受label/value/onChange/min/max/step/disabled/readOnly/actionLabel；徽标未读数量与数字输入示例共用。分页跳页为独立语义，沿用无调节按钮的输入。

**示例入口**：`?view=design-system&component=inputnumber#library`。

#### Select 下拉选择

**落地状态**：公共组件：已有共享 API。

**代码依据**：`src/components/SelectField.tsx`。

- **用途与选择**：有限候选的单选字段；多选人员使用业务人员控件。
- **结构与视觉**：32px高/8px圆角；门户紧凑26px/6px；白底菜单、选中浅红红字、hover浅灰。 菜单默认与触发器等宽、左对齐，实际选项内容超宽时才加宽，始终受视口宽度约束。
- **状态与交互**：默认/展开/选中/全部禁用/空候选；外部value受控；选项可禁用。
- **键盘与焦点**：上下/Home/End选项，Enter/Space确认，Escape关闭回焦，Tab退出；可按首字符定位。
- **边界与恢复**：无图标不留列；菜单自动避让、280px后滚动；当前不支持通用搜索多选，不可宣传为已有。
- **接入约定**：SelectField label/options/value/onChange/variant/placement；options含disabled，全部禁用时不能展开。

**示例入口**：`?view=design-system&component=select#library`。

#### Radio 单选框

**落地状态**：规范示例：新增建议，尚未在业务上线。

**代码依据**：无生产公共组件；见规范示例。

- **用途与选择**：2–5个互斥选项且希望全部可见；更多选项优先Select。
- **结构与视觉**：圆形指示器14px，标签14/22，间距8px；选中主题红、白色中心点；禁用灰底灰点。边框型高32px、圆角8px、左右15px、白底；选中外边框为主题色50%透明度，内部圆点与文字保持实色，禁用灰色。按钮型包含260px灰底分段与300px品牌渐变胶囊。
- **状态与交互**：基础、选中、禁用未选/已选、带边框、分段及胶囊均在规范中展示；每组只能选择一项。分段表示单值选择，页面导航应使用Tabs/Menu。 Hover文字与边框交互红，边框/按钮型增加灰底；按下焦点红或浅红底，已选胶囊压暗。点击每组只保留一个选项，选中样式持续；禁用无反馈。
- **键盘与焦点**：Tab进入单选组，方向键切换；原生radio保持组内单选及键盘焦点，禁用项不响应。
- **边界与恢复**：不能用Radio表示立即执行动作；未选择时按必填规则验证。
- **接入约定**：原生input type=radio、name/value/checked；当前为规范补充示例。

2026-11-06 用户提供的组件参考图；本轮仅补充设计规范和隔离预览，待检查确认后再应用到系统。

**示例入口**：`?view=design-system&component=radio#library`。

#### Checkbox 多选框

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/NewsSubscriptionDialog.tsx`。

- **用途与选择**：选择独立布尔值或多条记录，可支持全选与半选。
- **结构与视觉**：14px方框；未选、选中、半选与禁用均为4px圆角，文字14/22、间距8px；选中及半选均为主题红#FF0000底，选中白勾，半选白横线，选中文字红；禁用三种状态均灰。边框型高32px、圆角8px、白底，选中外边框为主题色50%透明度。 内部勾选统一沿用穿梭选择示例的10×10px实心勾形，半选横线8×2px；原生输入和自绘规范指示器共用同一图形，禁用仅变色、不改变尺寸和粗细。
- **状态与交互**：展示未选、已选、半选、三种禁用态、分组全选与边框型；全选联动子项，部分已选时父项indeterminate。参考图的“单选框组”按语义修正为“多选框组”。 Hover文字与图形边框交互红，边框型灰底；按下焦点红/浅红底。点击切换勾选，全选联动、部分选中显示半选；禁用无反馈。
- **键盘与焦点**：Space切换，label扩大点击范围，fieldset/legend说明分组。
- **边界与恢复**：可选分组空选代表不限需在规范说明；半选状态必须设置indeterminate而非假图标。
- **接入约定**：原生checkbox checked/onChange/indeterminate；系统通过design/checkboxes.css统一外观，模式一与模式二均适用。规范自绘指示器同步4px圆角；Switch不受影响。分页表头全选仅作用当前页、保留跨页已选。

2026-11-06 用户提供的组件参考图；本轮仅补充设计规范和隔离预览，待检查确认后再应用到系统。

**示例入口**：`?view=design-system&component=checkbox#library`。

#### Switch 开关

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/IMChatView.tsx`。

- **用途与选择**：立即启用/关闭一个设置；需要提交后生效的表单优先Checkbox。
- **结构与视觉**：轨道40×20px、胶囊圆角；白色滑块16px、四周2px；关闭输入边框灰，开启蓝色#006DFF或成功绿#00B578；禁用轨道与滑块整体50%透明度；左右文字14/22、间距8px。
- **状态与交互**：展示蓝/绿开启、关闭、双侧文字及三种禁用状态；点击或Space切换，disabled不响应。蓝色用于普通设置，绿色用于明确成功/启用语义；同一业务采用一致含义。
- **键盘与焦点**：role=switch、aria-checked；Enter/Space切换，可访问名称包含设置名称。
- **边界与恢复**：开关与说明连贯；加载期间阻止重复请求；当前IM偏好存于本地。
- **接入约定**：IMChatView已有switch；checked/onChange/loading/disabled为统一建议契约。

2026-11-06 用户提供的组件参考图；本轮仅补充设计规范和隔离预览，待检查确认后再应用到系统。

**示例入口**：`?view=design-system&component=switch#library`。

#### Slider 滑块

**落地状态**：规范示例：新增建议，尚未在业务上线。

**代码依据**：无生产公共组件；见规范示例。

- **用途与选择**：调整有连续区间的近似数值；精确金额使用InputNumber。
- **结构与视觉**：已填充轨道及滑块圆点使用成功色#00B578（--gx-success），未填充轨道固定浅灰#F4F6F8；轨道8px高、1px输入边框、手柄16px圆形；原生range保留键盘和数值语义，外观限定在规范示例；含最小/最大/当前值和单位。
- **状态与交互**：默认/拖动/focus/disabled；min/max/step约束，释放后提交成本高的计算。
- **键盘与焦点**：原生range方向键步进，Home/End到端点；aria-valuetext包含单位。
- **边界与恢复**：刻度不能只有颜色；移动端拖动区至少24px；示例不表示已接实际音量。
- **接入约定**：input type=range；value/min/max/step；范围双滑块未列为已支持。

**示例入口**：`?view=design-system&component=slider#library`。

#### DatePicker / TimePicker 日期时间

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/ScheduleFields.tsx`。

- **用途与选择**：会议/事件时间、日期筛选；时间范围必须有明确时区。
- **结构与视觉**：日期与时间字段同为300px宽/32px高，窄容器自适应；8px圆角、单层焦点边框。日期展开704px宽双月日历，白底、1px卡片边框、8px圆角、轻阴影；完整展示且不显示滚动条。标题16/24、600；日期14/22；28px主题红圆点标记首尾、区间浅红。640px以下双月纵排，视口高度不足时保留无滚动条的触控/滚轮操作。时间字段左侧16px时钟，列表与字段等宽，选项36px高，选中主题红、600字重。
- **状态与交互**：日期先选开始再选结束，完成后自动应用并关闭；悬浮预览范围。第二次早于开始日则重新开始；允许同一天。月/年箭头移动两个连续月份；取消、Escape或点击外部放弃草稿；清空删除起止值并保留时间。时间复用SelectField下拉列表，00:00至23:45、15分钟间隔；点击立即保存HH:mm并关闭，清空按钮恢复空值。字段Hover交互红边框、打开保持焦点红；日期Hover灰圆底、按下深红白字；时间选项Hover灰底、按下浅红底，已选主题红。
- **键盘与焦点**：Enter/Space或向下键打开；日期初始焦点为已选开始日或今天。日期方向键移动1/7天，Home/End到周首尾，PageUp/PageDown换月，Shift组合换年；Enter/Space选日，跨面板自动翻月。时间方向键浏览、Home/End到首尾、输入数字匹配、Enter确认；Escape取消浏览，Tab关闭且不截留焦点。
- **边界与恢复**：按Asia/Shanghai判断今天，日期计算采用UTC纯日期避免夏令时偏移；按真实月份生成六周网格，闰年及跨年正常。非本月补位日期禁用。起止范围完成前不覆盖已保存结果，时间不随日期清空。
- **接入约定**：本轮DateRangeExample只用于规范预览，不替换公共DateRangeField或业务调用；日期使用YYYY-MM-DD，范围状态为start/end，时间使用HH:mm。业务迁移及真实禁用日期规则待确认。

用户提供的双月范围日历截图作为结构参考，配色/字体/圆角/边框沿用当前系统规范；本轮仅规范示例。

**示例入口**：`?view=design-system&component=datetime#library`。

#### Cascader 级联选择

**落地状态**：规范示例：新增建议，尚未在业务上线。

**代码依据**：无生产公共组件；见规范示例。

- **用途与选择**：选择有明确层级的单一末级项，例如省/市/区；平级使用Select。
- **结构与视觉**：每级32px字段或同高菜单列，14/22文字，层级之间8px；窄屏改纵向。
- **状态与交互**：父级改变清空失效子级；叶节点确认；无下级时明确空候选。
- **键盘与焦点**：每级复用SelectField键盘；路径名称可读；改变父级不会自动跳焦。
- **边界与恢复**：异步下级加载失败保留父级并可重试；不提交半截路径，除非业务允许。
- **接入约定**：建议options/fieldNames/value/onChange/loadData；示例采用两个受控Select，不是独立公共组件。

**示例入口**：`?view=design-system&component=cascader#library`。

#### Rate 评分

**落地状态**：规范示例：新增建议，尚未在业务上线。

**代码依据**：无生产公共组件；见规范示例。

- **用途与选择**：用户对服务给出主观评分；不能代替业务等级状态。
- **结构与视觉**：五个20px星形、间距8px，选中警告橙，未选弱灰；显示评分文字。
- **状态与交互**：未评分/选中/readonly/disabled；点击已选项可清空需明确约定，示例提供重置。 Hover从第一颗至当前星填橙并显示预览分数，未点击不提交；移出恢复已选分数。按下缩至90%，点击确认并更新数值；清空恢复未评分，方向键可选择。
- **键盘与焦点**：radio组表达1–5分，方向键与Space选择，每项有“几分”名称。
- **边界与恢复**：平均分只读并显示样本数；不能虚构评分；半星不是本示例能力。
- **接入约定**：建议value/count/readOnly/disabled/onChange；当前仅规范示例。

**示例入口**：`?view=design-system&component=rate#library`。

#### Upload 上传

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/ScheduleDialog.tsx`。

- **用途与选择**：附加文件至当前任务，展示真实名称、大小和移除动作。
- **结构与视觉**：沿用云盘32px渐变“上传文件”按钮及新建会议的附件拖拽区；复用AttachmentList展示文件类型图标、真实名称、大小、下载和移除。
- **状态与交互**：多文件选择或拖入后仅存当前预览，可下载和移除；重置清空预览。沿用系统文件选择，不额外声称限制为PDF/TXT或10MB；业务限制应由接入方明确。
- **键盘与焦点**：file input有名称，按钮可键盘触发；移除按钮读出文件名；拖拽必须有点击替代。
- **边界与恢复**：不调用网络上传、不读写用户云盘。文件名允许截断并提供title；空文件列表不显示附件行。
- **接入约定**：规范示例位于design/SystemExamples.tsx；复用ScheduleDialog的AttachmentList及系统CSS，File只保留在组件状态。

**示例入口**：`?view=design-system&component=upload#library`。

#### Form 表单

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/ScheduleDialog.tsx`。

- **用途与选择**：组织标签、输入、帮助、校验和提交；不能用placeholder代替标签。
- **结构与视觉**：以新建会议为例：710px内容上限，会议名称、会议时间、会议类型、地址/链接、主持人及与会人；字段高32px、双列间距50px，窄屏单列；操作按钮居中、36px高、主按钮纯红。
- **状态与交互**：必填名称、主持人、与会人；结束时间须晚于开始时间；失败提示并聚焦错误字段，取消重置草稿。可打开复用ScheduleDialog的完整会议示例。保存仅修改当前预览，不写入工作台日程。
- **键盘与焦点**：label关联id，错误role=alert；提交后焦点到首个错误，Enter仅在合法位置提交。
- **边界与恢复**：必填星号不能唯一表达必填；日期关系/业务权限服务端仍需校验；未保存关闭策略按任务决定。
- **接入约定**：复用SelectField、PeopleField、MeetingTimeField与完整ScheduleDialog；行内表单展示核心字段，完整示例含提醒、可见范围、描述和附件。

**示例入口**：`?view=design-system&component=form#library`。

#### Transfer 穿梭框

**落地状态**：规范示例：新增建议，尚未在业务上线。

**代码依据**：无生产公共组件；见规范示例。

- **用途与选择**：从较小候选集合批量分配多项，左右分别未分配/已分配。
- **结构与视觉**：双栏等宽、边框EBEEF5、标题40px；条目32px；中间按钮32px；窄屏上下排列。
- **状态与交互**：搜索/选中/移入/移出/空态/禁用；两侧ID唯一，无重复数据。
- **键盘与焦点**：checkbox选择，按钮执行转移；转移后状态可读，焦点留在按钮或新目标项。
- **边界与恢复**：大量数据优先表格选择；移出不是删除原始记录；示例只操作本地小集合。
- **接入约定**：建议dataSource/targetKeys/selectedKeys/onChange/onSelectChange；当前为规范示例。

**示例入口**：`?view=design-system&component=transfer#library`。

#### Search 搜索框

**落地状态**：公共组件：已有共享 API。

**代码依据**：`src/components/FieldControls.tsx`。

- **用途与选择**：对当前数据范围检索，提示应说明搜索对象。
- **结构与视觉**：32px高、8px圆角、左右10px；14px搜索图标、14/22文字、输入边框DCDFE6。
- **状态与交互**：空值/输入/有结果/无结果/清空；示例即时过滤，真实远程搜索需防抖和取消旧请求。
- **键盘与焦点**：Enter触发明确搜索；清空后焦点保留在输入框，不能跳回页面顶部。
- **边界与恢复**：空结果保留搜索条件与清空入口；中文输入法组合结束前不触发错误提交。
- **接入约定**：SearchField label/value/onChange/onKeyDown/clearText；返回结果由父层提供。

**示例入口**：`?view=design-system&component=search#library`。

### 2.5 数据展示组件

#### Table 表格

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/CloudDriveView.tsx`。

- **用途与选择**：结构化记录的对比、筛选、选择与批量操作；卡片列表不能伪装表格语义。
- **结构与视觉**：使用云盘原始示例数据与文件图标；列为选择、文件名称、文件大小、创建时间和操作；表头背景#F9F9F9、高40px、行60px，最小宽850px，窄容器内部横向滚动。 工具栏标题左对齐，文件类型、搜索（最大250px，复用云盘断点缩至180px/160px且不超出容器）、批量操作和上传文件按截图顺序整体右对齐，控件间距10px、距表格20px；空间不足时换行保持右对齐。
- **状态与交互**：文件类型筛选、搜索、文件名排序、全选/半选；筛选不清空已选记录。预览及确认删除只影响当前示例，重置恢复数据。 规范示例可选择本地文件加入表格、批量选择后确认删除或取消，仅改变当前示例；重置恢复初始数据。
- **键盘与焦点**：原生table/caption/th scope；排序按钮aria-sort；行选择有记录名，不能整行劫持Tab。
- **边界与恢复**：长名称省略保留完整信息；宽表容器横滚，不挤压操作列；没有数据不展示伪记录。
- **接入约定**：以initialDriveState的当前目录作为本地数据；复用drive-table样式与SelectField/SearchField，不访问IndexedDB、不修改用户云盘。

**示例入口**：`?view=design-system&component=table#library`。

#### Tree 树形控件

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/KnowledgeTree.tsx`。

- **用途与选择**：展示目录/组织层级，展开与选择是两个不同动作。
- **结构与视觉**：建议节点32px、缩进16px，箭头16px；选中浅红红字、常规字重，原图标不变。
- **状态与交互**：展开/收起/选中/disabled/empty/search；不把文件叶节点当可展开目录。
- **键盘与焦点**：补充规范：tree/treeitem，方向键上下移动、左右展开/父级，Home/End；旧业务键盘覆盖需独立验收。
- **边界与恢复**：节点ID唯一；搜索显示父路径；异步加载状态属于节点，不重置整树。
- **接入约定**：KnowledgeTree业务实现；规范示例补齐小树键盘，不能据此认定旧目录已全部兼容。

**示例入口**：`?view=design-system&component=tree#library`。

#### TreeSelect 树形选择

**落地状态**：规范示例：新增建议，尚未在业务上线。

**代码依据**：无生产公共组件；见规范示例。

- **用途与选择**：字段中选择有层级的组织/目录；只需要浏览结构使用Tree。
- **结构与视觉**：触发器32px、8px圆角，弹出白底树、8px圆角、最大280px滚动。
- **状态与交互**：打开/选择/清空/禁用/无结果；示例仅选叶节点，选后关闭并返回触发器。
- **键盘与焦点**：combobox/tree关系清晰；Enter展开，树方向键，Escape关闭回焦。
- **边界与恢复**：长路径在字段省略但可读；多选半选关系必须另行定义，示例不承诺多选。
- **接入约定**：建议treeData/value/onChange/allowClear；当前只有规范示例，业务人员选择不等于通用TreeSelect。

**示例入口**：`?view=design-system&component=treeselect#library`。

#### Descriptions 描述列表

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/ScheduleModule.tsx`。

- **用途与选择**：展示只读对象属性；编辑字段使用Form。
- **结构与视觉**：标签14/22次级灰，值14/22主色；列间24px、行间16px，窄屏单列。
- **状态与交互**：默认/缺失/长文本；缺失用—，允许复制；敏感字段按权限显示。
- **键盘与焦点**：dl/dt/dd表达字段关系；链接/复制动作独立聚焦。
- **边界与恢复**：不将空字符串当0；长描述换行，金额带单位，日期注明时区语义。
- **接入约定**：业务详情已有描述布局；items label/value/span为建议统一契约。

**示例入口**：`?view=design-system&component=descriptions#library`。

#### Timeline 时间轴

**落地状态**：规范示例：新增建议，尚未在业务上线。

**代码依据**：无生产公共组件；见规范示例。

- **用途与选择**：展示按时间发生的事件，默认只读；当前流程状态使用Steps。
- **结构与视觉**：节点8px、连接线1px；内容14/22、时间12/18、节点间24px。
- **状态与交互**：完成/当前/失败，历史顺序明确；加载更多放在末端，不能重排用户正在读的记录。
- **键盘与焦点**：有序列表及time datetime；交互动作独立链接。
- **边界与恢复**：没有时间显示—，不推断审批成功；长内容换行，只有一项时不画多余尾线。
- **接入约定**：建议items/timestamp/status；当前仅规范示例，无真实审批日志服务。

**示例入口**：`?view=design-system&component=timeline#library`。

#### Progress 进度条

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/PortalDataView.tsx`。

- **用途与选择**：显示已知总量的完成比例；未知耗时使用Loading。
- **结构与视觉**：轨道6/8px、圆角4px，主进度品牌红、成功绿、错误红；百分比14px。
- **状态与交互**：0–100%、暂停/错误/完成；数据来自真实任务，不使用定时器假装真实上传。
- **键盘与焦点**：progress或role=progressbar有min/max/now及任务名称。
- **边界与恢复**：总量为0显示未开始而非除零；颜色之外有百分比与状态文字。
- **接入约定**：PortalDataView已有项目进度；percent/status/format为建议公共契约。

**示例入口**：`?view=design-system&component=progress#library`。

#### Skeleton 骨架屏

**落地状态**：规范示例：新增建议，尚未在业务上线。

**代码依据**：无生产公共组件；见规范示例。

- **用途与选择**：首屏内容结构已知且需等待时保持布局；局部短操作使用Loading。
- **结构与视觉**：使用浅底F4F6F8，文本条高14px/间距12px，头像/卡片占位与真实布局一致。
- **状态与交互**：loading→内容/空态/失败；设置aria-busy，骨架不被当成真实文本读取。
- **键盘与焦点**：占位aria-hidden；加载后不要无故移动焦点；减少动态效果时停动画。
- **边界与恢复**：不能无限等待；失败提供重试；不要用骨架遮住已经可用的表单内容。
- **接入约定**：建议loading/rows/avatar/active；当前仅规范示例，按钮用于手动切换示意。

**示例入口**：`?view=design-system&component=skeleton#library`。

#### Empty 空状态

**落地状态**：公共组件：已有共享 API。

**代码依据**：`src/components/UI.tsx`。

- **用途与选择**：区分无内容、搜索无匹配、未配置；提供适当下一步。
- **结构与视觉**：使用用户参考图中的灰色文档插画，100×80px；插画、14/22辅助灰文案、可选按钮居中纵排，间距16px。按钮32px高、8px圆角、主题红白字。
- **状态与交互**：基本用法与带按钮用法并列；示例点击添加生成一条本地内容，可恢复空状态。空数据与搜索无结果需使用不同文案和恢复操作。
- **键盘与焦点**：标题可读；清空/新建按钮可Tab；非紧急空态不使用alert。
- **边界与恢复**：装饰插画alt为空；窄屏两列改一列。不把资源错误、加载中当作空数据；该参考插画仅供规范评审，现有业务EmptyState不改变。
- **接入约定**：EmptyState title/description/action；已有真实页面消费者。

2026-11-06 用户提供的组件参考图；本轮仅补充设计规范和隔离预览，待检查确认后再应用到系统。

**示例入口**：`?view=design-system&component=empty#library`。

#### Statistic 统计数字

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/PortalDataView.tsx`。

- **用途与选择**：展示单个指标、单位和统计口径；不用于可编辑数值。
- **结构与视觉**：标题14/22辅助灰，数字24/32或紧凑20/28、600字重；单位12/18紧随。
- **状态与交互**：默认/loading/无数据/增减趋势；数据更新不改变对齐与单位。
- **键盘与焦点**：数字和单位作为一组可读文本；趋势有“增长/下降”文字。
- **边界与恢复**：千分位、小数位按指标定义；无数据为—，不伪装0；金额与百分比不能混单位。
- **接入约定**：value/precision/unit/trend为建议契约；当前PortalDataView按业务渲染。

**示例入口**：`?view=design-system&component=statistic#library`。

#### Carousel 轮播

**落地状态**：公共组件：已有共享 API。

**代码依据**：`src/components/NewsCarousel.tsx`。

- **用途与选择**：横向浏览一组关联卡片，不自动切走正在阅读的内容。
- **结构与视觉**：生产资讯卡宽240px、间距24px；箭头32px，区域hover/focus显示；图片保持原尺寸策略。
- **状态与交互**：头尾禁用、无溢出隐藏箭头、筛选回起点；有键盘焦点时可操作。
- **键盘与焦点**：轨道可聚焦，左右键按卡片步长滚动；减少动态效果时即时滚动。
- **边界与恢复**：0条显示空态，1条不画无用箭头；改变宽度用ResizeObserver重新计算边界。
- **接入约定**：NewsCarousel label/resetKey/count/children；组件不内置自动播放与数据加载。 规范预览采用门户AI资讯原图、分类、摘要、来源和日期，点击查看本地详情。

**示例入口**：`?view=design-system&component=carousel#library`。

#### Chart 图表

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/TaxTrendChart.tsx`。

- **用途与选择**：解释数据趋势与对比，必须有单位、图例和文字概况；属于业务组件。
- **结构与视觉**：基础系列色使用info/cyan/purple/warning；数轴12px，图表网格border，禁止用交互红替换所有系列。
- **状态与交互**：loading/empty/error/正常；示例只切换已有本地序列，不代表实时数据。
- **键盘与焦点**：图形有标题与可读数据表；键盘不能只依赖悬浮tooltip获知关键值。
- **边界与恢复**：不截断坐标轴制造夸大变化；未知与0分开；不绘制没有来源的真实指标。
- **接入约定**：TaxTrendChart color；业务数据/单位/口径需各图明确；通用Chart库未引入。

**示例入口**：`?view=design-system&component=chart#library`。

### 2.6 反馈弹窗组件

#### Tooltip 文字提示

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/PortalNewsView.tsx`。

- **用途与选择**：补充短说明、展示被省略的完整名称；关键字段说明应直接可见。
- **结构与视觉**：按用户Tooltip截图：白底、1px卡片边框、4px圆角、0 0 12px黑色8%柔和阴影，正文灰12/18、内边距6px 12px、单行高32px；带同色8px箭头，距触发目标8px。
- **状态与交互**：上左/上中/上右、左中/右中、下左/下中/下右八种方向。hover延迟150ms显示，聚焦立即显示；离开后100ms关闭，移入提示保持；Escape关闭。贴近边缘时翻转并限制在视口内，滚动与缩放重新定位。
- **键盘与焦点**：aria-describedby；键盘聚焦可读；提示本身不进入Tab。
- **边界与恢复**：最大宽280px、距视口至少12px；长文字换行。方向数量以截图实际展示的八种为准。业务原生title需按场景迁移，不能据此认定全系统提示已统一。
- **接入约定**：建议content/placement/openDelay/closeDelay；当前自定义示例在design/FeedbackExamples.tsx，采用原生popover顶层容器，避免被滚动区裁剪。

用户提供 Tooltip 文字提示.png（2026-11-06）

**示例入口**：`?view=design-system&component=tooltip#library`。

#### Popover 气泡卡片

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/ScheduleFields.tsx`。

- **用途与选择**：点击后查看小段信息或执行少量操作；复杂编辑使用Dialog/Drawer。
- **结构与视觉**：白底、12px圆角、16px内边距、菜单阴影，最大宽320px、视口边距16px。
- **状态与交互**：打开/关闭/内容变化；点击外部或Escape关闭，操作后是否关闭取决于任务。
- **键盘与焦点**：触发器aria-expanded/controls，打开可聚焦内容；关闭回触发器。
- **边界与恢复**：不能在可关闭气泡内放无法恢复的长表单；必须考虑窄屏碰撞与滚动容器。
- **接入约定**：日程人员/时间浮层为业务实现；示例采用原生popover，定位仅限规范容器。

**示例入口**：`?view=design-system&component=popover#library`。

#### Popconfirm 气泡确认

**落地状态**：规范示例：新增建议，尚未在业务上线。

**代码依据**：无生产公共组件；见规范示例。

- **用途与选择**：轻量、可恢复的删除/取消确认；高风险或复杂说明使用Dialog。
- **结构与视觉**：白底12px圆角、16px内边距；文字14/22；取消与确认32px按钮。
- **状态与交互**：确认前保留对象；确认失败保留气泡并显示错误；取消不变更数据。
- **键盘与焦点**：打开聚焦取消，Escape等于取消，确认后回触发器或后继对象。
- **边界与恢复**：按钮文案具体，如移除；不可用气泡代替权限校验或撤销机制。
- **接入约定**：建议title/onConfirm/onCancel/pending；本示例仅删除演示项，可重置。

**示例入口**：`?view=design-system&component=popconfirm#library`。

#### Alert 警告提示

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/ScheduleModule.tsx`。

- **用途与选择**：用于页面中展示重要的持续提示，是页面内容的一部分；短暂操作反馈使用Message。
- **结构与视觉**：按Figma Page 6：信息蓝/成功绿/警告橙/错误红四类浅底，无描边与阴影，12px圆角。基础版最小高40px、左右16/12px、20px图标槽、图文间距8px、正文14/22。带说明版最小高76px、内边距12px、32px图标槽、图文间距10px；标题16/24常规字重、语义色，正文主要文字色。
- **状态与交互**：基础提示和带说明两种结构，各四种语义色；不自动消失，关闭只移除当前项。示例提供恢复入口，关键业务错误需提供对应恢复动作。
- **键盘与焦点**：动态紧急错误使用role=alert，普通提示使用role=status；静态规范图例不批量播报。关闭按钮可Tab/Enter/Space操作且有名称。
- **边界与恢复**：620px为设计参考宽度，实际占满可用区域；长文案换行并增高，不能固定高度裁掉描述。错误标题沿用已确认主题红，图标保留Figma原形状。
- **接入约定**：业务已有role=alert；新外观示例位于design/FeedbackExamples.tsx。建议type/title/description/closable/onClose；未进行全量业务提示迁移。

[Figma 规范 Page 6 · Alert 警告 · 181:5090](https://www.figma.com/design/4SpQ3M9aVhfppMq5jyFlNq/规范?node-id=181-5090)

**示例入口**：`?view=design-system&component=alert#library`。

#### Message 轻提示

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/CloudDriveView.tsx`。

- **用途与选择**：主动操作后的短暂反馈；被动系统提醒使用Notification，需要持续展示的重要问题使用Alert。
- **结构与视觉**：按Figma Page 6：白底、1px卡片边框、12px圆角、0 0 12px黑色8%柔和阴影；最小高48px，左右约20px，20px图标槽、图文间距10px；14/22常规文字，宽度随内容自适应，四类采用各自语义图标。
- **状态与交互**：从页面顶部居中出现，默认3秒后消失，无关闭图标；重复触发替换当前提示并重新计时，最多一条。切换组件或重置时销毁浮层和计时器。
- **键盘与焦点**：role=status非打断式播报，不抢焦点；Escape可提前关闭，原操作焦点保持。
- **边界与恢复**：最大宽640px，窄屏距两侧至少16px；长文案换行增高。自动消失不作为唯一业务结果记录，错误需在业务中保留重试入口。
- **接入约定**：业务notice尚分散；规范示例位于design/FeedbackExamples.tsx，使用原生popover顶层容器。建议type/content/duration；外观预览常驻，触发示例才执行3秒计时。

[Figma 规范 Page 6 · Message 消息提示 · 181:4941；圆角按2026-11-07用户最新截图要求改为12px，仅规范示例。](https://www.figma.com/design/4SpQ3M9aVhfppMq5jyFlNq/规范?node-id=181-4941)

**示例入口**：`?view=design-system&component=message#library`。

#### Notification 通知

**落地状态**：规范示例：新增建议，尚未在业务上线。

**代码依据**：无生产公共组件；见规范示例。

- **用途与选择**：悬浮在页面角落的全局系统通知，适合被动提醒与较长信息；短暂操作反馈使用Message。
- **结构与视觉**：按用户Notification截图：宽330px、白底、1px卡片边框、12px圆角、0 0 12px黑色8%柔和阴影；内边距约16px 24px，标题16/24加粗、正文14/22、标题下间距6px。通用版无图标；语义版采用20px图标、12px图文间距及语义色标题；关闭图标为辅助灰。
- **状态与交互**：通用短文/长文及成功/信息/警告/错误四类，均有自动和手动关闭版本。手动版右上角关闭；自动版无关闭图标，示例4.5秒后消失，hover暂停剩余计时。支持四角定位，重复触发替换当前项并重新计时。
- **键盘与焦点**：不抢焦点，动态通知role=status；手动关闭可Tab/Enter/Space，关闭后若焦点在通知内则返回触发点；Escape可提前关闭。
- **边界与恢复**：窄屏最大宽为视口减32px，正文换行增高。静态规范图例不自动消失；重要待办使用手动关闭。本示例不发送系统通知、不调用权限接口。
- **接入约定**：建议title/description/type/duration/placement/onClose；duration=0为手动关闭。当前为design/FeedbackExamples.tsx中的规范示例，未接入消息中心或真实推送。

用户提供 Notification 通知.png（2026-11-06）；圆角按2026-11-07用户最新截图要求改为12px，仅规范示例。

**示例入口**：`?view=design-system&component=notification#library`。

#### Dialog / MessageBox 对话框

**落地状态**：公共组件：已有共享 API。

**代码依据**：`src/components/UI.tsx`。

- **用途与选择**：阻断当前任务以确认或编辑；纯展示轻信息用Popover。
- **结构与视觉**：通用Dialog与MessageBox统一12px圆角；通用Dialog保留现有64px标题栏、30px左右留白及36px居中操作。新增MessageBox轻量变体：宽360px、圆角12px、白底浅阴影；标题16/24、600，顶部20px、左右30px；内容14/22、上距20px；按钮区上距26px、下距30px，按钮36px高/最小78px宽、横距40px、主按钮纯红。窄屏宽度不超过视口减32px，左右留白20px。 确认消息的实心警告图标可见尺寸16×16px，使用警告色，距正文8px。
- **状态与交互**：MessageBox包括短/长消息提示、带警告图标的确认消息、必填输入三类；外观示例与真实打开的模态预览分开。确认与取消结果明确，输入为空显示错误并回焦字段，密码不保存。MessageBox点击遮罩不关闭，Escape/关闭按钮/取消退出。
- **键盘与焦点**：打开MessageBox后消息/确认型聚焦确定，输入型聚焦输入；原生dialog限制焦点在弹框内，Escape取消，关闭回到触发按钮；必填错误aria-describedby关联。通用Dialog保留现有行为。
- **边界与恢复**：长文案自然换行、弹框超高内部滚动；不把复杂业务表单塞入360px消息框。当前仅规范示例，不执行真实删除、密码重置或业务保存。
- **接入约定**：ModalSurface label/className/onClose/children；结构槽gx-dialog-header/body/footer；现有业务可保留原生生命周期。

2026-11-06 用户提供的组件参考图；本轮仅补充设计规范和隔离预览，待检查确认后再应用到系统。

**示例入口**：`?view=design-system&component=dialog#library`。

#### Drawer 抽屉

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/FilePreviewDrawer.tsx`。

- **用途与选择**：保留列表上下文进行详情阅读或轻量编辑；全局阻断使用Dialog。
- **结构与视觉**：右侧白底、左边框；建议桌面480/640px、窄屏满可用宽；标题与操作固定、正文滚动。
- **状态与交互**：打开/关闭/加载/失败；编辑关闭需说明草稿策略。
- **键盘与焦点**：模态抽屉应约束焦点、Escape关闭与回焦；旧文件抽屉为业务实现，完整焦点验收仍独立记录。
- **边界与恢复**：不要使用无关闭入口的全屏遮挡；下载对应真实文档；示例右侧模态为新增规范参考。
- **接入约定**：FilePreviewDrawer isOpen/onClose/documentData；规范示例复用ModalSurface，仅演示侧边模态行为。

**示例入口**：`?view=design-system&component=drawer#library`。

#### Loading 加载

**落地状态**：业务实现：已有页面用法，尚非独立公共 API。

**代码依据**：`src/components/UI.tsx`。

- **用途与选择**：短操作与区域未知进度等待；已知比例用Progress，首屏结构占位用Skeleton。
- **结构与视觉**：16px旋转图标与14/22文案，区域最小64px；按钮loading不改变宽度。
- **状态与交互**：开始/完成/失败/可取消；禁止重复提交，不隐藏已有可用内容。
- **键盘与焦点**：aria-busy、role=status；不把每帧动画当播报，减少动态偏好停旋转。
- **边界与恢复**：不能无限等待却无解释；超时提供重试，示例使用手动开始/结束表示状态。
- **接入约定**：Button loading为公共能力；页面/区域加载仍按业务实现，新增Loading容器为规范示例。

**示例入口**：`?view=design-system&component=loading#library`。

## 03 状态与交互

入口：`?view=design-system#interaction`。禁用阻止动作，加载防止重复提交，错误保留输入；选中不被悬浮覆盖。状态同时有文字或可访问语义，不单靠颜色表达。

### 通用状态

| 状态 | 标准 | 边界与例外 |
| --- | --- | --- |
| 默认 | 主文字使用 text-primary，次要说明使用 text-secondary。 | 不把图表系列色、文件类型色改成主色。 |
| 悬浮 | 文字交互变红；菜单与工具按钮可用 hover-bg。 | 主操作按钮保留白字；静态面板不浮起。 |
| 选中 | 使用 selected-bg + 红色文字，且保留 aria-selected / pressed。 | 选中不等于悬浮；工作台七天周历使用红底白字选中态。 |
| 聚焦 | 可操作元素有可见焦点；输入焦点使用 focus 边框。 | 不能为去掉浏览器样式而删除键盘焦点。 |
| 禁用 | 按钮禁用、光标禁用、透明度降低；不触发动作。 | 禁用菜单项由方向键跳过。 |
| 加载 | 按钮 aria-busy，保留操作名称，防止重复提交。 | 错误提示不能用永不结束的加载替代。 |
| 错误 | 说明发生了什么及恢复方式，使用 role=alert。 | 表单保留已输入内容；删除必须先确认。 |
| 空状态 | 无内容、无匹配、未添加应使用不同文案。 | 有明确恢复路径时提供“清空筛选”或“添加”。 |

### 组件状态矩阵

| 组件类型 | 适用状态 | 边界 |
| --- | --- | --- |
| 动作/导航 | 默认、hover、active、focus、disabled；异步loading/error；导航current | Link不模拟按钮加载，静态页头不承载点击。 |
| 字段/表单 | 默认、hover、focus、filled、readonly、disabled、error；异步选项loading/empty | 只读允许复制，禁用不可编辑；错误保留输入并关联字段。 |
| 选择控件 | 未选/已选、focus、disabled；Checkbox半选；Select打开/空态/错误 | Radio无半选；Switch即时保存失败时回滚。 |
| 数据组件 | 正常、loading、empty、error；适用时选中/展开/排序/焦点 | 静态Descriptions/Statistic不强加悬浮或选中。 |
| 浮层/反馈 | 打开/关闭、触发/回焦；取消/确认/处理中/失败 | Tooltip无交互内容；Alert不抢焦点；Message不承载必须完成的任务。 |
| 静态基础/容器 | 正常、长内容、窄容器、资源缺失 | Typography/Divider/Space/Grid无自身禁用/加载/选中。 |

### Hover与点击反馈

| 对象 | 默认 | Hover / 点击反馈 |
| --- | --- | --- |
| 可点击卡片（知识库） | 白底、16px圆角、卡片边框；标题与图标保留内容色。 | 知识库卡片上移2px，阴影0 6px 18px rgba(30,41,59,.10)，180ms；移出恢复。资讯卡片悬浮不增加阴影，标题改为#E60101。 |
| 主按钮 | 页面主按钮为橙红渐变白字，默认与禁用均无描边；弹窗主按钮为#FF0000白字。 | 页面主按钮亮度1.04，保留渐变与白字，无描边；弹窗主按钮背景#E60101，保持白字，不浮起。 |
| 次按钮 / 危险按钮 | 次按钮白底、卡片边框、主文字；危险按钮红色文字及边框。 | 文字与描边#E60101，白底不变；160ms，不改变按钮尺寸。 |
| 文字按钮 | 正文灰#4E5969、透明背景、无下划线。 | 文字#E60101；工具型文字按钮增加#F4F6F8底色，纯文字链接只变文字颜色。 |
| 图标按钮 | 32×32点击区、16px图标、8px圆角、正文灰。 | 图标#E60101、背景#F4F6F8；160ms，图标不放大、不位移；保留可访问名称。 |
| 禁用 / 加载 / 静态内容 | 禁用与加载使用disabled，保留操作名称；静态面板不承载点击。 | 不触发hover变色、浮起或动作；按钮透明度45%。静态卡片不浮起。 |
| Tabs 页签 | 未选正文灰；选中主题红，下划线或浅红胶囊标识当前项。 | Hover文字交互红，未选胶囊灰底；按下文字焦点红、胶囊浅红。点击更新选中项和内容面板，移出保留选中。 |
| Pagination 分页 | 32px页码、8px圆角；当前页橙红渐变白字、无描边。 | 未选页Hover灰底红字红边，按下浅红底；当前页Hover提亮、按下压暗，保留白字。点击切页、切换每页条数或Enter跳页；禁用无反馈。 |
| Input 输入框 | 默认输入边框；只读与禁用使用浅灰底。 | 可编辑字段Hover交互红边框；点击聚焦为焦点红单层边框，不加光圈。只读可聚焦复制，不展示可编辑悬浮态；禁用不可聚焦或编辑。 |
| Radio 单选框 | 未选空心；选中主题红；分段白底选中、胶囊渐变白字。 带边框选项选中外边框为主题色50%透明度；内部指示器和文字保持实色。 | Hover文字与边框交互红，边框/按钮型增加灰底；按下焦点红或浅红底，已选胶囊压暗。点击每组只保留一个选项，选中样式持续；禁用无反馈。 |
| Checkbox 多选框 | 14px方框，未选/选中/半选/禁用均4px圆角；选中和半选主题红，白勾或白横线，禁用灰色。 带边框选项选中外边框为主题色50%透明度；内部指示器和文字保持实色。 | Hover文字与图形边框交互红，边框型灰底；按下焦点红/浅红底。点击切换勾选，全选联动、部分选中显示半选；禁用无反馈。 |
| DatePicker / TimePicker 日期时间 | 日期字段32px；起止日期红圆点、区间浅红。 | 字段Hover交互红边框，点击打开后保持焦点红；日期Hover灰圆底、按下深红白字。点击起止日期确认区间，移出撤销临时预览；取消不保存草稿。时间下拉选项Hover灰底、按下浅红底，选中主题红；点击确认，Escape取消浏览。 |
| Rate 评分 | 24px星形，未选输入边框灰，已选功能橙。 | Hover从第一颗至当前星填橙并显示预览分数，未点击不提交；移出恢复已选分数。按下缩至90%，点击确认并更新数值；清空恢复未评分，方向键可选择。 |

### 键盘、浮层与恢复

- 按钮与链接可由键盘访问并提供2px主题焦点外轮廓；输入及日期字段仅单层焦点边框。
- 下拉支持方向键、Home/End、Enter、Escape和Tab，靠近视口边缘时避让；菜单禁用项和隐藏项不参与键盘导航。
- 弹窗约束焦点，Escape按层关闭，关闭后返回触发按钮；取消不提交草稿。分页Enter跳页，非法页码显示恢复提示。
- 单选组保持互斥，多选可独立切换并联动全选/半选；边框型选中外边框保持主题色50%，内部图形及禁用状态独立。
- 触屏不依赖hover访问操作；遵循减少动态效果偏好，关闭非必要卡片位移和平滑动画。
