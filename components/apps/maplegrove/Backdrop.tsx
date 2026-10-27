'use client';

import React, { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { MG, FONT_TITLE, bevel } from './ui';

export interface BgDef { src: string; w: number; h: number; focus?: [number, number]; fit?: 'cover' | 'width' | 'contain' }
const B = '/maplegrove/bg';
export const BG = {
  map:        { src: `${B}/map.jpg`,        w: 1513, h: 1039, focus: [50, 50], fit: 'width' },
  downtown:   { src: `${B}/downtown.jpg`,   w: 1774, h: 887,  focus: [50, 58] },
  mainstreet: { src: `${B}/mainstreet.jpg`, w: 1536, h: 1024, focus: [50, 55] },
  oakwood:    { src: `${B}/oakwood.jpg`,    w: 1739, h: 904,  focus: [50, 55] },
  park:       { src: `${B}/park.jpg`,       w: 1536, h: 1024, focus: [50, 52] },
  farm:       { src: `${B}/farm.jpg`,       w: 1536, h: 1024, focus: [50, 62] },
  lakeville:  { src: `${B}/lakeville.jpg`,  w: 1778, h: 885,  focus: [50, 55] },
  woodbury:   { src: `${B}/woodbury.jpg`,   w: 1536, h: 1024, focus: [50, 58] },
  eagan:      { src: `${B}/eagan.jpg`,      w: 1739, h: 904,  focus: [50, 55] },
  applevalley:{ src: `${B}/applevalley.jpg`,w: 1739, h: 904,  focus: [50, 55] },
  academy:    { src: `${B}/academy.jpg`,    w: 1672, h: 941,  focus: [50, 58] },
  cafe:       { src: `${B}/cafe.jpg`,       w: 1774, h: 887,  focus: [50, 80] },
  arcade:     { src: `${B}/arcade.jpg`,     w: 1536, h: 1024, focus: [50, 58] },
  mart:       { src: `${B}/mart.jpg`,       w: 1746, h: 901,  focus: [50, 60] },
  furniture:  { src: `${B}/furniture.jpg`,  w: 1536, h: 1024, focus: [50, 58] },
  bank:       { src: `${B}/bank.jpg`,       w: 1536, h: 1024, focus: [50, 56] },
  threads:    { src: `${B}/threads.jpg`,    w: 1536, h: 1024, focus: [50, 55] },
  gazette:    { src: `${B}/gazette.jpg`,    w: 1801, h: 873,  focus: [50, 60] },
  townhall:   { src: `${B}/townhall.jpg`,   w: 1774, h: 887,  focus: [50, 55] },
  postoffice: { src: `${B}/postoffice.jpg`, w: 1774, h: 887,  focus: [50, 60] },
  room_bedroom_blue: { src: `${B}/room_bedroom_blue.jpg`, w: 1746, h: 901, focus: [50, 60] },
  room_bedroom_butter: { src: `${B}/room_bedroom_butter.jpg`, w: 1746, h: 901, focus: [50, 60] },
  room_bedroom_dusty: { src: `${B}/room_bedroom_dusty.jpg`, w: 1746, h: 901, focus: [50, 60] },
  room_bedroom_lavender: { src: `${B}/room_bedroom_lavender.jpg`, w: 1746, h: 901, focus: [50, 60] },
  room_bedroom_forest: { src: `${B}/room_bedroom_forest.jpg`, w: 1746, h: 901, focus: [50, 60] },
  room_bedroom_navy: { src: `${B}/room_bedroom_navy.jpg`, w: 1746, h: 901, focus: [50, 60] },
  room_bedroom_wave: { src: `${B}/room_bedroom_wave.jpg`, w: 1746, h: 901, focus: [50, 60] },
  room_living:  { src: `${B}/room_living.jpg`,  w: 1536, h: 668, focus: [50, 50] },
  room_living_green: { src: `${B}/room_living_green.jpg`, w: 1536, h: 1024, focus: [50, 62] },
  room_living_cream: { src: `${B}/room_living_cream.jpg`, w: 1536, h: 1024, focus: [50, 62] },
  room_living_sky: { src: `${B}/room_living_sky.jpg`, w: 1536, h: 1024, focus: [50, 62] },
  room_living_mint: { src: `${B}/room_living_mint.jpg`, w: 1536, h: 1024, focus: [50, 62] },
  room_living_rose: { src: `${B}/room_living_rose.jpg`, w: 1536, h: 1024, focus: [50, 62] },
  room_living_stripe: { src: `${B}/room_living_stripe.jpg`, w: 1536, h: 1024, focus: [50, 62] },
  room_living_stars: { src: `${B}/room_living_stars.jpg`, w: 1536, h: 1024, focus: [50, 62] },

  room_bedroom: { src: `${B}/room_bedroom.jpg`, w: 1746, h: 759, focus: [50, 50] },
  room_kitchen: { src: `${B}/room_kitchen.jpg`, w: 1536, h: 668, focus: [50, 50] },
  grandma_living: { src: `${B}/grandma_living.jpg`, w: 1746, h: 759, focus: [50, 50] },
} satisfies Record<string, BgDef>;
export type BgName = keyof typeof BG;

export const PEOPLE_Z = 10;

interface Rect { x: number; y: number; w: number; h: number }

function coverRect(cw: number, ch: number, iw: number, ih: number, focus: [number, number]): Rect {
  const s = Math.max(cw / iw, ch / ih);
  const w = iw * s, h = ih * s;
  const x = (cw - w) * (focus[0] / 100);
  const y = (ch - h) * (focus[1] / 100);
  return { x, y, w, h };
}

export function Backdrop({ bg, children, overlay, people, style, dim }: {
  bg: BgName; children?: ReactNode; overlay?: ReactNode; style?: CSSProperties;
  people?: ReactNode;
  dim?: number;
}) {
  const def = BG[bg] as BgDef;
  const kids = React.Children.toArray(children);
  const isOv = (k: ReactNode) => React.isValidElement(k) && typeof k.type === 'function' && !!(k.type as unknown as { isOverlay?: boolean }).isOverlay;
  const inPainting = kids.filter((k) => !isOv(k));
  const pinned = kids.filter(isOv);
  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const upd = () => {
      if (def.fit === 'width') { const w = el.clientWidth; const h = (def.h / def.w) * w; setRect({ x: 0, y: Math.max(0, (el.clientHeight - h) / 2), w, h }); }
      else if (def.fit === 'contain') { const cw = el.clientWidth, ch = el.clientHeight; const sc = Math.min(cw / def.w, ch / def.h); const w = def.w * sc, h = def.h * sc; setRect({ x: (cw - w) / 2, y: 0, w, h }); }
      else setRect(coverRect(el.clientWidth, el.clientHeight, def.w, def.h, def.focus ?? [50, 50]));
    };
    upd();
    const ro = new ResizeObserver(upd); ro.observe(el);
    return () => ro.disconnect();
  }, [def]);
  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, overflow: def.fit === 'width' ? 'hidden auto' : 'hidden', background: '#0f2f7a', ...style }}>
      {rect && (
        <div style={{ position: def.fit === 'width' ? 'relative' : 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h }}>
          <img src={def.src} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', userSelect: 'none', pointerEvents: 'none' }} />
          {dim ? <div style={{ position: 'absolute', inset: 0, background: `rgba(10,20,50,${dim})` }} /> : null}
          {inPainting}
        </div>
      )}
      {pinned}
      {people && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: PEOPLE_Z }}><div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>{people}</div></div>}
      {overlay}
    </div>
  );
}

export function Hotspot({ x, y, w, h, label, onClick, disabled, sub, z = 3, labelAt = 'top', silent }: {
  x: number; y: number; w: number; h: number; label: string; onClick?: () => void; disabled?: boolean; sub?: string; z?: number; labelAt?: 'top' | 'bottom' | 'center'; silent?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} aria-label={label} data-hotspot={label}
      style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, zIndex: z, padding: 0, background: 'transparent',
        border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', outline: 'none' }}>
      {hov && !silent && (
        <span style={{ position: 'absolute',
          ...(x + w / 2 < 18 ? { left: 0, transform: 'none' } : x + w / 2 > 82 ? { right: 0, transform: 'none' } : { left: '50%', transform: 'translateX(-50%)' }),
          ...(labelAt === 'top' ? { bottom: '100%', marginBottom: 4 } : labelAt === 'bottom' ? { top: '100%', marginTop: 4 } : { top: '50%' }),
          background: disabled ? '#5a5a5a' : MG.blue, color: disabled ? '#ddd' : MG.gold, fontFamily: FONT_TITLE, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.2, padding: '2px 7px', borderRadius: 4,
          border: `2px solid ${MG.blueDk}`, boxShadow: bevel(), whiteSpace: 'normal', width: 'max-content', maxWidth: 150, pointerEvents: 'none', textShadow: '1px 1px 0 rgba(0,0,0,0.5)', lineHeight: 1.2 }}>
          {label}{sub && <span style={{ display: 'block', fontFamily: 'Verdana, sans-serif', fontSize: 8, color: '#fff', textTransform: 'none', letterSpacing: 0, fontWeight: 700 }}>{sub}</span>}
        </span>
      )}
    </button>
  );
}

export function Caption({ children }: { children: ReactNode }) {
  void children;
  const show = false; const setShow = (_v: boolean) => { void _v; };
  if (!show) return null;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 8, zIndex: 25, textAlign: 'center', pointerEvents: 'none' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, maxWidth: '86%', background: 'rgba(15,47,122,0.88)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 6px 3px 12px', borderRadius: 6, border: `2px solid ${MG.gold}`, textShadow: '1px 1px 0 rgba(0,0,0,0.5)', pointerEvents: 'auto' }}>
        <span>{children}</span>
        <button onClick={() => setShow(false)} title="Close" aria-label="Close message"
          style={{ width: 18, height: 18, borderRadius: 3, border: `2px solid ${MG.blueDk}`, background: `linear-gradient(#ffe98a, ${MG.gold})`, color: MG.blueDk, fontWeight: 900, fontSize: 12, lineHeight: 1, cursor: 'pointer', padding: 0, flex: '0 0 18px' }}>×</button>
      </span>
    </div>
  );
}

export function Plaque({ children, soon, style }: { children: ReactNode; soon?: boolean; style?: CSSProperties }) {
  return (
    <span style={{ display: 'inline-block', background: `linear-gradient(#ffe98a, ${MG.gold})`, color: MG.blueDk, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 'clamp(9px, 1.3vw, 13px)', textTransform: 'uppercase',
      padding: '2px 10px', borderRadius: 4, border: `2px solid ${MG.blueDk}`, boxShadow: `${bevel()}, 2px 3px 0 rgba(0,0,0,0.35)`, whiteSpace: 'nowrap', opacity: soon ? 0.9 : 1, ...style }}>
      {children}{soon && <span style={{ fontSize: '0.65em', marginLeft: 5, fontFamily: 'Verdana, sans-serif', textTransform: 'none' }}>soon</span>}
    </span>
  );
}

export function ShopPanel({ title, onClose, children, width = '62%', side = 'right' }: { title: string; onClose: () => void; children: ReactNode; width?: string; side?: 'right' | 'left' }) {
  return (
    <div style={{ position: 'absolute', top: 8, bottom: 8, [side]: 8, width, maxWidth: 560, zIndex: 20, display: 'flex', flexDirection: 'column',
      background: MG.panel, border: `3px solid ${MG.blueDk}`, borderRadius: 6, boxShadow: `${bevel('rgba(255,255,255,0.8)', 'rgba(0,0,0,0.2)')}, 4px 5px 0 rgba(0,0,0,0.35)`, overflow: 'hidden' }}>
      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', background: `linear-gradient(${MG.blueLt}, ${MG.blue})`, borderBottom: `2px solid ${MG.blueDk}` }}>
        <span style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 13, color: MG.gold, textTransform: 'uppercase', textShadow: `1px 1px 0 ${MG.blueDk}, 2px 2px 0 rgba(0,0,0,0.4)`, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
        <button onClick={onClose} title="Close" style={{ width: 20, height: 20, border: `2px solid ${MG.blueDk}`, borderRadius: 3, background: `linear-gradient(#ffe98a, ${MG.gold})`, color: MG.blueDk, fontWeight: 900, fontSize: 12, lineHeight: 1, cursor: 'pointer', padding: 0, boxShadow: bevel() }}>×</button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 8 }}>{children}</div>
    </div>
  );
}
