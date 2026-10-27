'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { MG, MGButton, MGPanel, Coin } from '../ui';
import { Hud } from '../Hud';
import { Backdrop, Hotspot, Caption, ShopPanel } from '../Backdrop';
import { useMaple } from '@/store/maplegrove';
import { GROCERIES, PACKS, cardById, groceryIcon, type Grocery } from '@/lib/maplegrove/collectibles';
import { ResidentSprites, PlayerSprite, useTalk } from '../Residents';
import { CardFace } from '../Collectibles';

const TASTE_LABEL: Record<Grocery['taste'], string> = { snack: 'Snack', drink: 'Drink', produce: 'Produce', sweet: 'Sweet', book: 'Reading' };

export function MapleMart() {
  const bucks = useMaple((s) => s.bucks);
  const pantry = useMaple((s) => s.pantry);
  const buyGrocery = useMaple((s) => s.buyGrocery);
  const buyPack = useMaple((s) => s.buyPack);
  const { talk, panel } = useTalk();
  const [toast, setToast] = useState('');
  const [view, setView] = useState<null | 'shelves' | 'register'>(null);
  const [shelf, setShelf] = useState<string[]>(['snack', 'drink']);
  const [opened, setOpened] = useState<string[] | null>(null);
  const flash = (m: string) => { setToast(m); window.setTimeout(() => setToast(''), 1600); };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Hud title="Maple Mart" />
      <div style={{ position: 'relative', flex: 1 }}>
        <Backdrop bg="mart" people={<ResidentSprites loc="maplemart" bottom="12%" size={70} onTalk={talk} />}
          overlay={
            <>
              <Caption>Click the shelves to shop. Groceries go in your pantry, gold tags mark what someone in town loves.</Caption>
              {view === 'shelves' && (
                <ShopPanel title="Groceries" onClose={() => setView(null)}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: 6 }}>
                    {GROCERIES.filter((g) => shelf.includes(g.taste)).map((g) => (
                      <MGPanel key={g.id} pad={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: MG.paper, minWidth: 0 }}>
                        {groceryIcon(g.id)
                          ? <img src={groceryIcon(g.id)!} alt="" draggable={false} style={{ width: 44, height: 44, objectFit: 'contain', maxWidth: 'none' }} />
                          : <div style={{ width: 34, height: 34, borderRadius: 4, background: g.color, border: '2px solid rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}>{g.name[0]}</div>}
                        <div style={{ fontSize: 10, fontWeight: 800, marginTop: 4, textAlign: 'center', lineHeight: 1.1 }}>{g.name}</div>
                        <div style={{ fontSize: 9, color: MG.sub, fontWeight: 700 }}>{TASTE_LABEL[g.taste]}{(pantry[g.id] ?? 0) > 0 && <span style={{ color: MG.greenDk }}> · have {pantry[g.id]}</span>}</div>
                        <div style={{ fontSize: 11, fontWeight: 900, color: MG.blueDk, margin: '3px 0 4px', display: 'flex', alignItems: 'center', gap: 3 }}><Coin size={12} /> {g.price}</div>
                        <MGButton color={bucks >= g.price ? 'green' : 'plain'} disabled={bucks < g.price} style={{ width: '100%', fontSize: 11, padding: '2px 0' }}
                          onClick={() => { if (buyGrocery(g.id)) flash(`${g.name} added to your pantry.`); }}>Buy</MGButton>
                      </MGPanel>
                    ))}
                  </div>
                </ShopPanel>
              )}
              {view === 'register' && (
                <ShopPanel title="By the register" onClose={() => setView(null)} width="55%">
                  {PACKS.map((p) => (
                    <MGPanel key={p.id} pad={8} style={{ background: MG.paper, display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ width: 46, height: 62, borderRadius: 4, background: `linear-gradient(135deg, ${MG.blue}, ${MG.leaf})`, border: `2px solid ${MG.blueDk}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MG.gold, fontWeight: 900, fontSize: 9, textAlign: 'center', padding: 4, lineHeight: 1.1, flex: '0 0 46px' }}>LAND<br />MARKS</div>
                      <div style={{ flex: 1, fontSize: 11, minWidth: 0 }}>
                        <b>{p.name}</b><div style={{ color: MG.sub }}>{p.blurb}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                          <span style={{ fontWeight: 900, color: MG.blueDk }}><Coin size={12} /> {p.price}</span>
                          <MGButton color={bucks >= p.price ? 'purple' : 'plain'} disabled={bucks < p.price} style={{ fontSize: 11, padding: '2px 10px' }}
                            onClick={() => { const got = buyPack(p.id); if (got) setOpened(got); }}>Open a pack</MGButton>
                        </div>
                      </div>
                    </MGPanel>
                  ))}
                </ShopPanel>
              )}
              {opened && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,30,80,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30 }} onClick={() => setOpened(null)}>
                  <MGPanel pad={12} style={{ background: MG.paper, textAlign: 'center' }}>
                    <div style={{ fontWeight: 900, color: MG.blue, fontSize: 15, marginBottom: 8 }}>You pulled…</div>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>{opened.map((id, i) => <CardFace key={i} card={cardById(id)!} w={104} />)}</div>
                    <div style={{ fontSize: 10, color: MG.sub, marginTop: 8 }}>Cards live in your binder at Town Hall. Click anywhere to close.</div>
                  </MGPanel>
                </div>
              )}
              {toast && <div style={{ position: 'absolute', left: '50%', bottom: 30, transform: 'translateX(-50%)', background: 'rgba(15,47,122,0.94)', color: '#fff', padding: '6px 14px', borderRadius: 6, border: `2px solid ${MG.gold}`, fontWeight: 700, fontSize: 12, zIndex: 31 }}>{toast}</div>}
            </>
          }>
          <Hotspot x={1} y={12} w={41} h={44} label="Snacks and drinks" sub="chips, pretzels, cocoa, cider" onClick={() => { setShelf(['snack', 'drink']); setView('shelves'); }} labelAt="center" />
          <Hotspot x={54} y={28} w={19} h={32} label="Coolers" sub="cold drinks" onClick={() => { setShelf(['drink']); setView('shelves'); }} labelAt="top" />
          <Hotspot x={86} y={20} w={14} h={34} label="Sweets and books" sub="cookies, fudge, comics" onClick={() => { setShelf(['sweet', 'book']); setView('shelves'); }} labelAt="bottom" />
          <Hotspot x={58} y={58} w={40} h={40} label="Register" sub="card packs" onClick={() => setView('register')} />
          <Hotspot x={0} y={54} w={34} h={44} label="Produce" sub="fresh today" onClick={() => { setShelf(['produce']); setView('shelves'); }} />
          <PlayerSprite loc="maplemart" />
          {panel}
        </Backdrop>
      </div>
    </div>
  );
}
