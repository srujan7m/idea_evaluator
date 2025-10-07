# MIB Startup Idea Evaluator — Backend (MERN)

Express + MongoDB backend for a dynamic Startup Idea Evaluator. It manages ideas, evaluations, scoring, and an optional AI Assist endpoint for market insights.

## Tech

- Node.js + Express
- MongoDB (local) via Mongoose
- Optional AI: OpenAI (gpt-4o-mini) or local Ollama (llama3.1)

## Quick start (Windows)

1. Install MongoDB Community and ensure it runs locally or use Docker.
2. Copy `.env.example` to `.env` and adjust as needed.
3. Install deps and run the server (dev reload):

```cmd
cd server
npm i
npm run dev
```

Server runs on http://localhost:4000

### Environment

- PORT=4000
- MONGODB_URI=mongodb://127.0.0.1:27017/mib_evaluator
- GEMINI_API_KEY= (optional)
- GEMINI_MODEL=gemini-1.5-flash (optional)
- AI_PROVIDER=auto|gemini|openai|ollama (optional, default auto)
- OPENAI_API_KEY= (optional)
- OLLAMA_URL=http://127.0.0.1:11434 (optional)
- OLLAMA_MODEL=llama3.1

## API

Health

- GET /health → { ok: true }

Ideas

- GET /api/ideas?q=fintech&sort=updatedAt&order=desc
- POST /api/ideas { title, summary, tags?: string[] }
- GET /api/ideas/:id
- PATCH /api/ideas/:id { title?, summary?, tags? }
- DELETE /api/ideas/:id

Evaluations

- GET /api/evaluations/idea/:ideaId
- POST /api/evaluations/idea/:ideaId

```json
{
  "scores": {
    "tam": 7,
    "growth": 8,
    "pain": 6,
    "competition": 5,
    "differentiation": 6,
    "switchingCosts": 4,
    "defensibility": 3,
    "networkEffects": 2,
    "ltvCac": 6,
    "pricingClarity": 7,
    "grossMargin": 7,
    "salesCycle": 5
  },
  "weights": { "market": 0.33, "moat": 0.33, "monetization": 0.34 },
  "notes": "Notes...",
  "aiInsights": { "segments": ["SMB"] }
}
```

- DELETE /api/evaluations/:id

AI Assist

- POST /api/ai/market-insights { summary }
  - Returns: `{ insights: { segments[], icp[], competitors[], pricingModels[], trendSignals[], goToMarket[], risks[], recommendedWeights, suggestedScores, disclaimers[] } }`
  - Provider priority: Gemini (GEMINI_API_KEY) > OpenAI (OPENAI_API_KEY) > Ollama (local)
  - Gemini setup: set GEMINI_API_KEY and optional GEMINI_MODEL (default gemini-1.5-flash)
  - Force provider: set AI_PROVIDER=gemini|openai|ollama (overrides auto)

## Scoring model

- Market = avg(tam, growth, pain, 10 - competition)
- Moat = avg(differentiation, switchingCosts, defensibility, networkEffects)
- Monetization = avg(ltvCac, pricingClarity, grossMargin, 10 - salesCycle)
- Composite = market*wM + moat*wMoat + monetization\*wMon

## Notes

- Frontend not included here; use the API contract above.
- Keep responses small and fast. Limit list endpoints to 200 items.

## Reports

- GET /api/reports/best/:ideaId → { idea, evaluation | null, recommendations: string[] }
- GET /api/reports/export.csv → CSV of best evaluations per idea

## Seed data

Populate the database with 2 sample ideas and evaluations:

```cmd
cd server
npm run seed
```
