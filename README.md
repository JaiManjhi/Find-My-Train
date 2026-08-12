<div align="center">

<br/>

# ?? RailGaadi

### Live Indian Train Tracker

**Real-time tracking · Interactive maps · Journey analytics · Station weather · Nearby landmarks**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-6.1-396CB2?logo=maplibre&logoColor=white)](https://maplibre.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

<br/>

</div>

---

## ? Overview

**RailGaadi** is a premium, dark-themed web application for tracking any Indian train in real time. It combines live RailRadar API data with interactive maps, journey analytics, weather forecasts, and geographical landmark discovery — all in a single sleek dashboard.

> Powered by **RailRadar · MapTiler · OpenWeather · OpenTopography · Overpass API**

---

## ??? Features

| Feature | Description |
|---|---|
| ??? **Live Map Tracking** | Interactive MapLibre dark map with animated train marker, glowing route polyline, and camera-follow mode |
| ?? **Journey Analytics** | Elevation profile (via OpenTopography), speed history, delay trends, and station-by-station arrival analysis |
| ?? **Station Weather** | Real-time OpenWeather data for current, next, and destination stations with a 3-day forecast |
| ?? **Landmarks & Places** | Rivers, ghats, bridges, tunnels, wildlife reserves, and monuments along the route (via Overpass API) |
| ?? **Delay Intelligence** | Average delay, on-time percentage, and historical punctuality at each halt |
| ?? **Auto-Refresh** | 30-second polling with exponential-backoff retries, staleness detection, and graceful mock fallbacks |
| ?? **Train Search** | Full-text search across 150+ trains by name, number, origin, or destination |
| ? **Saved Trains** | Favourite and persist trains locally via Zustand store |
| ?? **PWA Ready** | Web manifest, Apple touch icon, viewport meta, and dark theme color for mobile installation |

---

## ??? Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16.2 | App Router, SSR, API routes |
| [React](https://react.dev/) | 19 | UI rendering |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Utility styling |
| [Framer Motion](https://www.framer.com/motion/) | 12 | Animations |
| [Lucide React](https://lucide.dev/) | 1.28 | Icon set |

### Maps & Geo
| Technology | Version | Purpose |
|---|---|---|
| [MapLibre GL](https://maplibre.org/) | 6.1 | Render interactive dark maps |
| [react-map-gl](https://visgl.github.io/react-map-gl/) | 8.1 | React wrapper for MapLibre |
| [@turf/turf](https://turfjs.org/) | 7.3 | Geospatial calculations |

### Data & State
| Technology | Version | Purpose |
|---|---|---|
| [TanStack Query](https://tanstack.com/query) | 5 | Server state, caching, and refetching |
| [Zustand](https://zustand-demo.pmnd.rs/) | 5 | Global client state (favourites, auto-refresh) |
| [Recharts](https://recharts.org/) | 3.10 | Elevation and speed chart visualizations |

### External APIs
| API | Usage |
|---|---|
| [RailRadar](https://railradar.in/) | Live train position and running status |
| [OpenWeather](https://openweathermap.org/api) | Station weather and 3-day forecast |
| [MapTiler](https://www.maptiler.com/) | Dark map tiles |
| [OpenTopography](https://opentopography.org/) | Elevation data along the route |
| [Overpass API](https://overpass-api.de/) | Nearby geographical landmarks (OSM) |

---

## ?? Project Structure

```
railgadi/
+-- public/
¦   +-- manifest.json             # PWA manifest
+-- src/
¦   +-- app/
¦   ¦   +-- api/
¦   ¦   ¦   +-- elevation/        # Proxy ? OpenTopography
¦   ¦   ¦   +-- places/           # Proxy ? Overpass API
¦   ¦   ¦   +-- trains/[id]/status/ # Proxy ? RailRadar
¦   ¦   ¦   +-- trains/search/    # Train search endpoint
¦   ¦   ¦   +-- weather/          # Proxy ? OpenWeather
¦   ¦   +-- train/[trainId]/      # Live dashboard page
¦   ¦   +-- globals.css
¦   ¦   +-- layout.tsx            # Root layout with fonts & metadata
¦   ¦   +-- page.tsx              # Home page (search, browse, saved)
¦   +-- components/
¦   ¦   +-- cards/
¦   ¦   ¦   +-- AnalyticsCard.tsx # Speed, elevation, delay charts
¦   ¦   ¦   +-- AttractionCard.tsx# Nearby landmark card
¦   ¦   ¦   +-- TrainCard.tsx     # Train summary card
¦   ¦   ¦   +-- WeatherCard.tsx   # Station weather card
¦   ¦   +-- layout/
¦   ¦   ¦   +-- Navbar.tsx        # Sticky top navigation bar
¦   ¦   +-- map/
¦   ¦   ¦   +-- TrainMap.tsx      # MapLibre interactive map
¦   ¦   +-- providers/
¦   ¦   ¦   +-- QueryProvider.tsx # TanStack Query client provider
¦   ¦   +-- search/
¦   ¦   ¦   +-- SearchBar.tsx     # Live train search input
¦   ¦   +-- ui/
¦   ¦       +-- ProgressRing.tsx  # Circular progress indicator
¦   ¦       +-- SkeletonLoader.tsx# Loading skeleton screens
¦   ¦       +-- StatusBadge.tsx   # On-time / delayed badge
¦   ¦       +-- Timeline.tsx      # Station arrival timeline
¦   ¦       +-- Toast.tsx         # Notification toast
¦   +-- data/
¦   ¦   +-- mockData.ts           # Fallback mock train & attraction data
¦   ¦   +-- trainIndex.ts         # Static database of 150+ Indian trains
¦   +-- hooks/
¦   ¦   +-- useLiveTracking.ts    # 30s polling, staleness detection
¦   ¦   +-- useTrainRoute.ts      # Route stats computation
¦   +-- lib/
¦   ¦   +-- utils.ts              # Shared utility functions
¦   +-- services/
¦   ¦   +-- elevation.ts          # OpenTopography elevation fetch
¦   ¦   +-- geocoding.ts          # Coordinate ? place name
¦   ¦   +-- places.ts             # Overpass landmark lookup
¦   ¦   +-- railradar.ts          # RailRadar search & live status
¦   ¦   +-- weather.ts            # OpenWeather current + forecast
¦   +-- store/
¦   ¦   +-- useTrainStore.ts      # Zustand global state
¦   +-- types/
¦       +-- index.ts              # Shared TypeScript interfaces
+-- .env.example                  # Environment variable template
+-- next.config.ts
+-- tailwind.config.ts
+-- tsconfig.json
```

---

## ?? Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- API keys for the external services listed below

### 1. Clone the repository

```bash
git clone https://github.com/JaiManjhi/Find-My-Train.git
cd Find-My-Train
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your API keys:

```bash
cp .env.example .env.local
```

```env
# .env.local

RAILRADAR_API_KEY=your_railradar_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
MAPTILER_API_KEY=your_maptiler_api_key_here
OPENTOPOGRAPHY_API_KEY=your_opentopography_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Tip:** All API proxies live under `src/app/api/`. If a key is missing or a request fails, the app gracefully falls back to mock/cached data so it still runs without all keys.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ?? API Keys — Where to Get Them

| Key | Where to Get |
|---|---|
| `RAILRADAR_API_KEY` | [railradar.in](https://railradar.in/) — sign up for API access |
| `OPENWEATHER_API_KEY` | [openweathermap.org/api](https://openweathermap.org/api) — free tier available |
| `MAPTILER_API_KEY` | [cloud.maptiler.com](https://cloud.maptiler.com/) — free tier available |
| `OPENTOPOGRAPHY_API_KEY` | [opentopography.org](https://opentopography.org/) — free registration |

---

## ?? Available Scripts

```bash
npm run dev      # Start local development server (http://localhost:3000)
npm run build    # Build production bundle
npm run start    # Start production server (after build)
npm run lint     # Run ESLint
```

---

## ??? Pages & Routes

| Route | Description |
|---|---|
| `/` | Home — search bar, saved trains, browse by category, popular trains |
| `/train/[trainId]` | Live dashboard — map, stops timeline, analytics, weather, landmarks |

---

## ?? Live Dashboard Tabs

Once you open a train's detail page, five tabs are available:

1. **Live Map** — MapLibre dark map with the animated train marker, route polyline, journey progress ring, current station, next stop ETA, and speed bar
2. **Stops** — Full station timeline with actual vs scheduled arrival times and delay indicators
3. **Analytics** — Elevation profile chart, speed history, delay trend, and punctuality stats
4. **Weather** — Side-by-side weather cards for the current, next, and destination stations
5. **Places** — Nearby rivers, bridges, tunnels, monuments, and landmarks via OpenStreetMap / Overpass

---

## ?? Architecture Highlights

### Resilient Data Layer
Every API call uses **exponential-backoff retries** (3 attempts, 300 ms base delay) and falls back to rich mock data when the network is unavailable — the UI never shows a blank page.

### Live Polling
`useLiveTracking` polls the RailRadar proxy every **30 seconds**. A **2-minute staleness timer** triggers a warning banner if auto-refresh is paused or the network is slow.

### Offline-First Search
Train search is served entirely from the **local `trainIndex.ts` database** (150+ trains), so search is instant, offline-capable, and never rate-limited.

### State Management
- **TanStack Query** — server-side data with automatic caching, refetching, and background updates
- **Zustand** — lightweight client state for favourites, auto-refresh toggle, and selected train

---

## ?? Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## ?? License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ?? for Indian Railways enthusiasts

**RailGaadi** · Powered by RailRadar · MapTiler · OpenWeather · OpenTopography · Overpass API

</div>
