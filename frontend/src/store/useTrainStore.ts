import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Train } from '@/types';
import { MUMBAI_RAJDHANI_TRAIN } from '@/data/mockData';

interface TrainState {
  searchQuery: string;
  selectedTrain: Train;
  recentSearches: string[];
  favouriteTrainIds: string[];
  cameraFollow: boolean;
  activeTab: 'dashboard' | 'analytics' | 'weather' | 'places' | 'map';
  isAutoRefreshEnabled: boolean;
  lastUpdatedTime: string;

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedTrain: (train: Train) => void;
  addRecentSearch: (trainNumber: string) => void;
  toggleFavourite: (trainNumber: string) => void;
  setCameraFollow: (follow: boolean) => void;
  setActiveTab: (tab: 'dashboard' | 'analytics' | 'weather' | 'places' | 'map') => void;
  toggleAutoRefresh: () => void;
  updateTrainLocation: (lat: number, lon: number, speed: number, delayMinutes: number) => void;
}

export const useTrainStore = create<TrainState>()(
  persist(
    (set) => ({
      searchQuery: '',
      selectedTrain: MUMBAI_RAJDHANI_TRAIN,
      recentSearches: ['12951', '12002', '22436'],
      favouriteTrainIds: ['12951'],
      cameraFollow: true,
      activeTab: 'dashboard',
      isAutoRefreshEnabled: true,
      lastUpdatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setSelectedTrain: (train) =>
        set((state) => ({
          selectedTrain: train,
          recentSearches: Array.from(new Set([train.trainNumber, ...state.recentSearches])).slice(0, 5),
          lastUpdatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        })),

      addRecentSearch: (trainNumber) =>
        set((state) => ({
          recentSearches: Array.from(new Set([trainNumber, ...state.recentSearches])).slice(0, 5),
        })),

      toggleFavourite: (trainNumber) =>
        set((state) => ({
          favouriteTrainIds: state.favouriteTrainIds.includes(trainNumber)
            ? state.favouriteTrainIds.filter((id) => id !== trainNumber)
            : [...state.favouriteTrainIds, trainNumber],
        })),

      setCameraFollow: (follow) => set({ cameraFollow: follow }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      toggleAutoRefresh: () => set((state) => ({ isAutoRefreshEnabled: !state.isAutoRefreshEnabled })),

      updateTrainLocation: (lat, lon, speed, delayMinutes) =>
        set((state) => ({
          selectedTrain: {
            ...state.selectedTrain,
            currentLatitude: lat,
            currentLongitude: lon,
            speed: speed,
            delayMinutes: delayMinutes,
            lastUpdated: 'Just now',
          },
          lastUpdatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        })),
    }),
    {
      name: 'railgadi-storage',
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        favouriteTrainIds: state.favouriteTrainIds,
        isAutoRefreshEnabled: state.isAutoRefreshEnabled,
      }),
    }
  )
);
