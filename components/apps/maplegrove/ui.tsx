'use client';

import { useState, type ReactNode, type CSSProperties } from 'react';

export const STAGE_W = 760;
export const STAGE_H = 570;

export const MG = {
  cream: '#fff6dc',
  paper: '#fffaf0',
  panel: '#fff2c4',
  panelEdge: '#b8860b',
  ink: '#1a2a55',
  sub: '#4b5a85',
  purple: '#1e4db7',
  purpleDk: '#0f2f7a',
  leaf: '#d8322a',
  leafDk: '#8f1d18',
  green: '#3f9a3a',
  greenDk: '#256a22',
  sky: '#5fb8ec',
  gold: '#f7d23e',
  goldDk: '#c98d00',
  blue: '#1e4db7',
  blueDk: '#0f2f7a',
  blueLt: '#4d7be0',
};

export const FONT_TITLE = '"Arial Black", "Arial Bold", Impact, "Trebuchet MS", sans-serif';
export const FONT_BODY = 'Verdana, Tahoma, Arial, sans-serif';

export const bevel = (light = 'rgba(255,255,255,0.75)', dark = 'rgba(0,0,0,0.35)') =>
  `inset 2px 2px 0 ${light}, inset -2px -2px 0 ${dark}`;

export function MGStage({ children, bg = MG.cream, scroll }: { children: ReactNode; bg?: string; scroll?: boolean }) {
  return (
    <div
      style={{
        position: 'absolute', inset: 0, overflow: scroll ? 'hidden auto' : 'hidden',
        background: bg,
        fontFamily: FONT_BODY, color: MG.ink,
      }}
    >
      {children}
      {!scroll && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 200, backgroundImage: 'url(/fx/noise.png)', backgroundSize: '160px 160px', opacity: 0.08, mixBlendMode: 'multiply' }} />}
    </div>
  );
}

export function Leaf({ size = 16, color = MG.leaf }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M12 2 l2.4 3 l3.2 -1 l-1.1 3.2 l2.6 2.3 l-3.3 .7 l-.3 3.3 l-2.9 -1.7 l-2.9 1.7 l-.3 -3.3 l-3.3 -.7 l2.6 -2.3 l-1.1 -3.2 l3.2 1 Z" fill={color} stroke={MG.leafDk} strokeWidth="0.8" strokeLinejoin="round" />
      <rect x="11.4" y="13" width="1.2" height="8" rx="0.5" fill={MG.leafDk} />
    </svg>
  );
}

export function Wordmark({ size = 30 }: { size?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: size, color: MG.gold, letterSpacing: -0.5, lineHeight: 0.95,
      textShadow: `2px 2px 0 ${MG.blueDk}, -1px -1px 0 ${MG.blueDk}, 1px -1px 0 ${MG.blueDk}, -1px 1px 0 ${MG.blueDk}, 3px 4px 0 rgba(0,0,0,0.35)`, textTransform: 'uppercase' }}>
      <Leaf size={size * 0.8} />
      Maple Grove
    </span>
  );
}

type BtnColor = 'purple' | 'green' | 'gold' | 'plain' | 'leaf';
const BTN: Record<BtnColor, { bg: string; dk: string; fg: string; hi: string }> = {
  purple: { bg: MG.blue, dk: MG.blueDk, fg: '#fff', hi: MG.blueLt },
  green: { bg: MG.green, dk: MG.greenDk, fg: '#fff', hi: '#6cc262' },
  gold: { bg: MG.gold, dk: MG.goldDk, fg: MG.blueDk, hi: '#ffe98a' },
  leaf: { bg: MG.leaf, dk: MG.leafDk, fg: '#fff', hi: '#f06a5f' },
  plain: { bg: '#efe6cf', dk: '#7a6a45', fg: '#2a2416', hi: '#ffffff' },
};

export function MGButton({
  children, onClick, color = 'purple', disabled, style, title,
}: { children: ReactNode; onClick?: () => void; color?: BtnColor; disabled?: boolean; style?: CSSProperties; title?: string }) {
  const c = BTN[color];
  const [down, setDown] = useState(false);
  return (
    <button
      title={title}
      onClick={disabled ? undefined : onClick}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      onMouseLeave={() => setDown(false)}
      disabled={disabled}
      style={{
        position: 'relative', border: `2px solid ${disabled ? '#8a8676' : MG.blueDk}`, borderRadius: 5,
        background: disabled ? '#cfc9b8' : `linear-gradient(${c.hi} 0%, ${c.bg} 48%, ${c.dk} 52%, ${c.bg} 100%)`,
        color: disabled ? '#77725f' : c.fg,
        fontWeight: 900, fontSize: 14, padding: '5px 14px', cursor: disabled ? 'default' : 'pointer',
        boxShadow: disabled ? 'none' : down ? bevel('rgba(0,0,0,0.25)', 'rgba(255,255,255,0.4)') : bevel(),
        fontFamily: FONT_BODY, whiteSpace: 'nowrap', textShadow: c.fg === '#fff' ? '1px 1px 0 rgba(0,0,0,0.45)' : 'none', ...style,
      }}
    >
      {children}
    </button>
  );
}

export function MGPanel({ children, style, pad = 14 }: { children: ReactNode; style?: CSSProperties; pad?: number }) {
  return (
    <div style={{ background: MG.panel, border: `3px solid ${MG.blueDk}`, borderRadius: 6, padding: pad, boxShadow: bevel('rgba(255,255,255,0.8)', 'rgba(0,0,0,0.18)'), ...style }}>
      {children}
    </div>
  );
}

export function Coin({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <circle cx="12" cy="12" r="10" fill={MG.gold} stroke={MG.goldDk} strokeWidth="2" />
      <circle cx="12" cy="12" r="6.5" fill="none" stroke={MG.goldDk} strokeWidth="1" opacity="0.5" />
      <path d="M12 7 l1.5 2 l2 -.6 l-.7 2 l1.6 1.4 l-2 .4 l-.2 2 l-1.8-1 l-1.8 1 l-.2-2 l-2-.4 l1.6-1.4 l-.7-2 l2 .6 Z" fill={MG.goldDk} opacity="0.85" />
    </svg>
  );
}

export function TicketIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M3 7 h18 v3 a2 2 0 0 0 0 4 v3 H3 v-3 a2 2 0 0 0 0 -4 Z" fill={MG.sky} stroke="#3f8fb0" strokeWidth="1.5" />
      <line x1="15" y1="7" x2="15" y2="17" stroke="#3f8fb0" strokeWidth="1" strokeDasharray="1.5 1.5" />
    </svg>
  );
}

export function Money({ bucks, tickets }: { bucks: number; tickets?: number }) {
  const plate: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 4, background: `linear-gradient(#ffe98a, ${MG.gold})`, border: `2px solid ${MG.blueDk}`, borderRadius: 4, padding: '1px 8px', fontWeight: 900, color: MG.blueDk, fontSize: 13, boxShadow: bevel('rgba(255,255,255,0.7)', 'rgba(0,0,0,0.25)') };
  return (
    <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
      <span style={plate}><Coin size={15} /> {bucks.toLocaleString()}</span>
      {tickets !== undefined && <span style={plate}><TicketIcon size={15} /> {tickets.toLocaleString()}</span>}
    </div>
  );
}
