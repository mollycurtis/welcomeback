'use client';

import React, { useState } from 'react';
import { MG } from './ui';
import { Hud } from './Hud';
import { Backdrop, Caption, type BgName } from './Backdrop';
import { Avatar } from './Avatar';
import { PlayerSprite } from './Residents';
const LOC_FOR_BG: Record<string, MGLocation> = { oakwood: 'oakwood', park: 'park', academy: 'academy', downtown: 'town', farm: 'farm', lakeville: 'riverside', woodbury: 'pineridge', eagan: 'county', applevalley: 'applevalley' };
import { useMaple, type MGLocation } from '@/store/maplegrove';

const ink = '#3a2f23';

export function Sun({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      {[...Array(12)].map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={30 + Math.cos(a) * 19} y1={30 + Math.sin(a) * 19} x2={30 + Math.cos(a) * 27} y2={30 + Math.sin(a) * 27} stroke="#ffd64a" strokeWidth="3" strokeLinecap="round" />;
      })}
      <circle cx="30" cy="30" r="17" fill="#ffdc5a" stroke="#f0b400" strokeWidth="2" />
    </svg>
  );
}

export function Cloud({ w = 100 }: { w?: number }) {
  return (
    <svg width={w} height={w * 0.5} viewBox="0 0 100 50">
      <g fill="#ffffff" stroke="#dfe7ef" strokeWidth="1.5">
        <ellipse cx="34" cy="32" rx="24" ry="15" />
        <ellipse cx="58" cy="26" rx="22" ry="18" />
        <ellipse cx="74" cy="34" rx="18" ry="12" />
      </g>
    </svg>
  );
}

export function Tree({ w = 74 }: { w?: number }) {
  return (
    <svg width={w} height={w * 1.25} viewBox="0 0 80 100">
      <rect x="35" y="62" width="10" height="34" fill="#7a5230" stroke="#5d3e23" strokeWidth="2" />
      <g fill="#4f9b46" stroke="#37722f" strokeWidth="2.5">
        <circle cx="40" cy="36" r="30" />
        <circle cx="22" cy="50" r="18" />
        <circle cx="58" cy="50" r="18" />
      </g>
      <circle cx="32" cy="30" r="9" fill="#62b257" opacity="0.7" />
    </svg>
  );
}

export function Pine({ w = 56 }: { w?: number }) {
  return (
    <svg width={w} height={w * 1.5} viewBox="0 0 56 84">
      <rect x="24" y="64" width="8" height="18" fill="#7a5230" stroke="#5d3e23" strokeWidth="2" />
      <g fill="#3f8a4a" stroke="#2c6a36" strokeWidth="2">
        <path d="M28 6 L46 36 H10 Z" />
        <path d="M28 26 L50 56 H6 Z" />
        <path d="M28 44 L52 70 H4 Z" />
      </g>
    </svg>
  );
}

export function House({ w = 130, roof = '#c4673b', body = '#efe3c8' }: { w?: number; roof?: string; body?: string }) {
  return (
    <svg width={w} height={w * 0.9} viewBox="0 0 130 117">
      <rect x="16" y="52" width="98" height="62" fill={body} stroke={ink} strokeWidth="2.5" />
      <path d="M8 54 L65 14 L122 54 Z" fill={roof} stroke="#7d3f23" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="54" y="78" width="22" height="36" fill="#8a5a36" stroke={ink} strokeWidth="2" />
      <rect x="26" y="66" width="22" height="20" fill="#bfe0ee" stroke={ink} strokeWidth="2" />
      <rect x="82" y="66" width="22" height="20" fill="#bfe0ee" stroke={ink} strokeWidth="2" />
      <rect x="70" y="20" width="14" height="20" fill="#8a5a36" stroke={ink} strokeWidth="2" />
    </svg>
  );
}

export function Barn({ w = 168 }: { w?: number }) {
  return (
    <svg width={w} height={w * 0.82} viewBox="0 0 168 138">
      <rect x="18" y="58" width="132" height="78" fill="#b8472f" stroke="#7d2c1c" strokeWidth="3" />
      <path d="M10 60 L40 24 H128 L158 60 Z" fill="#9a3a26" stroke="#7d2c1c" strokeWidth="3" strokeLinejoin="round" />
      <rect x="66" y="84" width="36" height="52" fill="#8a3320" stroke="#5e2114" strokeWidth="2.5" />
      <path d="M66 84 L102 136 M102 84 L66 136" stroke="#e7d9c2" strokeWidth="3" />
      <rect x="74" y="44" width="20" height="20" fill="#e7d9c2" stroke="#7d2c1c" strokeWidth="2" />
      <path d="M74 54 H94 M84 44 V64" stroke="#7d2c1c" strokeWidth="2" />
    </svg>
  );
}

export function Silo({ w = 52 }: { w?: number }) {
  return (
    <svg width={w} height={w * 2.5} viewBox="0 0 52 130">
      <rect x="8" y="26" width="36" height="104" fill="#c9cdd2" stroke="#8c9096" strokeWidth="2.5" />
      <path d="M6 28 Q26 0 46 28 Z" fill="#9aa0a6" stroke="#73777c" strokeWidth="2.5" />
      {[44, 64, 84, 104].map((y) => <line key={y} x1="9" y1={y} x2="43" y2={y} stroke="#a9adb2" strokeWidth="1.5" />)}
    </svg>
  );
}

export function Windmill({ w = 84 }: { w?: number }) {
  return (
    <svg width={w} height={w * 1.7} viewBox="0 0 84 143">
      <path d="M30 142 L36 56 H48 L54 142 Z" fill="#9a9aa2" stroke="#6c6c74" strokeWidth="2" />
      {[18, 60, 102].map((y) => <line key={y} x1="33" y1={y} x2="51" y2={y} stroke="#6c6c74" strokeWidth="2" />)}
      <g stroke="#5d3e23" strokeWidth="2" fill="#caa24a">
        {[0, 60, 120, 180, 240, 300].map((d) => (
          <g key={d} transform={`rotate(${d} 42 50)`}>
            <path d="M42 50 L46 18 L40 18 Z" />
          </g>
        ))}
      </g>
      <circle cx="42" cy="50" r="5" fill="#6c6c74" />
    </svg>
  );
}

export function CornRows({ w = 280 }: { w?: number }) {
  const cols = Math.floor(w / 14);
  return (
    <svg width={w} height={70} viewBox={`0 0 ${cols * 14} 70`}>
      <rect x="0" y="40" width={cols * 14} height="30" fill="#7a5a32" />
      {[...Array(cols)].map((_, i) => (
        <g key={i} transform={`translate(${i * 14 + 6},0)`}>
          <line x1="0" y1="66" x2="0" y2="20" stroke="#4f8a35" strokeWidth="3" />
          <path d="M0 30 q-8 -4 -10 4 M0 38 q8 -4 10 4 M0 46 q-8 -4 -10 4" stroke="#5fa040" strokeWidth="2.5" fill="none" />
          <ellipse cx="0" cy="20" rx="3.5" ry="8" fill="#e0b53a" />
        </g>
      ))}
    </svg>
  );
}

export function Fence({ w = 220 }: { w?: number }) {
  const posts = Math.floor(w / 36);
  return (
    <svg width={w} height={50} viewBox={`0 0 ${posts * 36} 50`}>
      <rect x="0" y="14" width={posts * 36} height="6" fill="#c79a5c" />
      <rect x="0" y="30" width={posts * 36} height="6" fill="#c79a5c" />
      {[...Array(posts)].map((_, i) => <rect key={i} x={i * 36 + 4} y="4" width="8" height="44" fill="#b3854a" stroke="#8a6334" strokeWidth="1.5" />)}
    </svg>
  );
}

export function Sailboat({ w = 70, sail = '#ffffff' }: { w?: number; sail?: string }) {
  return (
    <svg width={w} height={w * 1.1} viewBox="0 0 70 77">
      <path d="M8 58 H62 L54 70 H16 Z" fill="#9a5a32" stroke="#6f3f22" strokeWidth="2" />
      <line x1="35" y1="10" x2="35" y2="58" stroke="#6f3f22" strokeWidth="2.5" />
      <path d="M37 14 L60 54 H37 Z" fill={sail} stroke="#cfd6dd" strokeWidth="1.5" />
      <path d="M33 18 L14 54 H33 Z" fill={sail} stroke="#cfd6dd" strokeWidth="1.5" />
    </svg>
  );
}

export function Dock({ w = 160 }: { w?: number }) {
  return (
    <svg width={w} height={54} viewBox="0 0 160 54">
      <rect x="0" y="8" width="160" height="14" fill="#a9824e" stroke="#7d5d33" strokeWidth="2" />
      {[10, 40, 70, 100, 130, 150].map((x) => <rect key={x} x={x} y="20" width="7" height="30" fill="#7d5d33" />)}
    </svg>
  );
}

export function OfficeTower({ w = 92, h = 200, glass = '#86b0d8' }: { w?: number; h?: number; glass?: string }) {
  const rows = Math.floor(h / 28);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x="4" y="6" width={w - 8} height={h - 6} fill="#aeb6c0" stroke="#7c8490" strokeWidth="2.5" />
      {[...Array(rows)].map((_, r) =>
        [0.16, 0.42, 0.68].map((fx, c) => (
          <rect key={`${r}-${c}`} x={w * fx} y={18 + r * 26} width={w * 0.18} height="15" fill={glass} stroke="#5f7796" strokeWidth="1" />
        ))
      )}
    </svg>
  );
}

export function StripMall({ w = 260 }: { w?: number }) {
  const units = [['#d98a4a', 'SHOP'], ['#5aa3c2', 'CAFE'], ['#c25a8a', 'SALON'], ['#7aa84a', 'DELI']] as const;
  const uw = w / units.length;
  return (
    <svg width={w} height={104} viewBox={`0 0 ${w} 104`}>
      <rect x="0" y="22" width={w} height="82" fill="#e3dccb" stroke={ink} strokeWidth="2.5" />
      <rect x="-2" y="14" width={w + 4} height="12" fill="#b9a988" />
      {units.map(([col, label], i) => (
        <g key={i} transform={`translate(${i * uw},0)`}>
          <rect x="8" y="30" width={uw - 16} height="14" rx="2" fill={col} stroke={ink} strokeWidth="1.5" />
          <text x={uw / 2} y="41" fontSize="8" textAnchor="middle" fill="#fff" fontWeight="bold" fontFamily="Trebuchet MS">{label}</text>
          <rect x="10" y="54" width={uw - 20} height="38" fill="#bfe0ee" stroke={ink} strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}

export function Mall({ w = 430 }: { w?: number }) {
  return (
    <svg width={w} height={w * 0.34} viewBox="0 0 430 146">
      <rect x="6" y="40" width="418" height="106" fill="#d9cdb4" stroke={ink} strokeWidth="3" />
      <rect x="0" y="30" width="430" height="14" fill="#b6a785" />
      <path d="M160 40 q55 -34 110 0 Z" fill="#cfe0ee" stroke={ink} strokeWidth="2.5" />
      <rect x="176" y="92" width="78" height="54" fill="#9fbfe0" stroke={ink} strokeWidth="2.5" />
      <line x1="215" y1="92" x2="215" y2="146" stroke={ink} strokeWidth="2" />
      <rect x="150" y="52" width="130" height="22" rx="4" fill="#6b4fa0" stroke="#4d3a78" strokeWidth="2" />
      <text x="215" y="68" fontSize="13" textAnchor="middle" fill="#fff" fontWeight="bold" fontFamily="Trebuchet MS">MAPLE GROVE MALL</text>
      {[40, 92, 360, 408].map((x) => <rect key={x} x={x} y="64" width="34" height="34" fill="#bfe0ee" stroke={ink} strokeWidth="2" />)}
    </svg>
  );
}

export function AppleTree({ w = 84 }: { w?: number }) {
  return (
    <svg width={w} height={w * 1.2} viewBox="0 0 84 100">
      <rect x="37" y="60" width="10" height="36" fill="#7a5230" stroke="#5d3e23" strokeWidth="2" />
      <circle cx="42" cy="40" r="30" fill="#4f9b46" stroke="#37722f" strokeWidth="2.5" />
      {[[30, 32], [54, 34], [42, 50], [24, 46], [58, 50], [44, 26]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill="#d8392f" stroke="#9a241c" strokeWidth="1" />
      ))}
    </svg>
  );
}

export function Fountain({ w = 140 }: { w?: number }) {
  return (
    <svg width={w} height={w * 0.6} viewBox="0 0 140 84">
      <ellipse cx="70" cy="64" rx="64" ry="18" fill="#3f86c8" stroke="#2c5f93" strokeWidth="3" />
      <ellipse cx="70" cy="60" rx="64" ry="14" fill="#5aa0dc" />
      <rect x="62" y="30" width="16" height="30" fill="#bcc2c8" stroke="#8c9096" strokeWidth="2" />
      <ellipse cx="70" cy="32" rx="18" ry="6" fill="#bcc2c8" stroke="#8c9096" strokeWidth="2" />
      <path d="M70 30 q-10 -18 -18 -6 M70 30 q10 -18 18 -6 M70 28 V12" stroke="#bfe3f2" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function BallDiamond({ w = 250 }: { w?: number }) {
  return (
    <svg width={w} height={w * 0.62} viewBox="0 0 250 155">
      <path d="M125 18 L226 96 L125 150 L24 96 Z" fill="#6fae4c" stroke="#4f8a35" strokeWidth="3" />
      <path d="M125 60 L168 96 L125 130 L82 96 Z" fill="#c9a36a" stroke="#9c7a47" strokeWidth="2.5" />
      {[[125, 60], [168, 96], [125, 130], [82, 96]].map(([x, y], i) => <rect key={i} x={x - 5} y={y - 5} width="10" height="10" fill="#fff" stroke="#b9b9b9" strokeWidth="1.5" />)}
      <circle cx="125" cy="96" r="7" fill="#c9a36a" stroke="#9c7a47" strokeWidth="2" />
    </svg>
  );
}

export function Car({ w = 58, color = '#d24a4a' }: { w?: number; color?: string }) {
  return (
    <svg width={w} height={w * 0.5} viewBox="0 0 58 29">
      <path d="M3 22 L8 12 H20 L26 5 H40 L46 12 H54 L55 22 Z" fill={color} stroke="#5e2a2a" strokeWidth="2" strokeLinejoin="round" />
      <rect x="22" y="7" width="16" height="6" fill="#bfe0ee" />
      <circle cx="16" cy="23" r="5" fill="#2a2a2a" /><circle cx="42" cy="23" r="5" fill="#2a2a2a" />
    </svg>
  );
}

export function LampPost({ h = 80 }: { h?: number }) {
  return (
    <svg width={h * 0.4} height={h} viewBox={`0 0 ${h * 0.4} ${h}`}>
      <rect x={h * 0.18} y="14" width="4" height={h - 14} fill="#5a5a62" />
      <circle cx={h * 0.2} cy="12" r="8" fill="#ffe9a8" stroke="#caa24a" strokeWidth="2" />
    </svg>
  );
}

export function Scene({
  title, sky, ground, groundTop = 56, children, flavor, onTap, back = 'map', backLabel = 'Map', playerX = '50%', playerBottom = '7%', bg, overlay, playerSize = 84, loc,
}: {
  title: string; sky?: string; ground?: string; groundTop?: number;
  children?: React.ReactNode; flavor: string; onTap?: () => void;
  back?: Parameters<ReturnType<typeof useMaple.getState>['goTo']>[0]; backLabel?: string; playerX?: string; playerBottom?: string;
  bg?: BgName; overlay?: React.ReactNode; playerSize?: number; loc?: MGLocation;
}) {
  const goTo = useMaple((s) => s.goTo);
  const avatar = useMaple((s) => s.avatar);
  const kids = React.Children.toArray(children);
  const isPerson = (k: React.ReactNode) => React.isValidElement(k) && typeof k.type === 'function' && !!(k.type as unknown as { isPeople?: boolean }).isPeople;
  const people = kids.filter(isPerson);
  const rest = kids.filter((k) => !isPerson(k));
  const player = (loc || bg) ? <PlayerSprite loc={loc ?? (LOC_FOR_BG[bg as string] ?? 'town')} /> : (
    <div style={{ position: 'absolute', left: playerX, bottom: playerBottom, transform: 'translateX(-50%)', zIndex: 5 }}>
      <Avatar a={avatar} size={playerSize} />
    </div>
  );
  if (bg) {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <Hud title={title} onBack={() => goTo(back)} backLabel={backLabel} />
        <div style={{ position: 'relative', flex: 1 }}>
          <Backdrop bg={bg} overlay={<>{overlay}<Caption>{flavor}</Caption></>} people={people}>
            {rest}
            {player}
          </Backdrop>
        </div>
      </div>
    );
  }
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Hud title={title} onBack={() => goTo(back)} backLabel={backLabel} />
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden', background: sky }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: `${groundTop}%`, background: ground }} />
        {children}
        {player}
        <div style={{ position: 'absolute', top: 10, left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
          <span style={{ display: 'inline-block', background: MG.leaf, color: '#fff', fontWeight: 800, fontSize: 17, padding: '4px 22px', borderRadius: 20, border: `2px solid ${MG.leafDk}`, boxShadow: `0 3px 0 ${MG.leafDk}` }}>
            {title}
          </span>
        </div>
        <Caption>{flavor}</Caption>
        {onTap && <button onClick={onTap} aria-label="look around" style={{ position: 'absolute', inset: 0, background: 'transparent', border: 'none', cursor: 'pointer' }} />}
      </div>
    </div>
  );
}

export function Place({ x, bottom, z = 2, children }: { x: string; bottom: string; z?: number; children: React.ReactNode }) {
  return <div style={{ position: 'absolute', left: x, bottom, transform: 'translateX(-50%)', zIndex: z }}>{children}</div>;
}

export function useToast() {
  const [toast, setToast] = useState('');
  const flash = (m: string) => { setToast(m); window.setTimeout(() => setToast(''), 3600); };
  const node = toast ? (
    <div style={{ position: 'absolute', left: '50%', top: '44%', transform: 'translate(-50%,-50%)', background: 'rgba(40,30,52,0.92)', color: '#fff', padding: '8px 16px', borderRadius: 10, fontWeight: 700, fontSize: 13, zIndex: 30 }}>
      {toast}
    </div>
  ) : null;
  return { flash, node };
}

