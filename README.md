# Next.js Toolkit RobotLife

Personal learning project - A toolkit application built with Next.js 15, featuring investment calculators and stock analysis tools.

## Tech Stack

- **Framework**: Next.js 15.1.2 (App Router)
- **Language**: TypeScript (Strict Mode)
- **UI Library**: Ant Design 5.22.6
- **Styling**: Tailwind CSS 3.4.1
- **Charts**: Recharts 2.15.0
- **HTTP Client**: Axios 1.7.9
- **Runtime**: Node.js 18+

## Local Setup

1. Copy environment variables template:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in the required values:
   ```env
   NEXT_PUBLIC_ENV=local
   INVESTMENT_API_BASE_URL=http://localhost:3000
   STOCK_API_BASE_URL=http://127.0.0.1:8000
   NEXT_PUBLIC_CASES_APP_URL=https://master.d2bg3wzre4yxa0.amplifyapp.com
   NEXT_PUBLIC_BLOG_URL=https://liuyang19900520.github.io/
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Production Deployment

This project is deployed on **AWS Amplify**.

Production environment variables should be configured in the AWS Amplify Console, not committed to the repository. See `.env.example` for the required environment variables.

## Project Structure

```
src/
├── app/              # Next.js App Router routes
├── components/       # Reusable UI components
├── config/           # Configuration files (API, etc.)
├── utils/            # Utility functions and API clients
└── types/            # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

All environment variables are documented in `.env.example`. Production values should be set in your deployment platform (AWS Amplify Console), not in committed files.
