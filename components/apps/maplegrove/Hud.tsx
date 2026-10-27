'use client';

import { MG, Money, MGButton, FONT_TITLE, bevel } from './ui';
import { Avatar } from './Avatar';
import { useState } from 'react';
import { useMaple } from '@/store/maplegrove';
import { groceryById } from '@/lib/maplegrove/collectibles';
import { Pantry } from './Pantry';

export const HUD_H = 40;

const BACK_NAME: Record<string, string> = {
  map: 'Map', town: 'Town', oakwood: 'Rosemount', riverside: 'Lakeville', farm: 'Farmington',
  pineridge: 'Woodbury', county: 'Eagan', applevalley: 'Apple Valley', academy: 'Bloomington',
  park: 'Grove Park', arcade: 'Arcade', house: 'My House', neighbor: "Gram's",
  cafe: 'Café', maplemart: 'Maple Mart', threads: 'Threads', furniture: 'Maple Furniture',
  bank: 'Maple Bank', gazette: 'Gazette', townhall: 'Town Hall', postoffice: 'Post Office',
};

export function Hud({ title, onBack, backLabel }: { title?: string; onBack?: () => void; backLabel?: string }) {
  const prev = useMaple((s) => s.prevLocation);
  const [pantryOpen, setPantryOpen] = useState(false);
  const pantry = useMaple((s) => s.pantry);
  const pantryCount = Object.entries(pantry).reduce((n, [id, v]) => n + (groceryById(id) ? v : 0), 0);
  const name = useMaple((s) => s.name);
  const avatar = useMaple((s) => s.avatar);
  const bucks = useMaple((s) => s.bucks);
  const tickets = useMaple((s) => s.tickets);
  const goTo = useMaple((s) => s.goTo);
  const back = onBack ?? (() => goTo(prev ?? 'town'));
  const label = backLabel ?? BACK_NAME[prev ?? 'town'] ?? 'Back';
  return (
    <div style={{ height: HUD_H, flex: `0 0 ${HUD_H}px`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', zIndex: 30, position: 'relative',
      background: `linear-gradient(${MG.blueLt} 0%, ${MG.blue} 45%, ${MG.blueDk} 100%)`, borderBottom: `2px solid ${MG.blueDk}`, boxShadow: bevel('rgba(255,255,255,0.35)', 'rgba(0,0,0,0.4)'), color: '#fff' }}>
      <button onClick={() => goTo('house')} title="My house" style={{ width: 30, height: 30, borderRadius: 4, overflow: 'hidden', background: '#fff', border: `2px solid ${MG.gold}`, padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Avatar a={avatar} size={30} bust />
      </button>
      <span style={{ fontWeight: 900, fontSize: 12, textShadow: '1px 1px 0 rgba(0,0,0,0.5)', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name || 'Resident'}</span>
      {(onBack || prev) && (
        <MGButton color="gold" style={{ padding: '2px 9px', fontSize: 12 }} onClick={back}>&larr; {label}</MGButton>
      )}
      {title && (
        <span style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 15, color: MG.gold, letterSpacing: -0.3, textTransform: 'uppercase', marginLeft: 2,
          textShadow: `1px 1px 0 ${MG.blueDk}, -1px -1px 0 ${MG.blueDk}, 1px -1px 0 ${MG.blueDk}, -1px 1px 0 ${MG.blueDk}, 2px 3px 0 rgba(0,0,0,0.4)`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
      )}
      <div style={{ flex: 1 }} />
      <button onClick={() => setPantryOpen(true)} title="My pantry"
        style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'linear-gradient(#63c05a, #3f8f3a)', color: '#fff', border: `2px solid ${MG.blueDk}`, borderRadius: 5, padding: '2px 8px', fontWeight: 900, fontSize: 11, cursor: 'pointer', textShadow: '1px 1px 0 rgba(0,0,0,0.4)' }}>
        <span style={{ fontSize: 13 }}>&#127822;</span>{pantryCount > 0 ? pantryCount : ''}
      </button>
      <Money bucks={bucks} tickets={tickets} />
      {pantryOpen && <Pantry onClose={() => setPantryOpen(false)} />}
    </div>
  );
}
