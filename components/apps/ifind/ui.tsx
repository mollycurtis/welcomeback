'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

export function useCoverBox(sceneW: number, sceneH: number, fit: 'cover' | 'contain' = 'cover') {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0, sw: 0, sh: 0, ox: 0, oy: 0 });
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const measure = () => {
      const w = el.offsetWidth, h = el.offsetHeight;
      const scale = fit === 'contain' ? Math.min(w / sceneW, h / sceneH) : Math.max(w / sceneW, h / sceneH);
      const sw = sceneW * scale, sh = sceneH * scale;
      setBox({ w, h, sw, sh, ox: (w - sw) / 2, oy: (h - sh) / 2 });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sceneW, sceneH, fit]);

  const px = (nx: number, ny: number) => ({ left: box.ox + nx * box.sw, top: box.oy + ny * box.sh });
  const size = (w: number, h: number) => ({ width: w * box.sw, height: h * box.sh });

  const toPicture = (clientX: number, clientY: number) => {
    const el = ref.current; if (!el || !box.sw) return null;
    const r = el.getBoundingClientRect();
    const k = r.width ? box.w / r.width : 1;
    return { nx: ((clientX - r.left) * k - box.ox) / box.sw, ny: ((clientY - r.top) * k - box.oy) / box.sh };
  };

  return { ref, box, px, size, toPicture };
}

export const IF = {
  wood: '#2e2116',
  woodDk: '#1a1209',
  woodLt: '#463123',
  parchment: '#fbf3d8',
  parchDk: '#f0e2b4',
  brass: '#e8b731',
  brassDk: '#a37c10',
  red: '#c8102e',
  navy: '#1b3a7a',
  ink: '#1e1a14',
  inkSoft: '#5f564a',
  found: '#e8b731',
  miss: '#c8102e',
};

export const IF_SERIF = "'Trajan Pro', 'Trajan Pro 3', Cinzel, Georgia, 'Times New Roman', serif";
export const IF_LABEL = '"Trebuchet MS", Verdana, sans-serif';

export const woodGrain = `url(/ifind/ui/wood.png) repeat`;
export const vignette = 'radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0.8) 100%)';
export const paperTile = `url(/ifind/ui/paper.png) repeat`;

export const hardBevel = (up = true) => up
  ? 'inset 2px 2px 0 rgba(255,255,255,0.45), inset -2px -2px 0 rgba(0,0,0,0.55)'
  : 'inset -2px -2px 0 rgba(255,255,255,0.3), inset 2px 2px 0 rgba(0,0,0,0.6)';

export function Grain({ opacity = 1 }: { opacity?: number }) {
  return <span aria-hidden style={{
    position: 'absolute', inset: 0, pointerEvents: 'none', opacity,
    background: 'url(/ifind/ui/grain.png) repeat', mixBlendMode: 'overlay',
  }} />;
}

export function IFButton({
  children, onClick, disabled, tone = 'brass', style,
}: {
  children: ReactNode; onClick?: () => void; disabled?: boolean;
  tone?: 'brass' | 'dark'; style?: CSSProperties;
}) {
  const brass = tone === 'brass';
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
      style={{
        fontFamily: IF_LABEL, fontWeight: 700, fontSize: 12, letterSpacing: 1,
        textTransform: 'uppercase', padding: '5px 15px', borderRadius: 0,
        cursor: disabled ? 'default' : 'pointer', imageRendering: 'pixelated',
        color: disabled ? '#8a8272' : brass ? '#3a2a06' : IF.parchment,
        background: disabled ? '#7f7869' : brass ? IF.brass : IF.woodLt,
        border: `2px solid ${brass ? '#6d5410' : '#120a04'}`,
        boxShadow: disabled ? 'none' : hardBevel(),
        textShadow: brass ? '1px 1px 0 rgba(255,255,255,0.3)' : '1px 1px 0 rgba(0,0,0,0.8)',
        ...style,
      }}>
      {children}
    </button>
  );
}

export function ClueStrip({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      position: 'relative', background: IF.parchment,
      borderTop: `1px solid ${IF.brassDk}`,
      ...style,
    }}>
      {children}
    </div>
  );
}

export function Plate({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span style={{
      fontFamily: IF_LABEL, fontWeight: 900, fontSize: 13, letterSpacing: 1.4,
      textTransform: 'uppercase', color: IF.parchment,
      textShadow: '0 1px 0 rgba(0,0,0,0.7)', ...style,
    }}>
      {children}
    </span>
  );
}

export function Stars({ n, size = 16 }: { n: number; size?: number }) {
  return (
    <span style={{ letterSpacing: 2, fontSize: size, color: IF.brass, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
      {'\u2605'.repeat(n)}<span style={{ color: 'rgba(255,255,255,0.22)' }}>{'\u2605'.repeat(3 - n)}</span>
    </span>
  );
}
