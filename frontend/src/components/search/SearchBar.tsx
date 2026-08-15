'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Train as TrainIcon, ChevronRight } from 'lucide-react';
import { INDIAN_TRAINS_DATABASE } from '@/data/trainIndex';
import { SearchResult } from '@/types';

interface SearchBarProps {
  onSelectTrain: (trainResult: SearchResult) => void;
  placeholder?: string;
}

export default function SearchBar({
  onSelectTrain,
  placeholder = 'Search by train name or number…',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter on every keystroke — purely client-side, instant
  useEffect(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      setResults(INDIAN_TRAINS_DATABASE.slice(0, 10)); // show top 10 when no query
      return;
    }
    const matched = INDIAN_TRAINS_DATABASE.filter(
      (t) =>
        t.trainNumber.toLowerCase().includes(q) ||
        t.trainName.toLowerCase().includes(q) ||
        t.origin.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q)
    );
    setResults(matched.slice(0, 20));
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ── Search Input ── */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-[#94A3B8] pointer-events-none">
          <Search className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 text-sm bg-[#1F2937] border border-[#1F2937] rounded-lg text-[#F8FAFC] placeholder-[#4B5563] transition-all focus:outline-none focus:border-[#007AFF]"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 text-[#4B5563] hover:text-[#94A3B8] transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Dropdown Results ── */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-[#161B22] border border-[#1F2937] rounded-lg overflow-hidden shadow-2xl max-h-72 overflow-y-auto">
          {/* Header */}
          <div className="px-3 py-2 border-b border-[#1F2937] flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold text-[#94A3B8] uppercase tracking-wider">
              {query.trim() ? `${results.length} result${results.length !== 1 ? 's' : ''}` : 'Popular Trains'}
            </span>
            <span className="text-[10px] font-mono text-[#007AFF]">Live Index</span>
          </div>

          {results.length > 0 ? (
            <div className="divide-y divide-[#1F2937]">
              {results.map((train) => (
                <button
                  key={train.trainNumber}
                  onClick={() => {
                    onSelectTrain(train);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="w-full text-left px-3 py-3 flex items-center justify-between gap-3 hover:bg-[#1F2937] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#1F2937] border border-[#1F2937] group-hover:border-[#007AFF]/50 flex items-center justify-center text-[#94A3B8] group-hover:text-[#007AFF] transition-colors flex-shrink-0">
                      <TrainIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#F8FAFC] group-hover:text-[#007AFF] transition-colors truncate">
                        {train.trainName}
                      </div>
                      <div className="text-xs text-[#94A3B8] truncate mt-0.5">
                        {train.origin} → {train.destination}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="px-2 py-0.5 rounded bg-[#1F2937] border border-[#1F2937] text-[11px] font-mono font-bold text-[#007AFF]">
                      #{train.trainNumber}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#4B5563] group-hover:text-[#007AFF] transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-[#94A3B8]">
              No trains found for &quot;{query}&quot;.{' '}
              <span className="text-[#4B5563]">Try &quot;Rajdhani&quot; or &quot;12951&quot;</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
