'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface PuzzleRecord {
  stars: 1 | 2 | 3;
  bestSecondsLeft: number;
  mistakes: number;
}

interface IFindState {
  records: Record<string, PuzzleRecord>;
  lastPlayed: string | null;

  finishPuzzle: (id: string, r: PuzzleRecord) => void;
  resetAll: () => void;
}

const fresh = () => ({ records: {} as Record<string, PuzzleRecord>, lastPlayed: null as string | null });

export const useIFind = create<IFindState>()(
  persist(
    (set) => ({
      ...fresh(),

      finishPuzzle: (id, r) =>
        set((s) => {
          const prev = s.records[id];
          const better =
            !prev ||
            r.stars > prev.stars ||
            (r.stars === prev.stars && r.bestSecondsLeft > prev.bestSecondsLeft);
          return {
            lastPlayed: id,
            records: better ? { ...s.records, [id]: r } : s.records,
          };
        }),

      resetAll: () => set(fresh()),
    }),
    {
      name: 'welcome-back/ifind',
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
