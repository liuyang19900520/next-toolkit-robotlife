This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 环境配置

项目支持两种环境：`local`（本地开发）和 `prod`（生产环境）。

### 环境变量配置

项目使用 `.env.local`（本地开发）和 `.env.production`（生产环境）来配置不同的 API 端点。

#### 本地开发环境（.env.local）

```env
NEXT_PUBLIC_ENV=local
INVESTMENT_API_BASE_URL=http://localhost:3000
AWS_API_GATEWAY_URL=https://w918daarz0.execute-api.ap-northeast-1.amazonaws.com/Prod
```

#### 生产环境（.env.production）

```env
NEXT_PUBLIC_ENV=prod
INVESTMENT_API_BASE_URL=https://w918daarz0.execute-api.ap-northeast-1.amazonaws.com/Prod
AWS_API_GATEWAY_URL=https://w918daarz0.execute-api.ap-northeast-1.amazonaws.com/Prod
```

### 环境变量说明

- `NEXT_PUBLIC_ENV`: 当前环境，可选值：`local` 或 `prod`
- `INVESTMENT_API_BASE_URL`: 投资 API 的基础 URL
  - 本地环境：指向本地后端服务（如 `http://localhost:3000`）
  - 生产环境：指向 AWS API Gateway
- `AWS_API_GATEWAY_URL`: AWS API Gateway 的完整 URL（生产环境使用）

> **注意**：`.env.local` 文件不会被提交到 Git 仓库，请参考 `.env.example` 创建你自己的 `.env.local` 文件。

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
