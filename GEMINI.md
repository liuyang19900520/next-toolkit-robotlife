# GEMINI.md — AI 辅助开发指令

## 项目概述

**next-toolkit-robotlife** 是一个个人工具箱 Web 应用，同时包含个人简历/作品集展示和投资管理仪表盘。

## 技术栈

| 层         | 技术                                         |
| ---------- | -------------------------------------------- |
| Framework  | Next.js 15.1.2 (App Router, Turbopack)       |
| Language   | TypeScript (Strict Mode)                     |
| UI         | Ant Design 5 + Tailwind CSS 3                |
| Charts     | Recharts                                     |
| Database   | AWS DynamoDB (直接 SDK 访问，非 API Gateway) |
| Deployment | AWS Amplify (Git 集成，push main 自动部署)   |
| CSV 解析   | PapaParse (注意 Shift_JIS 编码)              |

## 目录结构

```
src/
├── app/              # Next.js App Router 路由和 API Routes
│   ├── api/          # REST API (investment CRUD, batch)
│   └── toolkit/      # 工具箱页面
├── components/       # React 组件
│   └── dashboard/    # 投资仪表盘组件群
├── config/           # 配置文件 (categories, mappingRules)
├── hooks/            # 自定义 React Hooks
├── lib/              # 核心库
│   └── dynamodb/     # DynamoDB 客户端、Repository、验证器
├── styles/           # 全局样式
├── types/            # TypeScript 类型定义
└── utils/            # 工具函数 (API 客户端)
```

## 编码规范

### TypeScript

- **Strict Mode**：不允许使用 `any`，除非有充分理由并添加注释
- **类型定义**：集中在 `src/types/` 目录
- **命名**：组件 `PascalCase`，函数/变量 `camelCase`，常量 `UPPER_SNAKE_CASE`

### 数据格式

- **日期**：统一使用 **YYYYMM** 格式（6 位数字），如 `202512`
- **查询**：支持前缀匹配，输入 `2025` 可查询该年所有月份

### 组件规范

- 所有组件默认使用 `'use client'` 仅在需要交互时添加
- UI 库统一使用 Ant Design，不混用其他 UI 框架
- 表单使用 Ant Design Form，表格使用 Ant Design Table

### API 规范

- API Routes 位于 `src/app/api/`
- 返回格式：`{ data: T, message: string, status: string | number }`
- 使用 `investmentRepository` 进行数据库操作

## Git 工作流

```
feature/* ──PR──> develop ──PR──> main ──自动──> AWS Amplify 部署
```

- **feature/xxx**：功能开发分支，从 `develop` 创建
- **develop**：集成测试分支，日常开发合并目标
- **main**：生产分支，合并即部署，禁止直接 push

### Commit 规范

```
feat: 新功能
fix: Bug 修复
docs: 文档变更
style: 格式调整（不影响逻辑）
refactor: 重构
chore: 工具链、CI 等
```

## 安全红线

> ⛔ 绝不在代码中硬编码 AWS 凭证、API Key 等敏感信息
> ⛔ 绝不修改 `.gitignore` 中对 `.env*` 文件的忽略规则
> ⛔ 绝不将 `.env.local` 或 `.env.production` 提交到版本控制
> ⛔ 新增环境变量时，只更新 `.env.example` 的占位模板

## 常用命令

```bash
npm run dev          # 启动开发服务器 (localhost:3001, Turbopack)
npm run build        # 生产构建
npm run lint         # ESLint 检查
npm run lint:fix     # ESLint 自动修复
npm run format       # Prettier 格式化
npm run format:check # Prettier 检查
npm run typecheck    # TypeScript 类型检查
```

## 配置文件

- **分类配置**：`src/config/categories.ts` — 资产大类/小类定义
- **映射规则**：`src/config/categoryMappingRules.json` — CSV 导入自动分类规则
- **API 配置**：`src/config/api.ts` — 环境感知的 API URL

## 响应语言

始终使用 **中文** 进行技术解释和沟通。
