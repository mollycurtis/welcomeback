'use client';

import { useEffect, useRef } from 'react';
import { useSystem } from '@/store/system';
import { useSave } from '@/store/save';
import { sounds } from '@/lib/sounds';
import { OSD_ITEMS } from '@/components/MonitorOSD';

export function useMonitor() {
  const setOsd = useSystem((s) => s.setOsd);
  const bumpDegauss = useSystem((s) => s.bumpDegauss);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const arm = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOsd(false), 8000);
  };

  const screenLive = () => {
    const p = useSystem.getState().phase;
    return p !== 'off' && p !== 'shutdown';
  };

  const degauss = () => {
    sounds.degauss();
    bumpDegauss();
  };

  const menu = () => {
    sounds.thock();
    if (!screenLive()) return;
    const { osdOpen, osdSel } = useSystem.getState();
    if (!osdOpen) setOsd(true, 0);
    else setOsd(true, (osdSel + 1) % OSD_ITEMS.length);
    arm();
  };

  const adjust = (dir: 1 | -1) => {
    sounds.thock();
    if (!screenLive()) return;
    const sys = useSystem.getState();
    if (!sys.osdOpen) {
      setOsd(true, OSD_ITEMS.findIndex((it) => it.id === 'volume'));
      arm();
      return;
    }
    const sv = useSave.getState();
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    const item = OSD_ITEMS[sys.osdSel];
    if (!item) return;
    switch (item.id) {
      case 'brightness':
        sv.setMonitor('brightness', clamp(sv.brightness + dir * 5, 0, 100));
        break;
      case 'contrast':
        sv.setMonitor('contrast', clamp(sv.contrast + dir * 5, 0, 100));
        break;
      case 'volume':
        sv.setMonitor('volume', clamp(sv.volume + dir * 5, 0, 100));
        break;
      case 'hpos':
        sv.setMonitor('hpos', clamp(sv.hpos + dir * 2, -24, 24));
        break;
      case 'degauss':
        if (dir === 1) degauss();
        break;
      case 'recall':
        if (dir === 1) sv.recallMonitor();
        break;
      case 'exit':
        setOsd(false);
        return;
    }
    arm();
  };

  const press = (button: 'menu' | 'minus' | 'plus' | 'degauss' | 'aux') => {
    if (button === 'menu') menu();
    else if (button === 'minus') adjust(-1);
    else if (button === 'plus') adjust(1);
    else if (button === 'degauss') degauss();
    else sounds.thock();
  };

  return { press, degauss };
}
