'use client';

import { useState } from 'react';
import { SystemTab } from './AboutComputer';
import type { AppWindowProps } from '@/lib/registry';
import { useSave } from '@/store/save';
import { useWindows } from '@/store/windows';
import { sounds } from '@/lib/sounds';
import Wallpaper from '@/components/desktop/Wallpaper';

type Tab = 'desktop' | 'screensaver' | 'appearance' | 'settings' | 'system';
const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'desktop', label: 'Desktop' },
  { id: 'screensaver', label: 'Screen Saver' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'settings', label: 'Settings' },
  { id: 'system', label: 'System' },
];

const WALLS: Array<{ id: 'hill' | 'teal' | 'navy' | 'none'; label: string }> = [
  { id: 'hill', label: 'Hill (default)' },
  { id: 'teal', label: 'Classic Teal' },
  { id: 'navy', label: 'Midnight' },
  { id: 'none', label: '(None)' },
];

const THEMES: Array<{ id: 'blue' | 'olive' | 'silver'; label: string; swatch: string }> = [
  { id: 'blue', label: 'Blue', swatch: '#0a246a' },
  { id: 'olive', label: 'Olive Green', swatch: '#56611f' },
  { id: 'silver', label: 'Silver', swatch: '#8a8a9a' },
];

const WAITS: Array<{ ms: number; label: string }> = [
  { ms: 90_000, label: '90 seconds (impatient)' },
  { ms: 300_000, label: '5 minutes' },
  { ms: 900_000, label: '15 minutes' },
];

export default function DisplayProperties({ windowId }: AppWindowProps) {
  const crtFxOn = useSave((s) => s.crtFxOn);
  const setCrtFxOn = useSave((s) => s.setCrtFxOn);
  const colorBits = useSave((s) => s.colorBits);
  const refreshHz = useSave((s) => s.refreshHz);
  const fontSmooth = useSave((s) => s.fontSmooth);
  const soundOn = useSave((s) => s.soundOn);
  const setSoundOn = useSave((s) => s.setSoundOn);
  const wallpaper = useSave((s) => s.wallpaper);
  const theme = useSave((s) => s.theme);
  const ssText = useSave((s) => s.ssText);
  const ssWaitMs = useSave((s) => s.ssWaitMs);
  const setDisplay = useSave((s) => s.setDisplay);
  const close = useWindows((s) => s.close);

  const [tab, setTab] = useState<Tab>('desktop');

  const Monitor = ({ children }: { children?: React.ReactNode }) => (
    <div className="flex justify-center mb-3">
      <div className="p-2.5 pb-4 rounded-[10px]" style={{ background: 'radial-gradient(120% 140% at 30% 0%, #5b5648, #36332a)' }}>
        <div className="relative overflow-hidden rounded-[4px] bevel-in" style={{ width: 180, height: 120 }}>
          {children}
          {crtFxOn && <div className="absolute inset-0 fx-scanlines fx-vignette pointer-events-none" />}
        </div>
        <div className="flex justify-end mt-1.5 pr-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: '#56d364' }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 flex flex-col bg-[var(--face)]">
      <div className="flex gap-0.5 px-2 pt-2 win-noselect" style={{ borderBottom: '1px solid var(--shadow-dark)' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className="px-3 py-1 text-[11px] cursor-pointer"
            style={{
              background: tab === t.id ? 'var(--face)' : '#d4d0c4',
              border: '1px solid',
              borderColor: '#fff var(--shadow-dark) ' + (tab === t.id ? 'var(--face)' : 'var(--shadow-dark)') + ' #fff',
              borderRadius: '4px 4px 0 0',
              marginBottom: tab === t.id ? -1 : 0,
              fontWeight: tab === t.id ? 700 : 400,
            }}
            onClick={() => { sounds.click(); setTab(t.id); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-3">
        {tab === 'system' && <div style={{ height: '100%', minHeight: 0 }}><SystemTab /></div>}

        {tab === 'desktop' && (
          <>
            <Monitor><WallPreview which={wallpaper} /></Monitor>
            <fieldset className="bevel-thin p-3">
              <legend className="text-[11px] px-1">Background</legend>
              <div className="flex flex-col gap-1.5">
                {WALLS.map((w) => (
                  <label key={w.id} className="flex items-center gap-2 text-[12px] cursor-pointer">
                    <input
                      type="radio"
                      name="wall"
                      checked={wallpaper === w.id}
                      onChange={() => { setDisplay('wallpaper', w.id); sounds.click(); }}
                    />
                    {w.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        )}

        {tab === 'screensaver' && (
          <>
            <Monitor>
              <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden">
                <span className="font-bios text-[#ffd54a] text-[13px] whitespace-nowrap">{ssText || ' '}</span>
              </div>
            </Monitor>
            <fieldset className="bevel-thin p-3 flex flex-col gap-2">
              <legend className="text-[11px] px-1">Marquee</legend>
              <label className="text-[12px]">Text:</label>
              <input
                value={ssText}
                maxLength={48}
                onChange={(e) => setDisplay('ssText', e.target.value)}
                className="bevel-in px-2 py-1 text-[12px] outline-none"
              />
              <label className="text-[12px] mt-1">Wait:</label>
              <select
                value={ssWaitMs}
                onChange={(e) => { setDisplay('ssWaitMs', Number(e.target.value)); sounds.click(); }}
                className="bevel-in px-1 py-1 text-[12px]"
              >
                {WAITS.map((w) => (
                  <option key={w.ms} value={w.ms}>{w.label}</option>
                ))}
              </select>
            </fieldset>
          </>
        )}

        {tab === 'appearance' && (
          <>
            <Monitor>
              <div className="absolute inset-0 bg-[#5a7ab0] p-2">
                <div className="bevel-out" style={{ height: 60 }}>
                  <div className="titlebar h-[14px] flex items-center px-1">
                    <span className="text-[8px] font-bold">Window</span>
                  </div>
                </div>
              </div>
            </Monitor>
            <fieldset className="bevel-thin p-3">
              <legend className="text-[11px] px-1">Color scheme</legend>
              <div className="flex flex-col gap-1.5">
                {THEMES.map((t) => (
                  <label key={t.id} className="flex items-center gap-2 text-[12px] cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      checked={theme === t.id}
                      onChange={() => { setDisplay('theme', t.id); sounds.click(); }}
                    />
                    <span className="inline-block w-4 h-4 bevel-thin" style={{ background: t.swatch }} />
                    {t.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        )}

        {tab === 'settings' && (
          <fieldset className="bevel-thin p-3 flex flex-col gap-2">
            <legend className="text-[11px] px-1">Settings</legend>
            <label className="flex items-center gap-2 text-[12px] cursor-pointer">
              <input type="checkbox" checked={crtFxOn} onChange={(e) => { setCrtFxOn(e.target.checked); sounds.click(); }} />
              CRT effects (scanlines &amp; flicker)
            </label>
            <label className="flex items-center gap-2 text-[12px] cursor-pointer">
              <input type="checkbox" checked={soundOn} onChange={(e) => { setSoundOn(e.target.checked); if (e.target.checked) sounds.blip(); }} />
              Sound effects
            </label>
            <label className="text-[12px] mt-1">Color quality:</label>
            <select className="bevel-in px-1 py-1 text-[12px]" value={colorBits} onChange={(e) => { setDisplay('colorBits', Number(e.target.value) as 16 | 32); sounds.click(); }}>
              <option value="32">Highest (32 bit)</option>
              <option value="16">Medium (16 bit)</option>
            </select>
            <label className="text-[12px] mt-1">Screen refresh rate:</label>
            <select className="bevel-in px-1 py-1 text-[12px]" value={refreshHz} onChange={(e) => { setDisplay('refreshHz', Number(e.target.value) as 60 | 75); sounds.click(); }}>
              <option value="60">60 Hertz</option>
              <option value="75">75 Hertz</option>
            </select>
            <label className="flex items-center gap-2 text-[12px] cursor-pointer mt-1">
              <input type="checkbox" checked={fontSmooth} onChange={(e) => { setDisplay('fontSmooth', e.target.checked); sounds.click(); }} />
              Smooth edges of screen fonts
            </label>
            <p className="text-[11px] text-[#5a5a5a] mt-1">Display: Plug and Play Monitor on Standard VGA Graphics Adapter</p>
          </fieldset>
        )}
      </div>

      <div className="flex justify-end gap-2 px-3 pb-3">
        <button className="btn3d min-w-[72px]" onClick={() => close(windowId)}>OK</button>
      </div>
    </div>
  );
}

function WallPreview({ which }: { which: 'hill' | 'teal' | 'navy' | 'none' }) {
  if (which === 'hill') return <Wallpaper />;
  const bg = which === 'teal' ? '#2e7d6e' : which === 'navy' ? '#0a1740' : '#000';
  return <div className="absolute inset-0" style={{ background: bg }} />;
}
