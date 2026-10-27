'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

export const FN = {
  deep: '#06263f',
  deepMid: '#0d3a5c',
  sea: '#1f7a8c',
  seaLt: '#43a7b8',
  sand: '#f2dfae',
  sandDk: '#d8bf85',
  shell: '#fff6e2',
  coral: '#f0714f',
  ink: '#1b2b36',
  inkSoft: '#4c6373',
  gold: '#f4c542',
};

export const FN_ROUND = 10;

export const HOW_TO_PLAY: [string, string][] = [
  ['Click', 'anything in the picture. Lots of things talk back!'],
  ['Talk', 'to everyone. Then talk to them again. Friends remember things!'],
  ['Pouch', 'holds the things you pick up. Click a thing, then click where it goes.'],
  ['Sparkles', 'mean you can pick it up, or use something there. Click them!'],
  ['Sea stars', 'Some friends have games to play. Win all three games to win every sea star!'],
  ['Exits', 'are the ways out. Point at the edges to see where they go.'],
  ['Stuck?', 'Open the Notebook. It will help you!'],
];
export const fnShadow = '0 3px 0 rgba(0,0,0,0.35)';
export const FN_FONT = '"Trebuchet MS", "Comic Sans MS", Verdana, sans-serif';

export function useSceneBox(bgW: number, bgH: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0, sw: 0, sh: 0, ox: 0, oy: 0 });
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const measure = () => {
      const w = el.offsetWidth, h = el.offsetHeight;
      const scale = Math.max(w / bgW, h / bgH);
      const sw = bgW * scale, sh = bgH * scale;
      setBox({ w, h, sw, sh, ox: (w - sw) / 2, oy: (h - sh) / 2 });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [bgW, bgH]);

  const px = (nx: number, ny: number) => ({ left: box.ox + nx * box.sw, top: box.oy + ny * box.sh });
  const size = (w: number, h: number) => ({ width: w * box.sw, height: h * box.sh });
  return { ref, box, px, size };
}

export function FNButton({ children, onClick, tone = 'sea', style, disabled }: {
  children: ReactNode; onClick?: () => void; tone?: 'sea' | 'sand' | 'coral'; style?: CSSProperties; disabled?: boolean;
}) {
  const bg = tone === 'sea' ? FN.sea : tone === 'coral' ? FN.coral : FN.sand;
  const fg = tone === 'sand' ? FN.ink : '#fff';
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
      style={{
        fontFamily: FN_FONT, fontWeight: 700, fontSize: 13, letterSpacing: 0.3,
        padding: '7px 16px', borderRadius: FN_ROUND, cursor: disabled ? 'default' : 'pointer',
        color: disabled ? 'rgba(255,255,255,0.5)' : fg,
        background: disabled ? '#5c7683' : bg,
        border: 'none', boxShadow: disabled ? 'none' : fnShadow,
        ...style,
      }}>
      {children}
    </button>
  );
}

const C = (name: string, hx: number, hy: number, fallback: string) =>
  `url(/finn/ui/cursor-${name}.png) ${hx} ${hy}, ${fallback}`;

export const CURSORS: Record<string, string> = {
  point: C('point', 3, 2, 'default'),
  swim: C('swim', 16, 16, 'pointer'),
  look: C('look', 13, 12, 'zoom-in'),
  take: C('take', 16, 10, 'grab'),
  talk: C('talk', 16, 18, 'help'),
  use: C('use', 16, 14, 'crosshair'),
  back: C('back', 8, 20, 'w-resize'),
};
