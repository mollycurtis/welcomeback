'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface FinnSave {
  scene: string;
  prevScene: string;
  inventory: string[];
  flags: string[];
  notebook: string[];
  wonder: string[];
  resolvedWonder: string[];
  seaStars: string[];
  heard: string[];
  clicks: Record<string, number>;
  startedAt: number | null;
}

interface FinnState extends FinnSave {
  started: boolean;

  newGame: (firstScene: string) => void;
  goScene: (id: string) => void;
  setFlag: (f: string) => void;
  clearFlag: (f: string) => void;
  hasFlag: (f: string) => boolean;
  give: (id: string) => void;
  take: (id: string) => void;
  has: (id: string) => boolean;
  addNotebook: (id: string) => void;
  addWonder: (id: string) => void;
  resolveWonder: (id: string) => void;
  addSeaStar: (id: string) => void;
  hear: (id: string) => void;
  bumpClick: (id: string) => number;
  resetAll: () => void;
}

const fresh = (): FinnSave & { started: boolean } => ({
  started: false,
  scene: '',
  prevScene: '',
  inventory: [],
  flags: [],
  notebook: [],
  wonder: [],
  resolvedWonder: [],
  seaStars: [],
  heard: [],
  clicks: {},
  startedAt: null,
});

const add = (list: string[], id: string) => (list.includes(id) ? list : [...list, id]);

export const useFinn = create<FinnState>()(
  persist(
    (set, get) => ({
      ...fresh(),

      newGame: (firstScene) => set({ ...fresh(), started: true, scene: firstScene, prevScene: '', startedAt: Date.now() }),
      goScene: (id) => set((st) => (id === st.scene ? {} : { prevScene: st.scene, scene: id })),

      setFlag: (f) => set((s) => ({ flags: add(s.flags, f) })),
      clearFlag: (f) => set((s) => ({ flags: s.flags.filter((x) => x !== f) })),
      hasFlag: (f) => get().flags.includes(f),

      give: (id) => set((s) => ({ inventory: add(s.inventory, id) })),
      take: (id) => set((s) => ({ inventory: s.inventory.filter((x) => x !== id) })),
      has: (id) => get().inventory.includes(id),

      addNotebook: (id) => set((s) => ({ notebook: add(s.notebook, id) })),
      addWonder: (id) => set((s) => ({ wonder: add(s.wonder, id) })),
      resolveWonder: (id) => set((s) => ({ resolvedWonder: add(s.resolvedWonder, id) })),
      addSeaStar: (id) => set((s) => ({ seaStars: add(s.seaStars, id) })),
      hear: (id) => set((st) => ({ heard: add(st.heard ?? [], id) })),

      bumpClick: (id) => {
        const n = (get().clicks[id] ?? 0) + 1;
        set((s) => ({ clicks: { ...s.clicks, [id]: n } }));
        return n;
      },

      resetAll: () => set(fresh()),
    }),
    {
      name: 'welcome-back/finn',
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
