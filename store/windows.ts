'use client';

import { create } from 'zustand';
import { APPS, type AppId } from '@/lib/registry';
import { sounds } from '@/lib/sounds';
import { uid } from '@/lib/uid';

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  prevRect?: { x: number; y: number; w: number; h: number };
  props?: Record<string, unknown>;
}

interface WindowsState {
  windows: WindowInstance[];
  nextZ: number;
  spawnCount: number;

  open: (appId: AppId, opts?: { title?: string; props?: Record<string, unknown> }) => void;
  close: (id: string) => void;
  closeAll: () => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  taskbarClick: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, w: number, h: number) => void;
}

export function topWindowId(windows: WindowInstance[]): string | null {
  let top: WindowInstance | null = null;
  for (const w of windows) {
    if (w.minimized) continue;
    if (!top || w.z > top.z) top = w;
  }
  return top ? top.id : null;
}

export const useWindows = create<WindowsState>()((set, get) => ({
  windows: [],
  nextZ: 10,
  spawnCount: 0,

  open: (appId, opts) => {
    const meta = APPS[appId];

    if (meta.singleton) {
      const existing = get().windows.find((w) => w.appId === appId);
      if (existing) {
        set((s) => ({
          nextZ: s.nextZ + 1,
          windows: s.windows.map((w) =>
            w.id === existing.id ? { ...w, minimized: false, z: s.nextZ, props: opts?.props ?? w.props } : w
          ),
        }));
        return;
      }
    }

    sounds.blip();
    set((s) => {
      const n = s.spawnCount;
      const layer =
        typeof document !== 'undefined'
          ? document.getElementById('window-layer')
          : null;
      const bw = layer?.clientWidth ?? 760;
      const bh = layer?.clientHeight ?? 560;

      const roomy = appId === 'browser';
      const w = roomy ? Math.min(bw - 8, Math.max(meta.minW ?? 0, Math.round(bw * 0.76))) : Math.min(meta.w, bw - 8);
      const h = roomy ? Math.min(bh - 8, Math.max(meta.minH ?? 0, Math.round(bh * 0.78))) : Math.min(meta.h, bh - 8);

      const centered = roomy || meta.singleton || appId === 'notepad' || w > bw - 80 || h > bh - 80;
      const x = centered
        ? Math.max(0, Math.round((bw - w) / 2))
        : 96 + (n % 7) * 26;
      const y = centered
        ? Math.max(0, Math.round((bh - h) / 2))
        : 48 + (n % 7) * 24;

      const win: WindowInstance = {
        id: uid(),
        appId,
        title: opts?.title ?? meta.title,
        x,
        y,
        w,
        h,
        z: s.nextZ,
        minimized: false,
        maximized: appId === 'browser',
        props: opts?.props,
      };
      return {
        windows: [...s.windows, win],
        nextZ: s.nextZ + 1,
        spawnCount: n + 1,
      };
    });
  },

  close: (id) => {
    sounds.blipLow();
    set((s) => ({ windows: s.windows.filter((w) => w.id !== id) }));
  },

  closeAll: () => set({ windows: [] }),

  focus: (id) =>
    set((s) => {
      const top = topWindowId(s.windows);
      if (top === id) return s;
      return {
        nextZ: s.nextZ + 1,
        windows: s.windows.map((w) => (w.id === id ? { ...w, z: s.nextZ } : w)),
      };
    }),

  minimize: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    })),

  toggleMaximize: (id) =>
    set((s) => ({
      nextZ: s.nextZ + 1,
      windows: s.windows.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized) {
          const r = w.prevRect;
          return {
            ...w,
            maximized: false,
            z: s.nextZ,
            x: r?.x ?? w.x,
            y: r?.y ?? w.y,
            w: r?.w ?? w.w,
            h: r?.h ?? w.h,
            prevRect: undefined,
          };
        }
        return {
          ...w,
          maximized: true,
          z: s.nextZ,
          prevRect: { x: w.x, y: w.y, w: w.w, h: w.h },
        };
      }),
    })),

  taskbarClick: (id) => {
    const s = get();
    const win = s.windows.find((w) => w.id === id);
    if (!win) return;
    if (win.minimized) {
      sounds.click();
      set((st) => ({
        nextZ: st.nextZ + 1,
        windows: st.windows.map((w) =>
          w.id === id ? { ...w, minimized: false, z: st.nextZ } : w
        ),
      }));
      return;
    }
    if (topWindowId(s.windows) === id) {
      sounds.click();
      s.minimize(id);
    } else {
      sounds.click();
      s.focus(id);
    }
  },

  move: (id, x, y) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    })),

  resize: (id, w2, h2) =>
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== id) return w;
        const meta = APPS[w.appId];
        return { ...w, w: Math.max(meta.minW, w2), h: Math.max(meta.minH, h2) };
      }),
    })),
}));
