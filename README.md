<div align="center">

<br/>

# RailGaadi

### Live Indian Train Tracker

**Real-time tracking · Interactive maps · Journey analytics · Station weather · Nearby landmarks**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-6.1-396CB2?logo=maplibre&logoColor=white)](https://maplibre.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

<br/>

</div>

---

## Overview

**RailGaadi** is a premium, dark-themed web application for tracking any Indian train in real time. It combines live RailRadar API data with interactive maps, journey analytics, weather forecasts, and geographical landmark discovery — all in a single sleek dashboard.

The app is split into two independent projects: a **FastAPI/Python backend** that owns all external API integration and the static train database, and a **Next.js/TypeScript frontend** that renders the UI and talks to the backend over HTTP.

> Powered by **RailRadar · MapTiler · OpenWeather · OpenTopography · Overpass API**

---

## Features

| Feature | Description |
|---|---|
| **Live Map Tracking** | Interactive MapLibre dark map with animated train marker, glowing route polyline, and camera-follow mode |
| **Journey Analytics** | Elevation profile (via OpenTopography), speed history, delay trends, and station-by-station arrival analysis |
| **Station Weather** | Real-time OpenWeather data for current, next, and destination stations with a 3-day forecast |
| **Landmarks & Places** | Rivers, ghats, bridges, tunnels, wildlife reserves, and monuments along the route (via Overpass API) |
| **Delay Intelligence** | Average delay, on-time percentage, and historical punctuality at each halt |
| **Auto-Refresh** | 30-second polling with exponential-backoff retries, staleness detection, and graceful mock fallbacks |
| **Train Search** | Full-text search across 150+ trains by name, number, origin, or destination |
| **Saved Trains** | Favourite and persist trains locally via Zustand store |
| **PWA Ready** | Web manifest, Apple touch icon, viewport meta, and dark theme colour for mobile installation |

---

## Tech Stack

### Frontend (`frontend/`)

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

### Backend (`backend/`)

| Technology | Version | Purpose |
|---|---|---|
| [FastAPI](https://fastapi.tiangolo.com/) | 0.115 | HTTP API framework |
| [Python](https://www.python.org/) | 3.11+ | Runtime |
| [Pydantic](https://docs.pydantic.dev/) | 2.10 | Data models & validation |
| [pydantic-settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/) | 2.7 | Env-var driven configuration |
| [httpx](https://www.python-httpx.org/) | 0.28 | Async HTTP client for upstream APIs |
| [uvicorn](https://www.uvicorn.org/) | 0.34 | ASGI server |

### External APIs

| API | Usage | Called from |
|---|---|---|
| [RailRadar](https://railradar.in/) | Live train position and running status | `backend` |
| [OpenWeather](https://openweathermap.org/api) | Station weather and forecast | `backend` |
| [OpenTopography](https://opentopography.org/) | Elevation data along the route | `backend` |
| [Overpass API](https://overpass-api.de/) | Nearby geographical landmarks (OSM) | `backend` |
| [MapTiler](https://www.maptiler.com/) | Dark map tiles & station geocoding | `frontend` (browser-direct) |

---

## Project Structure

```
Find-My-Train/
├── backend/                      # FastAPI + Python API — see backend/README.md
│   ├── app/
│   │   ├── core/                 # settings (env vars, CORS)
│   │   ├── models/                # domain Pydantic models (Train, Station, ...)
│   │   ├── schemas/               # API-facing request/response schemas
│   │   ├── repositories/          # static train database + mock fallback data
│   │   ├── services/               # business logic + external API calls
│   │   ├── routes/                # FastAPI routers (trains, weather, elevation, places)
│   │   ├── utils/                 # shared helpers (TTL cache, ...)
│   │   └── main.py                # app entrypoint
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── frontend/                     # Next.js + TypeScript UI — see frontend/README.md
│   ├── src/
│   │   ├── app/                   # App Router pages (/, /train/[trainId])
│   │   ├── components/            # cards, layout, map, providers, search, ui
│   │   ├── data/                  # static train database + mock fallback data
│   │   ├── hooks/                 # useLiveTracking, useTrainRoute
│   │   ├── lib/                   # apiClient.ts — backend base URL helper
│   │   ├── services/               # fetch wrappers for the backend + geocoding
│   │   ├── store/                 # zustand store
│   │   └── types/                  # shared TypeScript types
│   ├── public/                   # PWA manifest, static assets
│   ├── package.json
│   ├── .env.local.example
│   └── README.md
│
├── .vscode/settings.json         # points the Python interpreter at backend/.venv
├── .gitignore
└── README.md                     # you are here
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- **Python** 3.11+
- Your own API keys for the external services below (optional — every
  feature falls back to mock/cached data if a key is missing or a request
  fails, so the app still runs without any keys)

### 1. Clone the repository

```bash
git clone https://github.com/JaiManjhi/Find-My-Train.git
cd Find-My-Train
```

### 2. Start the backend

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate   # or: source .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
cp .env.example .env     # fill in your own API keys — see below
uvicorn app.main:app --reload --port 8000
```

Full details: [`backend/README.md`](backend/README.md).

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL to the backend URL
npm run dev
```

Full details: [`frontend/README.md`](frontend/README.md).

### 4. Open the app

[http://localhost:3000](http://localhost:3000) — the frontend calls the
backend at whatever `NEXT_PUBLIC_API_URL` is set to (default
`http://localhost:8000`).

> If port 8000 is already taken on your machine, start the backend on a
> different port (`--port 8010`) and update `NEXT_PUBLIC_API_URL` to match.

---

## API Keys — Where to Get Them

No API keys ship with this repo — clone it, get your own free-tier keys
from the links below, and put them in `backend/.env` / `frontend/.env.local`
(never committed — both are gitignored). Without a key, that feature falls
back to mock/static data instead of breaking.

| Key | Set in | Where to Get |
|---|---|---|
| `RAILRADAR_API_KEY` | `backend/.env` | [railradar.in](https://railradar.in/) — sign up for API access |
| `OPENWEATHER_API_KEY` | `backend/.env` | [openweathermap.org/api](https://openweathermap.org/api) — free tier available |
| `OPENTOPOGRAPHY_API_KEY` | `backend/.env` | [opentopography.org](https://opentopography.org/) — free registration |
| `NEXT_PUBLIC_MAPTILER_API_KEY` | `frontend/.env.local` | [cloud.maptiler.com](https://cloud.maptiler.com/) — free tier available |
| `NEXT_PUBLIC_API_URL` | `frontend/.env.local` | URL of the running backend, e.g. `http://localhost:8000` |

---

## Available Scripts

Run from `frontend/`:

```bash
npm run dev      # Start local development server (http://localhost:3000)
npm run build    # Build production bundle
npm run start    # Start production server (after build)
npm run lint     # Run ESLint
```

Run from `backend/`:

```bash
uvicorn app.main:app --reload --port 8000   # Start local dev server
```

---

## API Endpoints (backend)

| Route | Description |
|---|---|
| `GET /api/trains/search?q=` | Search trains by name, number, origin, or destination |
| `GET /api/trains/{id}/status` | Live train position and status (falls back to static route data) |
| `GET /api/weather?lat=&lon=` | Current weather for a coordinate |
| `GET /api/elevation?locations=` | Elevation profile for a list of coordinates |
| `GET /api/places?lat=&lon=&radius=` | Nearby landmarks around a coordinate |
| `GET /health` | Health check |

---

## Pages & Routes (frontend)

| Route | Description |
|---|---|
| `/` | Home — search bar, saved trains, browse by category, popular trains |
| `/train/[trainId]` | Live dashboard — map, stops timeline, analytics, weather, landmarks |

---

## Live Dashboard Tabs

Once you open a train's detail page, five tabs are available:

1. **Live Map** — MapLibre dark map with animated train marker, route polyline, journey progress ring, current station, next stop ETA, and speed bar
2. **Stops** — Full station timeline with actual vs scheduled arrival times and delay indicators
3. **Analytics** — Elevation profile chart, speed history, delay trend, and punctuality stats
4. **Weather** — Side-by-side weather cards for the current, next, and destination stations
5. **Places** — Nearby rivers, bridges, tunnels, monuments, and landmarks via OpenStreetMap / Overpass

---

## Architecture Highlights

### Resilient Data Layer

Every external API call (in the backend's `services/` layer) is wrapped in
a try/except and falls back to rich mock/static data when the upstream API
or network is unavailable — the UI never shows a blank page. The frontend
additionally retries failed backend calls with **exponential backoff** (3
attempts, 300 ms base delay).

### Live Polling

`useLiveTracking` polls the backend's `/api/trains/{id}/status` endpoint
every **30 seconds**. A **2-minute staleness timer** triggers a warning
banner if auto-refresh is paused or the network is slow.

### Offline-First Search

Train search is served entirely from a **local static database** (150+
trains) — mirrored in both `backend/app/repositories/data/` and
`frontend/src/data/` — so search is instant, offline-capable, and never
rate-limited.

### State Management

- **TanStack Query** — server-side data with automatic caching, refetching, and background updates
- **Zustand** — lightweight client state for favourites, auto-refresh toggle, and selected train

---

## Troubleshooting

- **Frontend shows a crash reading `train.currentStation`** — the backend
  isn't reachable at `NEXT_PUBLIC_API_URL`, or something else is running
  on that port. Confirm `curl http://localhost:8000/health` returns
  `{"status":"ok"}`, and that it's *this* backend, not an unrelated
  process/container bound to the same port.
- **Live data never appears, only mock data** — one or more API keys are
  missing or invalid in `backend/.env`. Check the backend terminal for
  logged errors, and see [API Keys](#api-keys--where-to-get-them) above.
- **Editor shows unresolved Python imports** — point your IDE's Python
  interpreter at `backend/.venv/Scripts/python.exe` (or
  `backend/.venv/bin/python` on macOS/Linux). A `.vscode/settings.json` is
  already committed to do this automatically in VS Code.

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with love for Indian Railways enthusiasts

**RailGaadi** · Powered by RailRadar · MapTiler · OpenWeather · OpenTopography · Overpass API

</div>
