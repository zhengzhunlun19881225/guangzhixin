# 广智新交互预览

广新门户、AI 工作台与 IM 的前端交互预览。

## 本地运行

需要 Node.js 24 与 npm。

```sh
npm ci
npm run dev
```

## 内容与交互

- 工作台：今日简报、待办、最近使用表单、应用排序与日程。
- AI：最近记录、热门问答、常用问题各 10 条，按题目展示对应回答；支持复制、预览及文本下载。
- 门户：资讯轮播、服务提醒及数据页面。
- 云盘、知识库、IM 等交互用于页面演示。

问答为预设示例，企业内部制度与业务数据未接入；浏览器中的文件和消息操作不代表已提交至企业正式系统。

示例数据维护在 `src/data/conversationExamples.ts`。

## 发布

推送 `main` 后，由 `.github/workflows/deploy.yml` 执行检查、构建并发布 GitHub Pages。

站点：https://zhengzhunlun19881225.github.io/guangzhixin/

```sh
npm run lint
DEPLOY_BASE=/guangzhixin/ npm run build
```

默认构建路径为 `/`；GitHub Pages 构建使用仓库子路径。页面使用查询参数切换预览场景，例如 `?view=dashboard`、`?view=portal`、`?view=im`、`?view=drive`。
