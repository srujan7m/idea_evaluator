# Idea Evaluator (Full Stack)

Evaluate startup ideas with a simple, opinionated scoring model, AI Assist, and reports. This repo contains:

- server/ — Express + MongoDB backend (Mongoose), with AI providers and reports
- frontend/ — Next.js (TypeScript) app (shadcn/ui) — complete UX including wizard, charts, and AI panel
- client/ — Plain React (Vite, JS) app — lightweight alternative UI (work in progress)

## Features

- Ideas & Evaluations — CRUD, search, and multi-evaluation per idea
- Scoring — market, moat, monetization, plus composite with weights
- AI Assist — Gemini/OpenAI/Ollama supported via a single endpoint
- Reports — "Best evaluation" per idea, CSV export, compare endpoint (server)
- Charts — Radar chart visualization (frontend)

## Tech Stack

- Backend: Node.js, Express, Mongoose (MongoDB)
- AI: Gemini (preferred), OpenAI, or local Ollama — selectable via env
- Frontend: Next.js + Tailwind/shadcn (TypeScript)
- Alt Frontend: Vite React (JavaScript) using SWR and react-router

## Quick Start

1. Backend

- Copy `server/.env.example` to `server/.env` and fill values (see below)
- Install and run:

```cmd
cd server
npm install
npm run dev
```

Server runs at http://localhost:4000

2. Next.js Frontend (recommended)

```bash
cd frontend
pnpm install
pnpm dev
```

App runs at http://localhost:3000

3. Vite React Client (optional)

```cmd
cd "client"
npm install
npm run dev
```

Client runs at http://localhost:3000 (configurable in `vite.config.js`)

## Environment (server/.env)

- PORT=4000
- MONGODB_URI=mongodb://127.0.0.1:27017/mib_evaluator
- AI_PROVIDER=auto|gemini|openai|ollama
- GEMINI_API_KEY=your_key
- GEMINI_MODEL=gemini-1.5-flash
- OPENAI_API_KEY=your_key
- OLLAMA_URL=http://127.0.0.1:11434
- OLLAMA_MODEL=llama3.1

Notes:

- AI_PROVIDER=auto will prefer Gemini when available, else fall back to OpenAI or Ollama.
- You can force a provider by setting AI_PROVIDER=gemini|openai|ollama.

## API Overview

- GET /health → { ok: true }

Ideas

- GET /api/ideas (q, sort, order)
- POST /api/ideas { title, summary, tags? }
- GET /api/ideas/:id
- PATCH /api/ideas/:id
- DELETE /api/ideas/:id

Evaluations

- GET /api/evaluations/idea/:ideaId
- POST /api/evaluations/idea/:ideaId { scores, weights, notes?, aiInsights? }
- DELETE /api/evaluations/:id

AI Assist

- POST /api/ai/market-insights { summary }
- Returns insights with fields like: segments, ICP, competitors, pricingModels, trendSignals, goToMarket, risks, recommendedWeights, suggestedScores, disclaimers

Reports

- GET /api/reports/best/:ideaId
- GET /api/reports/export.csv
- GET /api/reports/compare?ids=a,b,c

## Scoring Model

- Market: avg(tam, growth, pain, 10 - competition)
- Moat: avg(differentiation, switchingCosts, defensibility, networkEffects)
- Monetization: avg(ltvCac, pricingClarity, grossMargin, 10 - salesCycle)
- Composite: weighted avg of Market/Moat/Monetization

## Development Tips

- Seed dev data:

```cmd
cd server
npm run seed
```

- Update AI provider without code changes by tweaking `server/.env`.
- The Next.js UI uses shadcn components. The AI Assist panel supports large responses (chips, accordions, scroll areas). If the provider returns unexpected fields, expand the Raw JSON section.

## Known Status

- server/: Complete
- frontend/: Complete (TypeScript)
- client/: Functional core pages; wizard AI auto-apply and styling parity with Next.js pending

## Troubleshooting

- If SWR not found: ensure frontend or client deps are installed (pnpm install / npm install)
- AI calls failing: check AI_PROVIDER and API keys in `server/.env`
- CORS issues: server enables CORS by default on http://localhost:3000
