import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WatchProgress {
  seriesId: string;
  episodeId: string;
  progress: number;
  duration: number;
  updatedAt: number;
}

interface AppState {
  isAdmin: boolean;
  setAdmin: (isAdmin: boolean) => void;
  watchHistory: Record<string, WatchProgress>; // Key: seriesId
  updateWatchHistory: (seriesId: string, episodeId: string, progress: number, duration: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isAdmin: false,
      setAdmin: (isAdmin) => set({ isAdmin }),
      watchHistory: {},
      updateWatchHistory: (seriesId, episodeId, progress, duration) =>
        set((state) => ({
          watchHistory: {
            ...state.watchHistory,
            [seriesId]: {
              seriesId,
              episodeId,
              progress,
              duration,
              updatedAt: Date.now(),
            },
          },
        })),
    }),
    {
      name: 'thrilling-anime-storage',
    }
  )
);
