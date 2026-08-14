# max-hp

Max's personal homepage: portfolio and resume. A **fully static site** — no server, no database. The only runtime dependencies are `next`, `react` and `react-dom`.

## Development

```bash
npm install
npm run dev      # http://localhost:3001
```

## Scripts

| Command             | Purpose                  |
| ------------------- | ------------------------ |
| `npm run dev`       | Dev server (Turbopack)   |
| `npm run build`     | Static export to `out/`  |
| `npm run start`     | Preview the `out/` build |
| `npm run lint`      | ESLint                   |
| `npm run typecheck` | TypeScript type check    |
| `npm run format`    | Prettier                 |

## Layout

```
src/
├── app/            layout.tsx + page.tsx (single page)
├── components/     NextLogo / Portfolio / ResumeMenu
├── data/           projects.ts  <- portfolio data source
└── styles/         globals.css

public/
├── *.png           architecture diagrams
└── resume/         resume PDFs / HTML
```

## Adding a project

Edit `src/data/projects.ts` only — append an entry to the `projects` array and the UI picks it up; no component changes needed. Field documentation lives in that file. Put architecture diagrams in `public/` and set `architectureImage` to a path starting with `/`.

## Deployment

Vercel, with no CI configuration files:

| Event               | Result                                      |
| ------------------- | ------------------------------------------- |
| PR merged into main | Production deployment                       |
| Push to any branch  | Preview deployment with its own URL         |
| Pull request opened | Vercel bot posts the preview link on the PR |

Environment variables are configured in the Vercel dashboard. Every variable is prefixed `NEXT_PUBLIC_` and gets inlined into the client bundle, so **never put secrets there** — a static site has nowhere to hide them.

## If a server is ever needed

Remove `output` and `images` from `next.config.ts` to turn this back into a full Next.js app (API routes, SSR, image optimization). Vercel supports that natively with no other changes.
