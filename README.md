# 智面智能面试管理后台

React + TypeScript + Vite + Ant Design 的高保真 PC Web 演示原型。

## 启动

```bash
npm install
npm run dev
```

## 主要演示路径

1. `/dashboard` 查看招聘指标、漏斗、趋势、项目排行和异常预警。
2. `/projects` 查看项目表格/看板、筛选、导入导出和详情。
3. `/jobs` 查看岗位、HC 缺口、成员配置和状态。
4. `/interviews/invite` 完成候选人选择、AI 面试配置、通知确认和发起结果。
5. `/interviews/process` 查看面试进程并打开实时监控。
6. `/interviews/review` 审核 AI 结果并推进下一轮或释放公海。
7. `/calendar` 安排人工面试并演示冲突检测。
8. `/analytics/overview` 点击 KPI 或图表下钻 `/analytics/detail`。

## 路由

- 工作台：`/dashboard`
- 面试控制台：`/interviews/invite`、`/interviews/process`、`/interviews/exceptions`、`/interviews/review`、`/interviews/passed`
- 项目岗位：`/projects`、`/projects/:id`、`/jobs`、`/approvals`
- 题库评分：`/questions`、`/score-templates`
- 面试台账：`/records`、`/calendar`
- 数据看板：`/analytics/overview`、`/analytics/projects`、`/analytics/jobs`、`/analytics/interviews`、`/analytics/detail`
- 人才库：`/talent/public`、`/talent/private`、`/talent/incomplete`、`/talent/blacklist`、`/talent/onboarded`
- 通知下载：`/notifications`、`/downloads`、`/updates`
- 系统管理：`/users`、`/organization`、`/roles`、`/settings/templates`、`/settings/audit`、`/settings/system`

## 复用组件

- `BusinessList`：统计、筛选、表格/看板、分页、批量选择和工具栏。
- `StatCard`、`StatusTag`、`PageHeader`：统一指标与状态视觉。
- `ImportWizard`、`ExportModal`：四步导入与权限感知导出。
- `DetailDrawer`、`EmptyState`、`LoadingBlock`：详情和公共状态。
- `AppLayout`：导航、搜索、快捷创建、角色切换、403 和数据范围。

## Mock 与权限

数据统一位于 `src/services/mock.ts`，接口通过 `mockService` 暴露，可直接替换为真实请求。项目、岗位、候选人和面试记录使用共享数据关系。

顶部角色选择器可切换 8 类角色。`AppContext` 提供数据范围和编辑权限，`AppLayout` 根据角色同步收敛导航和直接路由访问；数据观察员、外部客户等角色会看到只读按钮、权限原因或 403 申请入口。

## GitHub Pages 部署

项目使用 Hash 路由和相对静态资源路径，兼容 GitHub Pages 项目站点。

推送到 `main` 分支后，`.github/workflows/deploy-pages.yml` 会自动：

1. 安装 Node.js 22 和项目依赖。
2. 执行 `npm run build`。
3. 将 `dist` 上传并发布到 GitHub Pages。
