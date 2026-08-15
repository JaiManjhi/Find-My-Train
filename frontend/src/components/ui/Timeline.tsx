'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Radio } from 'lucide-react';
import { Station } from '@/types';
import { formatDelay } from '@/lib/utils';

interface TimelineProps {
  stations: Station[];
}

interface GroupedSection {
  halt: Station;
  intermediates: Station[];
}

function buildSections(stations: Station[]): GroupedSection[] {
  // Stations with isHalt:true (or if none have the flag, treat every station as halt)
  const hasHaltFlag = stations.some((s) => s.isHalt === true);

  if (!hasHaltFlag) {
    // Fallback: every station is treated as halt with no intermediates
    return stations.map((s) => ({ halt: s, intermediates: [] }));
  }

  const sections: GroupedSection[] = [];
  let pendingIntermediates: Station[] = [];

  for (const station of stations) {
    if (station.isHalt) {
      sections.push({ halt: station, intermediates: pendingIntermediates });
      pendingIntermediates = [];
    } else {
      pendingIntermediates.push(station);
    }
  }

  // Any trailing intermediate stations (shouldn't happen but handle gracefully)
  if (pendingIntermediates.length > 0 && sections.length > 0) {
    sections[sections.length - 1].intermediates.push(...pendingIntermediates);
  }

  return sections;
}

function StationRow({ station, compact = false }: { station: Station; compact?: boolean }) {
  const { text: statusText, colorClass } = formatDelay(station.delayMinutes);
  const timeToShow = station.actualArrival || station.arrivalTime;

  if (compact) {
    return (
      <div className="flex items-center justify-between py-2 px-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#1F2937] border border-[#4B5563]" />
          <span className="text-[#94A3B8] text-xs font-medium">{station.name}</span>
          <span className="text-[#4B5563] text-xs font-mono">{station.code}</span>
        </div>
        <span className="text-[#4B5563] text-xs font-mono">{timeToShow}</span>
      </div>
    );
  }

  return (
    <div
      className={`relative ml-6 p-3.5 rounded-xl border transition-all ${
        station.isCurrent
          ? 'bg-[#007AFF]/10 border-[#007AFF]/50'
          : station.isPassed
          ? 'bg-[#161B22] border-[#1F2937]'
          : 'bg-[#161B22] border-[#1F2937]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-sm text-white leading-tight">
              {station.name}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#1F2937] border border-[#1F2937] text-[10px] font-mono text-[#94A3B8]">
              {station.code}
            </span>
            {station.isCurrent && (
              <span className="px-2 py-0.5 rounded bg-[#007AFF]/20 border border-[#007AFF]/40 text-[10px] font-mono font-semibold text-[#007AFF] tracking-wide uppercase animate-pulse">
                Current
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#94A3B8] mt-1 font-mono">
            <span>{station.state}</span>
            <span className="text-[#4B5563]">·</span>
            <span>Pf {station.platform || '1'}</span>
            <span className="text-[#4B5563]">·</span>
            <span>{station.distanceFromOrigin} km</span>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-sm font-mono font-semibold text-[#F8FAFC]">{timeToShow}</div>
          <div className={`text-[11px] font-mono font-semibold mt-0.5 ${colorClass}`}>
            {statusText}
          </div>
        </div>
      </div>
    </div>
  );
}

function IntermediateToggle({
  stations,
  isExpanded,
  onToggle,
}: {
  stations: Station[];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  if (stations.length === 0) return null;

  return (
    <div className="ml-6">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[#1F2937] hover:border-[#007AFF]/50 hover:bg-[#007AFF]/5 transition-all text-left group"
      >
        <div className="text-[#94A3B8] group-hover:text-[#007AFF] transition-colors">
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </div>
        <span className="text-xs text-[#94A3B8] group-hover:text-[#007AFF] font-mono transition-colors">
          {isExpanded ? 'Hide' : `+ ${stations.length}`} intermediate station
          {stations.length !== 1 ? 's' : ''}
        </span>
      </button>

      {isExpanded && (
        <div className="mt-1 ml-2 border-l border-[#1F2937] rounded-bl-lg divide-y divide-[#1F2937]">
          {stations.map((s) => (
            <StationRow key={s.code} station={s} compact />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Timeline({ stations }: TimelineProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  const sections = buildSections(stations);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="relative space-y-1">
      {/* Vertical rail line */}
      <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-[#007AFF] via-[#1F2937] to-[#1F2937]" />

      {sections.map((section, idx) => {
        const { halt, intermediates } = section;
        const isExpanded = expandedSections.has(idx);

        return (
          <div key={halt.code} className="relative">
            {/* ── Station Node ── */}
            <div className="flex items-start gap-0">
              {/* Dot */}
              <div
                className={`relative z-10 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-3.5 ${
                  halt.isCurrent
                    ? 'bg-[#007AFF] border-white shadow-[0_0_10px_rgba(0,122,255,0.7)] scale-110'
                    : halt.isPassed
                    ? 'bg-[#007AFF]/60 border-[#007AFF]'
                    : 'bg-[#161B22] border-[#1F2937]'
                }`}
              >
                {halt.isCurrent ? (
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                ) : halt.isPassed ? (
                  <CheckCircle className="w-3 h-3 text-white" />
                ) : (
                  <div className="w-2 h-2 bg-[#4B5563] rounded-full" />
                )}
              </div>

              {/* Station Card */}
              <div className="flex-1 mb-1">
                <StationRow station={halt} />
              </div>
            </div>

            {/* ── Intermediate Stations (collapsible) ── */}
            {intermediates.length > 0 && (
              <div className="ml-6">
                <div className="border-l-2 border-dashed border-[#1F2937] ml-[-12px] pl-[10px]">
                  <IntermediateToggle
                    stations={intermediates}
                    isExpanded={isExpanded}
                    onToggle={() => toggleSection(idx)}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
