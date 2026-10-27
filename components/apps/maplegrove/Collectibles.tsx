'use client';
/* eslint-disable @next/next/no-img-element */

import { MG } from './ui';
import { Avatar } from './Avatar';
import { residentById } from '@/lib/maplegrove/npcs';
import type { Card, Sticker } from '@/lib/maplegrove/collectibles';

const CARD_ART = new Set([
  'c_mayor','c_audrey','c_olivia','c_theo','c_walt','c_june','c_raj','c_lena',
  'c_principal','c_gram','c_maya','c_nora','c_hazel','c_sam',
  'c_townhall','c_fountain','c_arcade','c_academy','c_bigmaple','c_orchard','c_river','c_pool','c_eagan',
]);

export function CardFace({ card, w = 110, dim = false, count }: { card: Card; w?: number; dim?: boolean; count?: number }) {
  const landscape = card.set === 'landmarks';
  const boxW = landscape ? Math.round(w * 1.5) : w;
  const h = landscape ? Math.round((w * 1.5) / 1.4) : Math.round(w * 1.4);
  const npc = card.npc ? residentById(card.npc) : undefined;

  if (CARD_ART.has(card.id)) {
    return (
      <div title={dim ? 'Not collected yet' : card.caption}
        style={{ width: boxW, height: h, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          filter: dim ? 'grayscale(1) brightness(0.9)' : 'none', opacity: dim ? 0.55 : 1 }}>
        <img src={`/maplegrove/icons/cards/${card.id}.png`} alt="" draggable={false}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block',
            filter: dim ? 'none' : 'drop-shadow(0 3px 3px rgba(0,0,0,0.3))' }} />
        {dim && <span style={{ position: 'absolute', fontSize: w * 0.3, fontWeight: 900, color: 'rgba(60,50,40,0.6)' }}>?</span>}
        {count && count > 1 && <span style={{ position: 'absolute', top: 2, right: 2, background: MG.gold, border: `1px solid ${MG.goldDk}`, borderRadius: 10, fontSize: 10, fontWeight: 800, padding: '0 5px' }}>x{count}</span>}
      </div>
    );
  }

  return (
    <div title={dim ? 'Not collected yet' : card.caption}
      style={{ width: w, height: h, borderRadius: 8, background: dim ? '#e5e0d6' : `linear-gradient(160deg, ${card.color}, ${MG.paper} 70%)`, border: `2px solid ${dim ? '#c9c2b0' : '#3b3050'}`,
        display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', boxShadow: dim ? 'none' : '0 3px 0 rgba(0,0,0,0.2)', filter: dim ? 'grayscale(1)' : 'none', opacity: dim ? 0.6 : 1 }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {npc ? <Avatar a={npc.avatar} size={w * 0.85} bust /> : (
          <svg width={w * 0.7} height={w * 0.7} viewBox="0 0 100 100"><rect x="20" y="40" width="60" height="45" fill={card.color} stroke="#3b3050" strokeWidth="3" /><path d="M14 42 L50 14 L86 42 Z" fill="#3b3050" /><rect x="42" y="60" width="16" height="25" fill="#fffaf0" /></svg>
        )}
      </div>
      <div style={{ background: 'rgba(255,250,240,0.95)', padding: '4px 6px', borderTop: '2px solid #3b3050' }}>
        <div style={{ fontSize: Math.max(9, w * 0.095), fontWeight: 800, color: MG.ink, lineHeight: 1.1 }}>{dim ? '???' : card.name}</div>
        <div style={{ fontSize: Math.max(8, w * 0.07), color: MG.sub, fontWeight: 700, textTransform: 'uppercase' }}>{card.rarity}</div>
      </div>
      {count && count > 1 && <span style={{ position: 'absolute', top: 4, right: 4, background: MG.gold, border: `1px solid ${MG.goldDk}`, borderRadius: 10, fontSize: 10, fontWeight: 800, padding: '0 6px' }}>×{count}</span>}
    </div>
  );
}

export function StickerBadge({ st, owned, size = 56 }: { st: Sticker; owned: boolean; size?: number }) {
  const tilt = ((st.id.length * 7) % 21) - 10;
  if (owned) {
    return (
      <div title={st.name} style={{ width: size, height: size, transform: `rotate(${tilt}deg)`, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
        <img src={`/maplegrove/icons/stickers/${st.id}.png`} alt="" draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'contain', maxWidth: 'none', display: 'block' }} />
      </div>
    );
  }
  return (
    <div title={`${st.name} - ${st.hint}`}
      style={{ width: size, height: size, borderRadius: '50%', background: '#e5e0d6', border: '3px solid #d0c9bb',
        boxShadow: 'inset 0 0 0 2px #e5e0d6, 0 0 0 1px #c9c2b0', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#b9b2a2', fontWeight: 800, fontSize: size * 0.4 }}>
      ?
    </div>
  );
}

