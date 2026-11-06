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

浮层菜单通过 portal 渲染在 body，需要根级 token；不能依赖 `.app-shell` 局部变量。原生 dialog 的按钮同样直接读取根级 token。

## 新增组件的完成标准

必须说明：用途/禁止场景、结构、尺寸/间距、API、默认值、适用状态、键盘操作、焦点、关闭规则、长文本、边界/空数据、使用例子、生产消费者。优先使用现有组件变体，不新增只有名字不同的实现。

涉及视觉例外时记录：页面、理由、具体参数、验收方式。已登记例外：门户 26px 紧凑选择；智能体分类 38px；模型胶囊；AI 16/28 正文；日历蓝色选中；内容图表和文件类型色；主操作白字渐变。

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
