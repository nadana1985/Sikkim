# Monastery360 — Git Handbook

## What Gets Pushed (Essential Files)

### Frontend (Next.js)
```
frontend-public/
├── src/                    ✅ All React components, pages, hooks, lib
├── public/                 ✅ Static assets (manifest.json, sw.js, workbox)
├── package.json            ✅ Dependencies
├── package-lock.json       ✅ Lock file
├── next.config.ts          ✅ Next.js configuration
├── tsconfig.json           ✅ TypeScript config
├── postcss.config.mjs      ✅ PostCSS/Tailwind config
├── eslint.config.mjs       ✅ ESLint config
├── sentry.client.config.ts ✅ Sentry client config
├── sentry.server.config.ts ✅ Sentry server config
├── sentry.edge.config.ts   ✅ Sentry edge config
├── instrumentation.ts      ✅ Sentry instrumentation
├── vercel.json             ✅ Vercel deployment config
├── .dockerignore           ✅ Docker ignore
├── .github/                ✅ CI/CD workflows (optional)
└── .gitignore              ✅ Git ignore rules
```

### Backend (Express + SQLite)
```
frontend-public/backend/
├── src/                    ✅ All TypeScript source code
├── package.json            ✅ Dependencies
├── package-lock.json       ✅ Lock file
├── tsconfig.json           ✅ TypeScript config
├── Dockerfile              ✅ Docker config for Railway
├── docker-compose.yml      ✅ Docker compose
└── docker-compose.yml      ✅ Root docker-compose
```

### Root Level
```
├── vercel.json             ✅ Vercel project config
├── .vercelignore           ✅ Excludes backend from Vercel builds
└── githandbook.md          ✅ This file
```

---

## What Gets IGNORED (Not Pushed)

### ❌ Runtime Data
- `frontend-public/backend/data/*.db` — SQLite database (created at runtime)
- `frontend-public/backend/data/*.db-shm` — SQLite shared memory
- `frontend-public/backend/data/*.db-wal` — SQLite write-ahead log

### ❌ Build Artifacts
- `frontend-public/backend/dist/` — Compiled TypeScript (rebuildable)
- `frontend-public/.next/` — Next.js build output
- `node_modules/` — Dependencies (reinstallable)

### ❌ Agent/Tool Data
- `.refact/` — Codebuff agent internal data
- `frontend-public/.refact/` — More agent data

### ❌ Testing Files
- `frontend-public/test-results/` — Playwright results
- `frontend-public/playwright-report/` — Playwright reports
- `frontend-public/coverage/` — Jest coverage
- `frontend-public/src/**/__tests__/` — Frontend unit tests
- `frontend-public/backend/src/__tests__/` — Backend unit tests
- `frontend-public/tests/` — E2E tests
- `frontend-public/__mocks__/` — Test mocks

### ❌ Documentation & Notes
- `*.md` files (except this one)
- `frontend-public/docs/` — Documentation folder
- `SIKKIM_OVERVIEW.md`, `SIKKIM_RESUME_CONTENT.md` — Project notes
- `lighthouse-monasteries.json` — Lighthouse reports

### ❌ Monitoring & Deployment Config
- `frontend-public/backend/grafana/` — Grafana dashboards
- `frontend-public/nginx/` — Nginx config
- `frontend-public/scripts/` — SSL generation scripts

### ❌ Environment & Secrets
- `.env*` — All environment files (set in Vercel/Railway dashboards)

---

## Step-by-Step Deployment

### Step 1: Initialize Git & Push to GitHub

```bash
# Navigate to project root
cd "F:\Andrews Sikkim"

# Initialize git (if not already)
git init

# Add all files (gitignore will exclude the rest)
git add .

# Commit
git commit -m "Initial commit: Monastery360 frontend + backend"

# Create GitHub repo (if not exists)
# Go to https://github.com/new → Create repo named "Sikkim"

# Connect to GitHub
git remote add origin https://github.com/nadana1985/Sikkim.git

# Push (force push if repo already has old code)
git push -u origin main --force
```

### Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com/new
2. Import the `nadana1985/Sikkim` repository
3. Set **Root Directory** to `frontend-public`
4. Framework: **Next.js** (auto-detected)
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://sikkim-production.up.railway.app
   SENTRY_ORG=monastery360
   SENTRY_PROJECT=frontend-public
   ```
6. Deploy

### Step 3: Deploy Backend to Railway

1. Go to https://railway.com/new
2. Click **"GitHub Repository"**
3. Select `nadana1985/Sikkim`
4. Set **Root Directory** to `frontend-public/backend`
5. Railway auto-detects Node.js + Dockerfile
6. Add Environment Variables:
   ```
   PORT=4000
   CORS_ORIGINS=https://your-frontend.vercel.app
   NODE_ENV=production
   ```
7. Deploy
8. Copy the Railway URL (e.g., `https://sikkim-production.up.railway.app`)

### Step 4: Update Frontend with Backend URL

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_URL` with the Railway URL
3. Redeploy the frontend

### Step 5: Seed the Database (One-Time)

Railway will start with an empty database. You need to seed it:

Option A: Add a build command in Railway:
```
npm run build && npm run seed
```

Option B: SSH into Railway and run:
```bash
railway run npm run seed
```

---

## Quick Reference

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | vercel.com | Next.js app |
| Backend | railway.com | Express API |
| Database | SQLite (in Railway) | monastery360.db |

---

## Troubleshooting

### "CORS Error" in Browser Console
- Ensure `CORS_ORIGINS` in Railway matches your Vercel URL exactly
- Include `https://` prefix

### "Unable to Load Monasteries"
- Check Railway logs for backend errors
- Verify `NEXT_PUBLIC_API_URL` points to Railway URL
- Ensure database is seeded

### Build Fails on Vercel
- Check that `frontend-public/` is set as root directory
- Ensure `.vercelignore` is at repo root (not inside frontend-public)

### Railway Service Keeps Restarting
- Check logs for native module errors (better-sqlite3, sharp)
- Ensure Dockerfile is in `frontend-public/backend/`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Frontend (Next.js)                                 │   │
│  │  • React components                                 │   │
│  │  • Server-side rendering (ISR)                      │   │
│  │  • Static assets                                    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ API calls
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Railway                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Backend (Express)                                  │   │
│  │  • REST API                                         │   │
│  │  • Authentication                                   │   │
│  │  • Image processing (sharp)                         │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Database (SQLite)                                  │   │
│  │  • monastery360.db                                  │   │
│  │  • Persistent volume                                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```
