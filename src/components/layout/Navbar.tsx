'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTrainStore } from '@/store/useTrainStore';
import { Train, Star, Radio } from 'lucide-react';
import SearchBar from '../search/SearchBar';
import { SearchResult } from '@/types';

export default function Navbar() {
  const router = useRouter();
  const { favouriteTrainIds, isAutoRefreshEnabled, toggleAutoRefresh, addRecentSearch } = useTrainStore();

  const handleSelectTrain = (result: SearchResult) => {
    addRecentSearch(result.trainNumber);
    router.push(`/train/${result.trainNumber}`);
  };

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#080C14EE',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1E2A3A',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        {/* Brand */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Train style={{ width: 18, height: 18, color: '#fff' }} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1, color: '#F1F5F9' }}>
              Rail<span style={{ color: '#3B82F6' }}>Gaadi</span>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#10B981', marginLeft: 4, verticalAlign: 'middle' }} />
            </div>
            <div style={{ fontSize: 9, color: '#3F5169', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.2 }}>Live Tracker</div>
          </div>
        </Link>

        {/* Desktop search */}
        <div className="hidden md:block" style={{ flex: 1, maxWidth: 440 }}>
          <SearchBar onSelectTrain={handleSelectTrain} placeholder="Search train name or number…" />
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button
            onClick={toggleAutoRefresh}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 10px', borderRadius: 8, fontSize: 11,
              fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
              border: `1px solid ${isAutoRefreshEnabled ? '#3B82F680' : '#1E2A3A'}`,
              background: isAutoRefreshEnabled ? '#3B82F615' : 'transparent',
              color: isAutoRefreshEnabled ? '#3B82F6' : '#3F5169',
              cursor: 'pointer',
            }}
            title="Toggle 30s auto-refresh"
          >
            <Radio style={{ width: 11, height: 11, color: isAutoRefreshEnabled ? '#10B981' : 'inherit' }} />
            {isAutoRefreshEnabled ? 'Live' : 'Off'}
          </button>

          <Link
            href="/"
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 10px', borderRadius: 8, fontSize: 11,
              fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
              border: '1px solid #1E2A3A', background: 'transparent',
              color: '#F59E0B', textDecoration: 'none',
            }}
          >
            <Star style={{ width: 11, height: 11, fill: '#F59E0B' }} />
            {favouriteTrainIds.length} Saved
          </Link>
        </div>
      </div>
    </header>
  );
}
