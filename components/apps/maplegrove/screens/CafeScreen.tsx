'use client';

import { useState } from 'react';
import { MG, MGButton, MGPanel, Coin, FONT_TITLE } from '../ui';
import { Hud } from '../Hud';
import { Backdrop, Hotspot, Caption } from '../Backdrop';
import { useMaple } from '@/store/maplegrove';
import { ResidentSprites, PlayerSprite, useTalk } from '../Residents';
import { GROCERIES } from '@/lib/maplegrove/collectibles';
import { currentSeason } from '@/lib/maplegrove/season';

export function CafeScreen() {
  const bucks = useMaple((s) => s.bucks);
  const buyGrocery = useMaple((s) => s.buyGrocery);
  const { talk, panel } = useTalk();
  const [toast, setToast] = useState('');
  const [ordering, setOrdering] = useState(false);
  const flash = (m: string) => { setToast(m); window.setTimeout(() => setToast(''), 1500); };
  const menu = GROCERIES.filter((g) => ['g_cocoa', 'g_cider', 'g_cookies'].includes(g.id));
  const season = currentSeason();

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Hud title="Maple Grove Café" />
      <div style={{ position: 'relative', flex: 1 }}>
        <Backdrop bg="cafe" people={<ResidentSprites loc="cafe" bottom="12%" size={70} onTalk={talk} />}
          overlay={
            <>
              <Caption>Half the town does its thinking at the window table. Click the menu to order, or click someone to talk.</Caption>
              {ordering && (
                <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 20, width: 230 }}>
                  <MGPanel pad={8} style={{ background: '#233126', color: '#f6f0e3', border: '5px solid #8a5a30', position: 'relative' }}>
                    <button onClick={() => setOrdering(false)} aria-label="Close orders" style={{ position: 'absolute', top: -10, right: -10, width: 24, height: 24, borderRadius: 5, border: `2px solid ${MG.blueDk}`, background: `linear-gradient(#ffe98a, ${MG.gold})`, color: MG.blueDk, fontWeight: 900, cursor: 'pointer', lineHeight: 1, fontSize: 14, zIndex: 2 }}>×</button>
                    <div style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 13, textAlign: 'center', letterSpacing: 1, borderBottom: '1px dashed rgba(255,255,255,0.4)', paddingBottom: 3, marginBottom: 5, color: '#fff' }}>TODAY&apos;S ORDERS</div>
                    {menu.map((g) => (
                      <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, marginBottom: 4, whiteSpace: 'nowrap' }}>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.name}</span>
                        <span style={{ fontWeight: 800 }}><Coin size={11} /> {g.price}</span>
                        <MGButton color={bucks >= g.price ? 'gold' : 'plain'} disabled={bucks < g.price} style={{ fontSize: 10, padding: '1px 8px' }}
                          onClick={() => { if (buyGrocery(g.id)) flash(`${g.name} added to your pantry.`); }}>Order</MGButton>
                      </div>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <span style={{ fontSize: 9, opacity: 0.75, flex: 1 }}>{season.id === 'winter' ? 'peppermint cocoa all season' : season.id === 'fall' ? '' : 'iced anything, just ask'}</span>

                    </div>
                  </MGPanel>
                </div>
              )}
              {toast && <div style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-50%)', background: 'rgba(15,47,122,0.94)', color: '#fff', padding: '8px 16px', borderRadius: 6, border: `2px solid ${MG.gold}`, fontWeight: 700, fontSize: 13, zIndex: 30 }}>{toast}</div>}
            </>
          }>
          <Hotspot x={62} y={46} w={8} h={12} label="Tip jar" sub="tip June 5 MB" onClick={() => { const st = useMaple.getState(); if (st.bucks >= 5) { st.addBucks(-5); flash('You drop 5 Maple Bucks in the jar. June waves.'); } else flash('Nothing to tip with yet.'); }} labelAt="bottom" />
          <Hotspot x={50} y={3} w={25} h={27} label="Menu" sub="order something" onClick={() => setOrdering((o) => !o)} labelAt="bottom" />
          <PlayerSprite loc="cafe" />
          {panel}
        </Backdrop>
      </div>
    </div>
  );
}
