'use client';

import { useState } from 'react';
import { Attraction } from '@/types';
import { Landmark, Compass, Mountain, Navigation, MapPin, Waves, Building2, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORY_CONFIG: Record<string, { icon: typeof Landmark; color: string; bg: string }> = {
  River:    { icon: Waves,     color: '#007AFF', bg: 'rgba(0,122,255,0.1)' },
  Bridge:   { icon: Landmark,  color: '#007AFF', bg: 'rgba(0,122,255,0.1)' },
  Mountain: { icon: Mountain,  color: '#A855F7', bg: 'rgba(168,85,247,0.1)' },
  Ghat:     { icon: Mountain,  color: '#A855F7', bg: 'rgba(168,85,247,0.1)' },
  Tunnel:   { icon: Compass,   color: '#FFB000', bg: 'rgba(255,176,0,0.1)' },
  Monument: { icon: Building2, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  City:     { icon: MapPin,    color: '#94A3B8', bg: 'rgba(148,163,184,0.1)' },
};

interface AttractionCardProps {
  attraction: Attraction;
}

export default function AttractionCard({ attraction }: AttractionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cfg = CATEGORY_CONFIG[attraction.category] || CATEGORY_CONFIG.City;
  const Icon = cfg.icon;

  return (
    <div
      className="rounded-xl border transition-all hover:border-[#007AFF] group"
      style={{ background: '#161B22', borderColor: '#1F2937' }}
    >
      {/* ── Header ── */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            style={{
              width: 36, height: 36, borderRadius: 8,
              background: cfg.bg, border: `1px solid ${cfg.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <Icon style={{ width: 16, height: 16, color: cfg.color }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40` }}
              >
                {attraction.category}
              </span>
              <span
                className="text-[10px] font-mono flex items-center gap-1"
                style={{ color: '#4B5563' }}
              >
                <Navigation style={{ width: 10, height: 10 }} />
                {attraction.distanceFromTrackKm} km
              </span>
            </div>
            <h5
              className="font-semibold text-sm text-white group-hover:text-[#007AFF] transition-colors"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {attraction.name}
            </h5>
          </div>
        </div>

        {/* Description */}
        <p
          className={`text-xs leading-relaxed transition-all ${expanded ? '' : 'line-clamp-2'}`}
          style={{ color: '#94A3B8' }}
        >
          {attraction.description}
        </p>
      </div>

      {/* ── Footer ── */}
      <div
        className="px-4 py-2.5 border-t flex items-center justify-between"
        style={{ borderColor: '#1F2937' }}
      >
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#4B5563', fontFamily: 'JetBrains Mono, monospace' }}>
          <MapPin style={{ width: 11, height: 11 }} />
          {attraction.latitude.toFixed(3)}°N, {attraction.longitude.toFixed(3)}°E
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] font-mono flex items-center gap-1 transition-colors"
          style={{ color: '#94A3B8' }}
        >
          {expanded ? (
            <>Less <ChevronUp style={{ width: 12, height: 12 }} /></>
          ) : (
            <>More <ChevronDown style={{ width: 12, height: 12 }} /></>
          )}
        </button>
      </div>
    </div>
  );
}
