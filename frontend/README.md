# Find My Train — Frontend

Next.js + TypeScript UI for RailGaadi. Talks to the FastAPI backend (see
[`../backend/README.md`](../backend/README.md)) over HTTP — it no longer
has its own server-side `/api/*` routes; all external API integration now
lives in the backend.

See the [repo-level README](../README.md) for the full-stack overview.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16.2 | App Router, client-side rendering |
| [React](https://react.dev/) | 19 | UI rendering |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Utility styling |
| [Framer Motion](https://www.framer.com/motion/) | 12 | Animations |
| [Lucide React](https://lucide.dev/) | 1.28 | Icon set |
| [MapLibre GL](https://maplibre.org/) / [react-map-gl](https://visgl.github.io/react-map-gl/) | 6.1 / 8.1 | Interactive dark maps |
| [@turf/turf](https://turfjs.org/) | 7.3 | Geospatial calculations |
| [TanStack Query](https://tanstack.com/query) | 5 | Server state, caching, refetching |
| [Zustand](https://zustand-demo.pmnd.rs/) | 5 | Global client state (favourites, auto-refresh) |
| [Recharts](https://recharts.org/) | 3.10 | Elevation and speed chart visualisations |

## Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                # Home page (search, browse, saved trains)
│   │   ├── layout.tsx              # Root layout, fonts, metadata
│   │   ├── globals.css
│   │   └── train/[trainId]/
│   │       └── page.tsx            # Live dashboard page
│   ├── components/
│   │   ├── cards/                  # AnalyticsCard, AttractionCard, TrainCard, WeatherCard
│   │   ├── layout/                 # Navbar
│   │   ├── map/                    # TrainMap (MapLibre)
│   │   ├── providers/              # QueryProvider (TanStack Query)
│   │   ├── search/                 # SearchBar
│   │   └── ui/                     # ProgressRing, SkeletonLoader, StatusBadge, Timeline, Toast
│   ├── data/
│   │   ├── mockData.ts             # Fallback mock train & attraction data
│   │   ├── trainDatabase.ts        # Static route database (150+ trains, real coordinates)
│   │   └── trainIndex.ts           # Static searchable index of trains
│   ├── hooks/
│   │   ├── useLiveTracking.ts      # 30s polling of the backend, staleness detection
│   │   └── useTrainRoute.ts        # Derives route stats from a Train object
│   ├── lib/
│   │   ├── apiClient.ts            # apiUrl() — resolves NEXT_PUBLIC_API_URL
│   │   └── utils.ts                # Shared utility functions
│   ├── services/
│   │   ├── railradar.ts            # Calls backend /api/trains/*
│   │   ├── weather.ts              # Calls backend /api/weather
│   │   ├── elevation.ts            # Calls backend /api/elevation
│   │   ├── places.ts               # Calls backend /api/places
│   │   └── geocoding.ts            # Calls MapTiler directly from the browser (not proxied)
│   ├── store/
│   │   └── useTrainStore.ts        # Zustand global state
│   └── types/
│       └── index.ts                # Shared TypeScript interfaces
├── public/                         # PWA manifest, static assets
├── package.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── .env.local.example              # template — copy to .env.local and fill in your values
└── README.md                       # you are here
```

## Setup & Run

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- The backend running (see [`../backend/README.md`](../backend/README.md))
  — the app falls back to mock/cached data if it can't reach the backend,
  but you won't get live data without it

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Then fill in your own values (see table below).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables (`.env.local`)

> **No keys ship with the repo.** `NEXT_PUBLIC_*` vars are baked into the
> browser bundle at build time and are never secret once shipped, but each
> deployer still needs to supply their own — nothing is bundled by default.

| Variable | Default | Required | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Yes | Base URL of the running backend |
| `NEXT_PUBLIC_MAPTILER_API_KEY` | *(none)* | For geocoding & map tiles | [cloud.maptiler.com](https://cloud.maptiler.com/) — free tier. Called directly from the browser, not proxied through the backend |

If the backend isn't running on 8000 (e.g. the port is taken by something
else), start it on a different port and update `NEXT_PUBLIC_API_URL` to
match — see [`../backend/README.md`](../backend/README.md).

## Available Scripts

```bash
npm run dev      # Start local development server (http://localhost:3000)
npm run build    # Build production bundle
npm run start    # Start production server (after build)
npm run lint     # Run ESLint
```

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Home — search bar, saved trains, browse by category, popular trains |
| `/train/[trainId]` | Live dashboard — map, stops timeline, analytics, weather, landmarks |

## Notes

- `node_modules/`, `.next/`, and `.env.local` are gitignored — don't commit them.
- `src/data/*.ts` mirrors `backend/app/repositories/data/*.json` — both hold
  the same static train database, so search/fallback data stays consistent
  whether or not the backend is reachable.

## Troubleshooting

See the [Troubleshooting section](../README.md#troubleshooting) in the
repo-level README.
