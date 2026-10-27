'use client';

import { useState } from 'react';
import { Hud } from '../Hud';
import { Backdrop, Hotspot, Caption } from '../Backdrop';
import { PlayerSprite } from '../Residents';
import { MGButton } from '../ui';
import { useMaple, type MGLocation } from '@/store/maplegrove';
import { currentSeason } from '@/lib/maplegrove/season';

interface Spot { name: string; loc: MGLocation; x: number; y: number; w: number; h: number; open: boolean; soon?: string }
const SHOPS: Spot[] = [
  { name: 'Town Hall',   loc: 'townhall',   x: 3.0,  y: 14, w: 14.5, h: 60, open: true },
  { name: 'Bank',        loc: 'bank',       x: 18.3, y: 30, w: 9.0,  h: 44, open: true },
  { name: 'Maple Mart',  loc: 'maplemart',  x: 27.4, y: 30, w: 11.3, h: 44, open: true },
  { name: 'Furniture',   loc: 'furniture',  x: 38.8, y: 30, w: 11.3, h: 44, open: true },
  { name: 'Threads',     loc: 'threads',    x: 50.2, y: 30, w: 9.0,  h: 44, open: true },
  { name: 'Café',        loc: 'cafe',       x: 59.3, y: 30, w: 12.7, h: 44, open: true },
  { name: 'Arcade',      loc: 'arcade',     x: 72.1, y: 30, w: 9.0,  h: 44, open: true },
  { name: 'Gazette',     loc: 'gazette',    x: 81.2, y: 30, w: 8.0,  h: 44, open: true },
  { name: 'Post Office', loc: 'postoffice', x: 89.3, y: 30, w: 8.0,  h: 44, open: true },
];

export function TownScreen() {
  const goTo = useMaple((s) => s.goTo);
  const [toast, setToast] = useState('');
  const season = currentSeason();

  const enter = (s: Spot) => { if (s.open) goTo(s.loc); else flash(s.soon ?? `${s.name} is opening soon.`); };
  const flash = (m: string) => { setToast(m); window.setTimeout(() => setToast(''), 1800); };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Hud title="Downtown" onBack={() => goTo('map')} backLabel="Map" />
      <div style={{ position: 'relative', flex: 1 }}>
        <Backdrop bg="downtown"
          overlay={
            <>
              <div style={{ position: 'absolute', left: 8, bottom: 8, zIndex: 6 }}>
                <MGButton color="green" style={{ fontSize: 12, padding: '3px 10px' }} onClick={() => goTo('oakwood')}>&larr; Rosemount (home)</MGButton>
              </div>
              <div style={{ position: 'absolute', right: 8, bottom: 8, zIndex: 6 }}>
                <MGButton color="gold" style={{ fontSize: 12, padding: '3px 10px' }} onClick={() => goTo('park')}>Grove Park &rarr;</MGButton>
              </div>
              <Caption>{season.name} is on this week. Click a building to go inside.</Caption>
              {toast && (
                <div style={{ position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%,-50%)', background: 'rgba(15,47,122,0.94)', color: '#fff', padding: '8px 16px', borderRadius: 6, border: '2px solid #f7d23e', fontWeight: 700, fontSize: 13, zIndex: 9, whiteSpace: 'nowrap' }}>
                  {toast}
                </div>
              )}
            </>
          }>
          {SHOPS.map((s) => (
            <Hotspot key={s.name} x={s.x} y={s.y} w={s.w} h={s.h} label={s.name} disabled={!s.open} sub={s.open ? undefined : 'opening soon'} onClick={() => enter(s)} labelAt="center" />
          ))}
          <PlayerSprite loc="town" />
        </Backdrop>
      </div>
    </div>
  );
}
