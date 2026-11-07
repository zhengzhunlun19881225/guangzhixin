# 广智新前端约定

修改 UI 前阅读 `docs/design-system/README.md` 与 `IMPLEMENTATION.md`。页面和组件清单位于 `src/design/catalog.ts`，在线示例入口是 `?view=design-system`。

- 核心颜色与尺寸优先使用 `src/design/tokens.css` 的语义变量。不要在页面重复硬编码同一颜色或给兼容别名重新赋值。
- 优先复用 UI.tsx、FieldControls.tsx、SelectField.tsx、NewsCarousel.tsx。选择框不用原生 select。
- 不改变已确认的场景差异：AI 16/28、简报 14/22、欢迎标题 24/32、门户紧凑筛选 26px、页面主按钮白字渐变、弹窗主按钮纯红白字、内容图表配色。
- 新增样式规则说明用途、适用组件和例外。修改默认值时同步规范和示例，不仅叠加单页覆盖。
- 交互必须考虑键盘、焦点、清空、取消、禁用、错误和空数据。不要增加仅有视觉反馈却没有实际动作的入口。
- 完成 UI 修改后运行类型检查、`check:design` 和生产构建。影响共享组件或布局时，按 `IMPLEMENTATION.md` 运行浏览器回归，记录实际通过的范围；不可声称未运行的检查通过。
- 设计规范版本及验收记录放在 `docs/design-system/`。保留业务演示与真实后端的区别。

## 本地更新与发布授权

用户当前要求：默认只做本地修改和验证。只有收到用户新的明确同步/发布指令后，才可向 GitHub 推送、创建或更新 PR、发布 Release、触发远程部署或进行其他远程写入。此前的发布授权不作为后续自动发布的依据。
