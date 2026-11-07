# 开发接入与约束

## 参数和组件

```tsx
import { Button, PanelHeading, EmptyState, StatusBadge } from './components/UI';
import { SearchField, DateRangeField } from './components/FieldControls';
import { SelectField } from './components/SelectField';

<Button variant="primary" loading={saving} onClick={save}>保存</Button>
<SearchField label="搜索文件" value={query} onChange={setQuery} />
<SelectField label="文件类型" value={type} onChange={setType}
  options={[{ value: 'pdf', label: 'PDF文档' }]} />
<PanelHeading title="最近使用表单" onAction={openForms} />
<StatusBadge tone="success">已完成</StatusBadge>
<EmptyState title="暂无匹配结果" action={<Button onClick={reset}>清空筛选</Button>} />
```

Button 默认 type=button，表单提交需显式指定 type=submit；loading 时禁用，调用方负责真实异步结果和错误信息。PanelHeading 没有 onAction 就不渲染“更多”，没有 icon 就不留图标槽。StatusBadge 是静态文本，不自动启用 live region，避免列表大量播报。

```css
.example-panel {
  color: var(--gx-text-primary);
  border: 1px solid var(--gx-border);
  border-radius: var(--gx-radius-card);
  padding: var(--gx-space-5);
}
```

新代码直接引用 `--gx-*`。旧代码的 `--ink`、`--muted`、`--line`、`--warm-gradient`、`--control-hover-*` 是兼容别名，不再独立赋值。tokens 必须在业务样式之前加载。

## 样式分层

1. tokens.css 定义值；不含页面选择器。
2. components.css、field-controls.css、select-field.css 定义公共组件。
3. 业务 CSS 负责布局和已登记的场景差异；保留历史选择器以降低回归风险。
4. spec.css 只影响 `.spec-*` 示例页面，不能覆盖生产组件的通用规则。

浮层菜单通常通过 portal 渲染在 body；触发器处于原生 dialog 内时，挂载到最近的 dialog，避免背景 inert 导致菜单无法操作。菜单仍使用 Popover 顶层定位。需要根级 token，不能依赖 `.app-shell` 局部变量。原生 dialog 的按钮同样直接读取根级 token。

## 新增组件的完成标准

必须说明：用途/禁止场景、结构、尺寸/间距、API、默认值、适用状态、键盘操作、焦点、关闭规则、长文本、边界/空数据、使用例子、生产消费者。优先使用现有组件变体，不新增只有名字不同的实现。

涉及视觉例外时记录：页面、理由、具体参数、验收方式。已登记例外：门户 26px 紧凑选择；模型胶囊；AI 16/28 正文；内容图表和文件类型色；页面主操作白字渐变；弹窗主操作纯红白字。

## 检查命令

```sh
npm ci
npm run lint
npm run check:design
DEPLOY_BASE=/guangzhixin/ npm run build
DEPLOY_BASE=/guangzhixin/ npm run preview -- --host 127.0.0.1 --port 5197
```

另一个终端运行：

```sh
# 浏览器回归需要本地安装 Playwright 和 Chrome；不增加产品运行时依赖。
npm install --no-save --package-lock=false playwright
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
BASE_URL=http://127.0.0.1:5197/guangzhixin/ npm run check:ui
```

也可以通过 PLAYWRIGHT_MODULE 指定已有 Playwright 模块绝对路径；不指定 CHROME_PATH 时使用 Playwright 安装的 Chromium。默认 BASE_URL 为上述 5197 子路径。输出位于 `output/design-system/`（忽略提交）。

CI 每次发布必须通过类型检查、规范静态检查和生产构建。浏览器回归为独立本地检查，CI 没有运行它，不得把两者混为一谈。

## 代码评审清单

- [ ] 核心颜色引用 token，没有新增原生 select。
- [ ] 组件复用或例外已说明；没有无意义的全局 !important 覆盖。
- [ ] 主操作、危险操作及禁用状态语义明确。
- [ ] 键盘、清空、取消、错误、边界行为均验证。
- [ ] 1920 / 1440 / 1280px 桌面检查无页面级横向溢出。
- [ ] 规范页和 catalog 已同步；验收记录写明实际范围与遗留项。

## 日程增量

接口、布局例外及本地存储边界见 [SCHEDULE.md](SCHEDULE.md)。日程回归命令 `npm run check:schedule` 与 `npm run check:schedule-calendar`，浏览器环境变量与 check:ui 相同；默认本地预览为 5196，输出 `output/schedule/`。

系统弹窗接入 `ModalSurface` 或为已有原生 dialog 添加 `gx-dialog`；结构槽、业务宽度与例外见 [DIALOGS.md](DIALOGS.md)。

## 组件全览接入（v3.1）

`src/design/componentReference.json` 是 59 项规范的结构化来源；`ComponentReference.tsx` 提供检索与规格面板，`ComponentExamples.tsx` 提供隔离的可操作预览。`component-reference.css` 仅作用于 cr-* 示例；共享组件样式与业务 API 未修改。示例中的建议契约不作为已发布公共 API。

修改条目后执行 `npm run docs:components`，同时更新文档和公开下载文件；`npm run check:components` 校验覆盖、非空字段、源码路径和生成文件同步。浏览器专项：`npm run check:component-ui`，沿用 PLAYWRIGHT_MODULE / CHROME_PATH / BASE_URL 配置。

反馈专项：`npm run check:feedback-ui`。参考图控件专项：`npm run check:reference-patterns`；后者覆盖v3.3六类隔离示例，不代表已接入业务页面。检查报告分别写入 `output/design-system/feedback/` 与 `output/playwright/reference-patterns/`。

图标清单与文档：`npm run docs:icons`；一致性检查`npm run check:icons`已接入check:design。浏览器专项`npm run check:icon-ui`检查图标加载、分类/搜索/尺寸/配色及Tabs/Slider颜色修正，输出`output/playwright/icon-catalog/`。图标初始仅用于规范页；2026-11-07用户已授权资讯详情使用“点赞/踩”与已选变体，直接引用原SVG并以CSS mask着色，原始图标文件保留。

双月日期范围专项：`npm run check:date-range-ui`，输出`output/playwright/date-range/`。覆盖日历尺寸隔离、范围草稿、同日/跨月/跨年/闰年、键盘与窄屏滚动；仅用于规范示例。

组件全览现为单列连续瀑布流，59个示例同时存在。每项拥有独立状态和重置计数，二级目录与滚动位置联动；自动化需按 `.cr-detail[data-component="组件ID"]` 定位预览，不能依赖全页只有一个按钮或字段。

模式二入口按用户要求隐藏而不删除，Header保留选项并用hidden和专用规则隐藏，方向键导航排除隐藏项；已有模式偏好与样式实现保留。

模式隔离：`useUIMode`管理original/spec偏好，根节点data-ui-mode覆盖原生dialog及portal。`ui-modes.css`业务规则必须以html[data-ui-mode=spec]限定；模式一不增加覆盖，禁止为模式二改写旧业务样式。新增设置菜单专用类例外。

用户2026-11-07新增授权：知识库文件列表与云盘接入`Pagination`及`usePagination`，规范示例复用。真实总数由过滤后集合计算，页码变化仅切片，不修改数据；切换筛选回首页，末页删除后回退，当前页全选与跨页已选独立处理。

同日用户明确要求全系统复选框统一：`checkboxes.css`同时适用于模式一/模式二，覆盖原生checkbox的未选、已选、半选、禁用和焦点；原生输入始终appearance:none以保留4px圆角，移除云盘/知识库中appearance:auto旧规则。role=switch及带data-custom-checkbox的隐藏输入排除，自绘rp-checkbox同步4px。此项为用户新授权的模式一例外，不扩大到其他控件。

分页专项`npm run check:pagination-ui`；复选框专项`npm run check:checkbox-ui`，复用上述Playwright环境变量。分页测试在独立浏览器上下文生成文件并验证删除，不接触用户浏览器中的云盘数据。证据位于`output/playwright/pagination/`与`checkboxes/`。


## 2026-11-07 资讯和控件增量

- Button支持variant=solid（主题红白字）和size=small（26px）；默认32px。规范提供普通、带图标及小号三排，已有调用无需传新参数。
- 业务表单/搜索/详情/列表弹窗标题18/28；六类反馈规范保留原字号，圆角统一--gx-radius-feedback=12px。DateRangeExample时间使用带leadingIcon/showArrow/menuClassName的SelectField列表，仅替换规范示例；业务日期字段保留原契约。
- 资讯“更多”复用NewsList和Pagination，保留门户筛选、展示模式、返回焦点；正文列最大1080px，分页与之等宽并计算滚动条占位。文章左右及底部30px，资讯列表标题16/400，卡片悬浮无阴影。
- 订阅选择项间距12px、保存名称统一；切换栏260×32灰底分段，保留AI星光图标、原有草稿与键盘操作。资讯详情以规范库点赞/踩按钮替换“示例资讯”，互斥且可取消，guangxin-news-feedback只存本机偏好，不模拟远程推荐成功。
- 分页页容量选择框90px且不参与flex压缩；表头--gx-table-header-bg=#F9F9F9，排除role=grid日历。边框型单选和复选选中使用--gx-choice-selected-border（主题色50%），内部指示器与禁用状态独立。
- 移除概览章节后目录六节；旧#overview转至#foundations，旧#components仍转至#library，59项预览继续同时挂载。

新增浏览器专项命令：npm run check:news-more-ui（更多列表、阅读边距、业务标题、反馈圆角、按钮）；npm run check:table-controls-ui（90px分页、表头、单选/复选外边框及保存）；npm run check:news-detail-ui（隐藏模式二入口、资讯反馈、订阅分段、规范目录）。沿用PLAYWRIGHT_MODULE、CHROME_PATH、BASE_URL，结果分别在output/playwright/news-more、final-controls、news-detail；运行结果以ACCEPTANCE.md为准。

完整规范导出由scripts/build-full-spec.mjs组装，固定三个顶层模块：基础样式、组件规范全览、状态与交互。线上配色/文字/间距/圆角和通用状态共用foundationReference.json；参数直接读取tokens.css。组件与Hover继续使用原JSON，生成器验证59项和三个模块并同步COMPONENTS.md与公开下载文件。下载仍沿用旧URL以兼容已有链接，文件名为“广智新完整设计规范-v3.6.0.md”；不包含其他三个在线章节。

## 热点追踪业务模块

门户资讯在主动提醒之后接入HotspotTracking；数据契约、布局与关注保存边界见[HOTSPOT-TRACKING.md](HOTSPOT-TRACKING.md)。专项`npm run check:hotspot-ui`沿用既有浏览器环境变量。模块是业务实现，不增加公共组件清单，也不改变完整规范下载的三个顶层模块。

## PPT与个人配置业务流程

PPT模式复用AgentComposerTools和三张现有封面，选择模板回调独立于普通工具的插入提示词，详情见[PPT-COMPOSER.md](PPT-COMPOSER.md)。专项`npm run check:ppt-ui`沿用浏览器环境变量，结果在`output/ppt-composer/`。

差旅设置复用ModalSurface/SelectField，创建智能体使用AgentBuilder完整内页；本机数据契约与业务边界见[PERSONAL-FEATURES.md](PERSONAL-FEATURES.md)。专项`npm run check:personal-ui`覆盖设置、智能体、法智模式与共享头部，结果在`output/playwright/personal-features/`。均不改变公共组件和三模块下载范围。

## 图片设置和发布访问入口（2026-11-07）

图片设置业务专项npm run check:agent-images，结果output/playwright/agent-images/；创建页全高30/70分栏已排除旧design-panel工具栏内边距与伪横线。订阅专项npm run check:news-subscription增加AI标题、内置字数和同排布局，结果output/news-subscription/。

发布时设置VITE_PREVIEW_ACCESS_DIGEST启用入口密码；GitHub Pages工作流已配置本轮用户指定密码的SHA-256摘要。未配置时本地开发/预览保持直接进入。PreviewAccess在App/DesignSpec挂载前验证，所有query路由覆盖，成功后当前标签页sessionStorage记忆，刷新/跳转不重复输入，新会话重新验证；存储不可用时仍可进入本页。密码错误提示并回焦，不保存明文，支持显示/隐藏与Enter。

此为静态页面入口校验，不提供服务器访问控制：源码、资源和密码摘要均可能公开读取，不能用于保护敏感内容。npm run check:preview-access针对启用密码、带部署子路径的构建，覆盖直达路由、错误密码、正确密码、会话及存储失败、桌面/窄屏。浏览器回归可复用scripts/preview-access.mjs的unlockPreview(page)，PREVIEW_PASSWORD支持测试密码配置。
