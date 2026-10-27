'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type TextSpeed = 'normal' | 'fast' | 'instant';
export const TEXT_CPS: Record<TextSpeed, number> = { normal: 30, fast: 60, instant: 0 };

interface FinnPrefs {
  textSpeed: TextSpeed;
  cycleTextSpeed: () => void;
  soundOn: boolean;
  toggleSound: () => void;
}

export const useFinnPrefs = create<FinnPrefs>()(persist((set, get) => ({
  textSpeed: 'normal',
  soundOn: true,
  toggleSound: () => set({ soundOn: !get().soundOn }),
  cycleTextSpeed: () => {
    const order: TextSpeed[] = ['normal', 'fast', 'instant'];
    set({ textSpeed: order[(order.indexOf(get().textSpeed) + 1) % order.length] });
  },
}), { name: 'welcome-back/finn-prefs', storage: createJSONStorage(() => sessionStorage) }));

export const SPEED_LABEL: Record<TextSpeed, string> = { normal: 'Normal', fast: 'Fast', instant: 'Instant' };
