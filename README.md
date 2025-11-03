# sekiya-cond (Owner App)

Monorepo (apps/web + apps/mock-api) with docs and test data.

- apps/web: Vite + React + Tailwind + TanStack Query + i18next (PWA-ready)
- apps/mock-api: Express mock endpoints for returns/news/events/me/chat/admin
- docs: Wireframes and OpenAPI (draft)
- data/test: CSV for monthly returns import (room_code, occupancy_pct, payout_yen)

## Dev

- Mock API: cd apps/mock-api && npm i && npm run dev (http://localhost:8081)
- Web: cd apps/web && npm i && npm run dev (http://localhost:5173)
- Set API base: apps/web/.env.local → VITE_API_BASE=http://localhost:8081

## Structure

```
apps/
  web/
  mock-api/
docs/
  openapi.yaml
  wireframes.md
data/
  test/returns-2025-11.csv
```

Note: Set API base by creating `apps/web/.env.local` with:

```
VITE_API_BASE=http://localhost:8081
```
