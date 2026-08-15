'use client';

import { Train } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { useTrainStore } from '@/store/useTrainStore';
import { Star, ArrowRight, Gauge, MapPin, Navigation, ChevronRight } from 'lucide-react';

interface TrainCardProps {
  train: Train;
  onSelect?: () => void;
}

export default function TrainCard({ train, onSelect }: TrainCardProps) {
  const { favouriteTrainIds, toggleFavourite } = useTrainStore();
  const isFav = favouriteTrainIds.includes(train.trainNumber);

  return (
    <div
      onClick={onSelect}
      className="cursor-pointer rounded-xl border transition-all hover:border-[#007AFF] group"
      style={{ background: '#161B22', borderColor: '#1F2937' }}
    >
      {/* ── Header ── */}
      <div className="p-4 border-b" style={{ borderColor: '#1F2937' }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="px-2 py-0.5 rounded text-[11px] font-mono font-bold"
                style={{ background: 'rgba(0,122,255,0.1)', color: '#007AFF', border: '1px solid rgba(0,122,255,0.3)' }}
              >
                #{train.trainNumber}
              </span>
              <StatusBadge delayMinutes={train.delayMinutes} />
            </div>
            <h3
              className="font-bold text-base text-white group-hover:text-[#007AFF] transition-colors"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {train.trainName}
            </h3>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavourite(train.trainNumber);
            }}
            className="p-1.5 rounded-lg border transition-all flex-shrink-0"
            style={{
              background: isFav ? 'rgba(255,176,0,0.08)' : 'transparent',
              borderColor: isFav ? '#FFB000' : '#1F2937',
            }}
          >
            <Star
              className="w-4 h-4"
              style={{ color: '#FFB000', fill: isFav ? '#FFB000' : 'none' }}
            />
          </button>
        </div>
      </div>

      {/* ── Route + Progress ── */}
      <div className="p-4 space-y-3">
        {/* Route */}
        <div className="flex items-center justify-between gap-2 text-sm text-[#94A3B8]">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#007AFF' }} />
            <span className="truncate font-medium">{train.origin}</span>
          </div>
          <ArrowRight className="w-4 h-4 flex-shrink-0 text-[#4B5563]" />
          <div className="flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#10B981' }} />
            <span className="truncate font-medium">{train.destination}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-[11px] font-mono text-[#94A3B8] mb-1.5">
            <span>{train.completionPercent}% done</span>
            <span>{train.distanceRemaining} km left</span>
          </div>
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ background: '#1F2937' }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${train.completionPercent}%`, background: '#007AFF' }}
            />
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        className="px-4 py-3 border-t flex items-center justify-between"
        style={{ borderColor: '#1F2937' }}
      >
        <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
          <Gauge className="w-3.5 h-3.5" style={{ color: '#007AFF' }} />
          <span className="font-mono text-white font-semibold">{train.speed} km/h</span>
        </div>
        <div className="text-xs text-[#94A3B8]">
          At <span className="font-semibold text-white">{train.currentStation.name}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-[#4B5563] group-hover:text-[#007AFF] transition-colors" />
      </div>
    </div>
  );
}
