'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SearchBar from '@/components/search/SearchBar';
import { useTrainStore } from '@/store/useTrainStore';
import { INDIAN_TRAINS_DATABASE } from '@/data/trainIndex';
import { SearchResult } from '@/types';
import {
  Train, Map, Activity, CloudSun, Star, Clock, Search,
  ArrowRight, Zap, Radio, TrendingUp, ChevronRight, Trash2,
  MapPin, Shield, BarChart2, Navigation, X,
} from 'lucide-react';

/* ─── colour tokens (single source of truth) ──────────────── */
const C = {
  base:    '#080C14',
  surface: '#0E1420',
  card:    '#131A26',
  border:  '#1E2A3A',
  hover:   '#1A2436',
  blue:    '#3B82F6',
  cyan:    '#06B6D4',
  green:   '#10B981',
  amber:   '#F59E0B',
  purple:  '#8B5CF6',
  red:     '#EF4444',
  text:    '#F1F5F9',
  muted:   '#94A3B8',
  dim:     '#3F5169',
};

/* ─── Feature cards data ────────────────────────────────── */
const FEATURES = [
  { icon: Map,      color: C.blue,   glow: '#3B82F620', title: 'Live Map Tracking',    desc: 'Real-time MapTiler dark map with animated train marker, glow route lines, and camera follow mode.' },
  { icon: Activity, color: C.purple, glow: '#8B5CF620', title: 'Journey Analytics',    desc: 'Elevation profile, speed history, delay trends, and station-by-station arrival analysis.' },
  { icon: CloudSun, color: C.cyan,   glow: '#06B6D420', title: 'Station Weather',      desc: 'Live OpenWeather data for current, next, and destination stations with 3-day forecast.' },
  { icon: MapPin,   color: C.amber,  glow: '#F59E0B20', title: 'Landmarks & Places',   desc: 'Rivers, ghats, bridges, tunnels, wildlife reserves, and monuments along the route.' },
  { icon: BarChart2,color: C.green,  glow: '#10B98120', title: 'Delay Intelligence',   desc: 'Average delay calculation, on-time percentage, and historical punctuality at each halt.' },
  { icon: Shield,   color: C.red,    glow: '#EF444420', title: 'Reliable Data',        desc: 'RailRadar-backed live data with 30-second auto-refresh, staleness detection, and graceful fallbacks.' },
];

/* ─── Train category chips ──────────────────────────────── */
const CATEGORIES = ['All', 'Rajdhani', 'Shatabdi', 'Vande Bharat', 'Duronto', 'Express', 'Narmada'];

export default function HomePage() {
  const router = useRouter();
  const { recentSearches, favouriteTrainIds, toggleFavourite, addRecentSearch } = useTrainStore();
  const [activeCategory, setActiveCategory] = useState('All');

  const handleSelectTrain = (result: SearchResult) => {
    addRecentSearch(result.trainNumber);
    router.push(`/train/${result.trainNumber}`);
  };

  /* Saved trains derived from store */
  const savedTrains = INDIAN_TRAINS_DATABASE.filter(t =>
    favouriteTrainIds.includes(t.trainNumber)
  );

  /* Category-filtered quick-browse trains */
  const browsedTrains = INDIAN_TRAINS_DATABASE.filter(t => {
    if (activeCategory === 'All') return true;
    return t.trainName.toLowerCase().includes(activeCategory.toLowerCase());
  }).slice(0, 18);

  /* Recent search info */
  const recentTrainInfo = recentSearches
    .map(num => INDIAN_TRAINS_DATABASE.find(t => t.trainNumber === num))
    .filter(Boolean) as SearchResult[];

  return (
    <div style={{ minHeight: '100vh', background: C.base, color: C.text, fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ══════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════ */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: `${C.base}EE`, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${C.blue}, ${C.cyan})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Train style={{ width: 18, height: 18, color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1 }}>
                Rail<span style={{ color: C.blue }}>Gaadi</span>
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: C.green, marginLeft: 4, verticalAlign: 'middle' }} />
              </div>
              <div style={{ fontSize: 9, color: C.dim, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.2 }}>Live Tracker</div>
            </div>
          </div>

          {/* Desktop search */}
          <div style={{ flex: 1, maxWidth: 440, display: 'none' }} className="md:block">
            <SearchBar onSelectTrain={handleSelectTrain} placeholder="Search any train…" />
          </div>

          {/* Right badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: C.green }}>
              <Radio style={{ width: 11, height: 11 }} />
              Live
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: C.amber }}>
              <Star style={{ width: 11, height: 11, fill: C.amber }} />
              {favouriteTrainIds.length} Saved
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px 60px' }}>

        {/* ══════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════ */}
        <section style={{ padding: '72px 0 56px', textAlign: 'center' }}>
          {/* Live badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, border: `1px solid ${C.blue}50`, background: `${C.blue}12`, fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: C.blue, marginBottom: 28 }}>
            <Zap style={{ width: 12, height: 12 }} />
            Powered by RailRadar · 150+ Trains · Live Data
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05, margin: '0 0 20px', maxWidth: 800, marginInline: 'auto' }}>
            Track Any Indian Train
            <br />
            <span style={{ backgroundImage: `linear-gradient(135deg, ${C.blue}, ${C.cyan})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              in Real Time
            </span>
          </h1>

          <p style={{ fontSize: 17, color: C.muted, maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Live location · Interactive maps · Weather · Elevation analytics · Nearby landmarks
          </p>

          {/* Mobile search */}
          <div style={{ maxWidth: 560, margin: '0 auto 20px' }}>
            <SearchBar onSelectTrain={handleSelectTrain} />
          </div>

          {/* Recent searches */}
          {recentTrainInfo.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              <span style={{ fontSize: 12, color: C.dim, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock style={{ width: 11, height: 11 }} /> Recent:
              </span>
              {recentTrainInfo.map(t => (
                <button
                  key={t.trainNumber}
                  onClick={() => handleSelectTrain(t)}
                  style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.card, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: C.blue, cursor: 'pointer' }}
                >
                  #{t.trainNumber} {t.trainName.split(' ').slice(0, 2).join(' ')}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════
            SAVED / FAVOURITE TRAINS
        ══════════════════════════════════════════════ */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Star style={{ width: 18, height: 18, color: C.amber, fill: C.amber }} />
                Saved Trains
              </h2>
              <p style={{ fontSize: 12, color: C.dim, margin: '4px 0 0', fontFamily: 'JetBrains Mono, monospace' }}>
                {savedTrains.length} train{savedTrains.length !== 1 ? 's' : ''} saved · tap to track live
              </p>
            </div>
          </div>

          {savedTrains.length === 0 ? (
            <div style={{ padding: '32px 24px', borderRadius: 14, border: `1px dashed ${C.border}`, background: C.surface, textAlign: 'center', color: C.dim }}>
              <Star style={{ width: 32, height: 32, margin: '0 auto 10px', opacity: 0.4 }} />
              <p style={{ fontSize: 14, margin: 0 }}>No saved trains yet</p>
              <p style={{ fontSize: 12, margin: '6px 0 0' }}>Search and tap ★ on any train to save it here</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {savedTrains.map(train => (
                <div
                  key={train.trainNumber}
                  style={{ borderRadius: 14, border: `1px solid ${C.border}`, background: C.card, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.15s' }}
                  onClick={() => handleSelectTrain(train)}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = C.blue)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
                >
                  {/* Top colour band */}
                  <div style={{ height: 3, background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})` }} />

                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: C.blue, background: `${C.blue}18`, border: `1px solid ${C.blue}40`, padding: '2px 7px', borderRadius: 4 }}>
                            #{train.trainNumber}
                          </span>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6, lineHeight: 1.3 }}>
                          {train.trainName}
                        </div>
                        <div style={{ fontSize: 11, color: C.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{train.origin.split('(')[0].trim()}</span>
                          <ArrowRight style={{ width: 10, height: 10, flexShrink: 0 }} />
                          <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{train.destination.split('(')[0].trim()}</span>
                        </div>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); toggleFavourite(train.trainNumber); }}
                        style={{ padding: 6, borderRadius: 8, border: `1px solid ${C.amber}50`, background: `${C.amber}15`, cursor: 'pointer', flexShrink: 0 }}
                        title="Remove from saved"
                      >
                        <Trash2 style={{ width: 13, height: 13, color: C.amber }} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: 11, color: C.dim, fontFamily: 'JetBrains Mono, monospace' }}>
                        Dep {train.departureTime} · Arr {train.arrivalTime}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: C.blue }}>
                        Track <ChevronRight style={{ width: 12, height: 12 }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════
            BROWSE TRAINS (Category Filter)
        ══════════════════════════════════════════════ */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Search style={{ width: 18, height: 18, color: C.blue }} />
                Browse Trains
              </h2>
              <p style={{ fontSize: 12, color: C.dim, margin: '4px 0 0', fontFamily: 'JetBrains Mono, monospace' }}>
                {INDIAN_TRAINS_DATABASE.length}+ trains indexed · real-time searchable
              </p>
            </div>

            {/* Category chips */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    border: `1px solid ${activeCategory === cat ? C.blue : C.border}`,
                    background: activeCategory === cat ? `${C.blue}20` : C.card,
                    color: activeCategory === cat ? C.blue : C.muted,
                    fontFamily: 'JetBrains Mono, monospace',
                    transition: 'all 0.15s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
            {browsedTrains.map(train => (
              <button
                key={train.trainNumber}
                onClick={() => handleSelectTrain(train)}
                style={{ textAlign: 'left', padding: '12px 14px', borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, cursor: 'pointer', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', gap: 5 }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.blue;
                  (e.currentTarget as HTMLElement).style.background = C.hover;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.border;
                  (e.currentTarget as HTMLElement).style.background = C.card;
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: C.blue }}>
                    #{train.trainNumber}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); toggleFavourite(train.trainNumber); }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}
                  >
                    <Star style={{ width: 12, height: 12, color: C.amber, fill: favouriteTrainIds.includes(train.trainNumber) ? C.amber : 'none' }} />
                  </button>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {train.trainName}
                </div>
                <div style={{ fontSize: 10, color: C.dim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {train.origin.split('(')[0].trim()} → {train.destination.split('(')[0].trim()}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FEATURES GRID
        ══════════════════════════════════════════════ */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.5px' }}>
              Everything You Need for Your Journey
            </h2>
            <p style={{ fontSize: 15, color: C.muted, margin: 0 }}>Premium features powered by real-time APIs</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {FEATURES.map(({ icon: Icon, color, glow, title, desc }) => (
              <div
                key={title}
                style={{ padding: '22px 20px', borderRadius: 16, border: `1px solid ${C.border}`, background: C.card, position: 'relative', overflow: 'hidden' }}
              >
                {/* Glow accent */}
                <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: glow, filter: 'blur(30px)', pointerEvents: 'none' }} />

                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, position: 'relative' }}>
                  <Icon style={{ width: 20, height: 20, color }} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>{title}</h3>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            STATS BAND
        ══════════════════════════════════════════════ */}
        <section style={{ borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, padding: '28px 0', marginBottom: 56 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 0 }}>
            {[
              { label: 'Trains Indexed',  value: '150+',   color: C.blue,   icon: Train },
              { label: 'Live API Refresh', value: '30 sec', color: C.green,  icon: Radio },
              { label: 'Stations Mapped', value: '7,000+', color: C.purple, icon: MapPin },
              { label: 'Routes Covered',  value: 'All India',color: C.cyan,  icon: Navigation },
            ].map(({ label, value, color, icon: Icon }, i, arr) => (
              <div
                key={label}
                style={{
                  padding: '16px 24px', textAlign: 'center',
                  borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
                }}
              >
                <Icon style={{ width: 20, height: 20, color, margin: '0 auto 8px', display: 'block' }} />
                <div style={{ fontSize: 22, fontWeight: 800, color: C.text, fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
                <div style={{ fontSize: 11, color: C.dim, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            QUICK LAUNCH — POPULAR
        ══════════════════════════════════════════════ */}
        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp style={{ width: 18, height: 18, color: C.green }} />
            Popular Right Now
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
            {[
              { trainNumber: '12951', trainName: 'Mumbai Rajdhani', category: 'Rajdhani', color: C.blue },
              { trainNumber: '22436', trainName: 'Vande Bharat (Varanasi)', category: 'Vande Bharat', color: C.cyan },
              { trainNumber: '12002', trainName: 'Bhopal Shatabdi', category: 'Shatabdi', color: C.purple },
              { trainNumber: '11201', trainName: 'Narmada Express', category: 'Express', color: C.green },
              { trainNumber: '12049', trainName: 'Gatimaan Express', category: 'Superfast', color: C.amber },
              { trainNumber: '12903', trainName: 'Golden Temple Mail', category: 'Mail', color: C.red },
              { trainNumber: '12622', trainName: 'Tamil Nadu Express', category: 'Express', color: C.blue },
              { trainNumber: '12301', trainName: 'Howrah Rajdhani', category: 'Rajdhani', color: C.cyan },
            ].map(({ trainNumber, trainName, category, color }) => (
              <button
                key={trainNumber}
                onClick={() => handleSelectTrain({ trainNumber, trainName, origin: '', destination: '', runsOnDays: [], departureTime: '', arrivalTime: '' })}
                style={{ textAlign: 'left', padding: '14px', borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, cursor: 'pointer', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', gap: 6 }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = color;
                  (e.currentTarget as HTMLElement).style.background = C.hover;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.border;
                  (e.currentTarget as HTMLElement).style.background = C.card;
                }}
              >
                <div style={{ height: 2, borderRadius: 999, background: `linear-gradient(90deg, ${color}, transparent)` }} />
                <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color, fontWeight: 700 }}>
                  #{trainNumber} · {category}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.3 }}>{trainName}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: C.muted, marginTop: 2 }}>
                  Track live <ArrowRight style={{ width: 10, height: 10 }} />
                </div>
              </button>
            ))}
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '20px 0', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: C.dim, fontFamily: 'JetBrains Mono, monospace', margin: 0 }}>
          RailGaadi · RailRadar · MapTiler · OpenWeather · OpenTopography · Overpass API
        </p>
      </footer>
    </div>
  );
}
