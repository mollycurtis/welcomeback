'use client';
/* eslint-disable @next/next/no-img-element */

import type { FurniItem } from '@/lib/maplegrove/catalog';

function shade(hex: string, t: number) {
  const m = hex.replace('#', '');
  const r = parseInt(m.slice(0, 2), 16), g = parseInt(m.slice(2, 4), 16), b = parseInt(m.slice(4, 6), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + (t < 0 ? v * t : (255 - v) * t))));
  return `#${[f(r), f(g), f(b)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

const PAINTED = new Set([
  'chair_wood','chair_comfy','stool_round','sofa_blue','sofa_cream','sofa_plush',
  'table_small','table_coffee','table_dining','bed_basic','bed_cozy','bed_bunk',
  'shelf_books','dresser_oak','shelf_cubes','lamp_desk','lamp_floor','lamp_paper',
  'plant_fern','plant_tall','plant_flower','plant_maple','tv_crt','console_game','tv_flat',
  'cabinet_mini','rug_round','rug_stripe','rug_star','poster_band','poster_maple',
  'window_round','clock_wall','poster_arcade','trophy_acorn','trophy_gold','plush_bear',
  'ev_bloom_wreath','ev_carnival_plush','ev_harvest_pumpkin','ev_winter_lights',
]);

export function Furniture({ item, w, h }: { item: FurniItem; w: number | string; h: number | string }) {
  if (PAINTED.has(item.id)) {
    return <img src={`/maplegrove/icons/furniture/${item.id}.png`} alt="" draggable={false}
      style={{ width: w, height: h, objectFit: h === 'auto' ? undefined : 'contain', maxWidth: 'none', display: 'block', pointerEvents: 'none' }} />;
  }
  const c1 = item.c1, c2 = item.c2, d1 = shade(c1, -0.18), l1 = shade(c1, 0.18);
  const W = 100, H = 100;
  const body = (x: number, y: number, bw: number, bh: number, r = 8, fill = c1) =>
    <rect x={x} y={y} width={bw} height={bh} rx={r} fill={fill} stroke={d1} strokeWidth="3" />;

  let inner: React.ReactNode = null;
  switch (item.kind) {
    case 'chair':
      inner = (<g>{body(22, 18, 56, 18, 6)}{body(26, 34, 48, 44, 6)}<rect x="30" y="40" width="40" height="14" rx="4" fill={l1} /></g>); break;
    case 'stool':
      inner = (<g><ellipse cx="50" cy="42" rx="30" ry="14" fill={c1} stroke={d1} strokeWidth="3" /><rect x="30" y="50" width="6" height="34" fill={d1} /><rect x="64" y="50" width="6" height="34" fill={d1} /></g>); break;
    case 'sofa':
      inner = (<g>{body(6, 30, 88, 50, 12)}{body(6, 16, 16, 60, 8)}{body(78, 16, 16, 60, 8)}<rect x="26" y="40" width="22" height="26" rx="5" fill={l1} /><rect x="52" y="40" width="22" height="26" rx="5" fill={l1} /></g>); break;
    case 'table':
      inner = (<g><rect x="10" y="34" width="80" height="16" rx="5" fill={c1} stroke={d1} strokeWidth="3" /><rect x="16" y="50" width="7" height="34" fill={d1} /><rect x="77" y="50" width="7" height="34" fill={d1} /><rect x="14" y="36" width="72" height="5" fill={l1} /></g>); break;
    case 'bed':
      inner = (<g><rect x="8" y="46" width="84" height="40" rx="8" fill={c2} stroke={d1} strokeWidth="3" /><rect x="8" y="30" width="26" height="44" rx="8" fill={c1} stroke={d1} strokeWidth="3" /><rect x="38" y="40" width="40" height="16" rx="6" fill="#fff" stroke="#d8d2c4" strokeWidth="2" /></g>); break;
    case 'shelf':
      inner = (<g><rect x="20" y="10" width="60" height="80" rx="4" fill={c1} stroke={d1} strokeWidth="3" /><rect x="24" y="30" width="52" height="4" fill={d1} /><rect x="24" y="54" width="52" height="4" fill={d1} /><rect x="28" y="14" width="8" height="14" fill={c2} /><rect x="40" y="14" width="8" height="14" fill="#c63a2b" /><rect x="28" y="38" width="8" height="14" fill="#3f6fb0" /></g>); break;
    case 'dresser':
      inner = (<g><rect x="14" y="26" width="72" height="58" rx="5" fill={c1} stroke={d1} strokeWidth="3" /><rect x="20" y="34" width="60" height="20" rx="3" fill={l1} /><rect x="20" y="58" width="60" height="20" rx="3" fill={l1} /><circle cx="50" cy="44" r="3" fill={d1} /><circle cx="50" cy="68" r="3" fill={d1} /></g>); break;
    case 'lamp':
      inner = (<g><path d="M34 24 H66 L60 44 H40 Z" fill={c1} stroke={d1} strokeWidth="3" /><rect x="47" y="44" width="6" height="36" fill={d1} /><rect x="38" y="80" width="24" height="6" rx="3" fill={d1} /></g>); break;
    case 'floorlamp':
      inner = (<g><ellipse cx="50" cy="22" rx="20" ry="12" fill={c1} stroke={d1} strokeWidth="3" /><rect x="47" y="30" width="6" height="52" fill={d1} /><rect x="36" y="82" width="28" height="6" rx="3" fill={d1} /></g>); break;
    case 'plant':
      inner = (<g><circle cx="50" cy="34" r="22" fill={c1} /><circle cx="36" cy="40" r="14" fill={shade(c1, 0.12)} /><circle cx="64" cy="40" r="14" fill={shade(c1, -0.1)} />{item.id === 'plant_maple' && <circle cx="50" cy="28" r="6" fill="#e7b54a" />}<path d="M36 58 H64 L60 86 H40 Z" fill={c2} stroke={shade(c2, -0.2)} strokeWidth="3" /></g>); break;
    case 'tv':
      inner = (<g><rect x="10" y="20" width="80" height="52" rx="5" fill={c1} stroke={d1} strokeWidth="3" /><rect x="16" y="26" width="68" height="40" rx="3" fill={c2} /><rect x="34" y="72" width="32" height="6" fill={d1} /><rect x="20" y="78" width="60" height="6" rx="3" fill={d1} /></g>); break;
    case 'console':
      inner = (<g><rect x="20" y="44" width="60" height="30" rx="6" fill={c1} stroke={d1} strokeWidth="3" /><circle cx="36" cy="59" r="6" fill={c2} /><rect x="52" y="54" width="20" height="10" rx="3" fill={shade(c1, 0.2)} /></g>); break;
    case 'rug':
      inner = (<g><rect x="6" y="20" width="88" height="60" rx="10" fill={c1} stroke={shade(c1, -0.2)} strokeWidth="3" /><rect x="18" y="30" width="64" height="40" rx="6" fill="none" stroke={c2} strokeWidth="4" />{item.id === 'rug_star' && <path d="M50 36 l4 9 l10 .6 l-7.6 6.4 l2.4 9.6 l-8.8-5.4 l-8.8 5.4 l2.4-9.6 l-7.6-6.4 l10-.6 Z" fill={c2} />}</g>); break;
    case 'poster':
      inner = (<g><rect x="22" y="14" width="56" height="72" rx="3" fill={c1} stroke="#2a2a2a" strokeWidth="3" /><circle cx="50" cy="40" r="14" fill={c2} /><rect x="32" y="62" width="36" height="6" fill={shade(c2, 0.2)} /></g>); break;
    case 'window':
      inner = (<g><rect x="16" y="14" width="68" height="72" rx="6" fill="#e6dcc4" stroke="#b59a6a" strokeWidth="4" /><rect x="22" y="20" width="56" height="60" rx="3" fill={c1} /><rect x="48" y="20" width="4" height="60" fill="#b59a6a" /><rect x="22" y="48" width="56" height="4" fill="#b59a6a" /></g>); break;
    case 'clock':
      inner = (<g><circle cx="50" cy="50" r="32" fill={c1} stroke={c2} strokeWidth="4" /><rect x="48" y="30" width="4" height="22" rx="2" fill={c2} /><rect x="50" y="48" width="18" height="4" rx="2" fill={c2} /><circle cx="50" cy="50" r="3" fill={c2} /></g>); break;
    case 'trophy':
      inner = (<g><path d="M30 18 H70 V40 Q70 60 50 62 Q30 60 30 40 Z" fill={c1} stroke={shade(c1, -0.25)} strokeWidth="3" /><path d="M30 24 Q14 26 20 40 Q26 48 32 44 M70 24 Q86 26 80 40 Q74 48 68 44" fill="none" stroke={shade(c1, -0.25)} strokeWidth="4" /><rect x="44" y="62" width="12" height="12" fill={c2} /><rect x="30" y="74" width="40" height="12" rx="3" fill={c2} /></g>); break;
    case 'plush':
      inner = (<g><circle cx="32" cy="34" r="10" fill={c1} stroke={d1} strokeWidth="3" /><circle cx="68" cy="34" r="10" fill={c1} stroke={d1} strokeWidth="3" /><circle cx="50" cy="44" r="22" fill={c1} stroke={d1} strokeWidth="3" /><ellipse cx="50" cy="74" rx="22" ry="14" fill={c1} stroke={d1} strokeWidth="3" /><circle cx="43" cy="40" r="2.5" fill="#2a2a2a" /><circle cx="57" cy="40" r="2.5" fill="#2a2a2a" /><ellipse cx="50" cy="50" rx="6" ry="4" fill={c2} /></g>); break;
    case 'pumpkin':
      inner = (<g><rect x="46" y="18" width="8" height="14" rx="3" fill={c2} /><ellipse cx="50" cy="60" rx="36" ry="28" fill={c1} stroke={shade(c1, -0.25)} strokeWidth="3" /><path d="M36 34 Q30 60 36 86 M50 32 V88 M64 34 Q70 60 64 86" fill="none" stroke={shade(c1, -0.2)} strokeWidth="3" /></g>); break;
    case 'lights':
      inner = (<g><path d="M6 40 Q30 62 50 40 Q70 62 94 40" fill="none" stroke={c2} strokeWidth="3" />{[14, 30, 50, 70, 86].map((x, i) => <g key={x}><rect x={x - 3} y={i % 2 ? 42 : 50} width="6" height="6" fill={c2} /><circle cx={x} cy={(i % 2 ? 42 : 50) + 14} r="7" fill={['#f4e08a', '#e34848', '#4f9b46', '#3f6fb0', '#e88ab0'][i]} stroke="#fff" strokeWidth="1" /></g>)}</g>); break;
    case 'wreath':
      inner = (<g><circle cx="50" cy="52" r="30" fill="none" stroke={c2} strokeWidth="14" />{[0, 60, 120, 180, 240, 300].map((d) => <circle key={d} cx={50 + Math.cos((d * Math.PI) / 180) * 30} cy={52 + Math.sin((d * Math.PI) / 180) * 30} r="7" fill={c1} stroke={shade(c1, -0.2)} strokeWidth="2" />)}<path d="M40 14 H60 L50 24 Z" fill={c1} /></g>); break;
    default:
      inner = body(16, 16, 68, 68, 8);
  }

  return (
    <svg width={w} height={h} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block', imageRendering: 'pixelated', overflow: 'visible' }}>
      {inner}
    </svg>
  );
}
