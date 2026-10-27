'use client';

import { useState } from 'react';
import { MG, MGButton, MGPanel, Coin } from '../ui';
import { Hud } from '../Hud';
import { Backdrop, Caption, ShopPanel, Hotspot } from '../Backdrop';
import { Furniture } from '../Furniture';
import { useMaple } from '@/store/maplegrove';
import { byId, WALLPAPERS, BEDROOM_WALLS } from '@/lib/maplegrove/catalog';
import { RARITIES } from '@/lib/maplegrove/avatar';
import { ResidentSprites, useTalk } from '../Residents';

export function FurnitureStore() {
  const stock = useMaple((s) => s.storeStock);
  const bucks = useMaple((s) => s.bucks);
  const buy = useMaple((s) => s.buyFurniture);
  const buyWall = useMaple((s) => s.buyWall);
  const ownedWall = useMaple((s) => s.ownedWall);
  const [tab, setTab] = useState<'furniture' | 'surfaces'>('furniture');
  const [toast, setToast] = useState('');
  const [open, setOpen] = useState(false);
  const flash = (m: string) => { setToast(m); window.setTimeout(() => setToast(''), 1500); };
  const { talk, panel } = useTalk();

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Hud title="Maple Furniture" />
      <div style={{ position: 'relative', flex: 1 }}>
        <Backdrop bg="furniture" people={<ResidentSprites loc="furniture" onTalk={talk} />}
          overlay={
            <>
              <Caption>Today&apos;s stock rotates. Wallpaper and floors are applied from your house.</Caption>
              {open && (<ShopPanel title={tab === 'furniture' ? 'Showroom - today\'s stock' : 'Wallpaper & Floors'} onClose={() => setOpen(false)} width="66%">
                <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                  <Tab on={tab === 'furniture'} onClick={() => setTab('furniture')}>Furniture</Tab>
                  <Tab on={tab === 'surfaces'} onClick={() => setTab('surfaces')}>Wallpaper &amp; Floors</Tab>
                </div>
                {tab === 'furniture' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 6 }}>
                    {stock.map((id) => {
                      const it = byId(id);
                      if (!it) return null;
                      const afford = bucks >= it.price;
                      return (
                        <MGPanel key={id} pad={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: MG.paper, minWidth: 0 }}>
                          <div style={{ height: 50, display: 'flex', alignItems: 'flex-end' }}>
                            <Furniture item={it} w={Math.min(80, it.w * 32)} h={46} />
                          </div>
                          <div style={{ fontSize: 10, fontWeight: 800, marginTop: 4, textAlign: 'center', lineHeight: 1.1, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <span style={{ width: 6, height: 6, borderRadius: 6, background: RARITIES[it.rarity].color, flex: '0 0 6px' }} />{it.name}
                          </div>
                          <div style={{ fontSize: 11, fontWeight: 900, color: MG.blueDk, margin: '3px 0 4px', display: 'flex', alignItems: 'center', gap: 3 }}><Coin size={12} /> {it.price}</div>
                          <MGButton color={afford ? 'green' : 'plain'} disabled={!afford} style={{ width: '100%', fontSize: 11, padding: '2px 0' }}
                            onClick={() => { if (buy(id)) flash(`Bought ${it.name}! It is in your house inventory.`); }}>{afford ? 'Buy' : 'Need more'}</MGButton>
                        </MGPanel>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 8 }}>
                    <SurfaceList title="Living Room Wallpaper" items={WALLPAPERS} owned={ownedWall} bucks={bucks}
                      onBuy={(id, name) => { if (buyWall(id)) flash(`Bought ${name}. Apply it from your house.`); }} />
                    <SurfaceList title="Bedroom Wallpaper" items={BEDROOM_WALLS} owned={ownedWall} bucks={bucks}
                      onBuy={(id, name) => { if (buyWall(id)) flash(`Bought ${name}. Apply it from your house.`); }} />
                  </div>
                )}
              </ShopPanel>)}
              {toast && <div style={{ position: 'absolute', left: '50%', bottom: 30, transform: 'translateX(-50%)', background: 'rgba(15,47,122,0.94)', color: '#fff', padding: '6px 14px', borderRadius: 6, border: `2px solid ${MG.gold}`, fontWeight: 700, fontSize: 12, zIndex: 31 }}>{toast}</div>}
            </>
          }>
          <Hotspot x={32} y={40} w={42} h={22} label="Sales counter" sub="today's stock" onClick={() => setOpen(true)} labelAt="center" />
          {panel}
        </Backdrop>
      </div>
    </div>
  );
}

function Tab({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ padding: '2px 10px', borderRadius: 4, fontWeight: 900, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
      border: `2px solid ${MG.blueDk}`, background: on ? `linear-gradient(#ffe98a, ${MG.gold})` : '#e9e2cc', color: MG.blueDk }}>
      {children}
    </button>
  );
}

function SurfaceList({ title, items, owned, bucks, onBuy }: {
  title: string; items: { id: string; name: string; price: number; rarity: string; css: string }[];
  owned: string[]; bucks: number; onBuy: (id: string, name: string) => void;
}) {
  return (
    <MGPanel pad={8} style={{ background: MG.paper }}>
      <div style={{ fontSize: 12, fontWeight: 900, color: MG.blue, marginBottom: 6, textTransform: 'uppercase' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((s) => {
          const has = owned.includes(s.id);
          const afford = bucks >= s.price;
          return (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 44, height: 32, borderRadius: 6, border: '2px solid rgba(0,0,0,0.15)', background: s.css, flex: '0 0 44px' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 800 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: '#5a4710', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                  {s.price === 0 ? 'Free' : <><Coin size={13} /> {s.price}</>}
                </div>
              </div>
              {has ? <span style={{ fontSize: 12, fontWeight: 800, color: MG.green }}>Owned</span>
                : <MGButton color={afford ? 'green' : 'plain'} disabled={!afford} style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => onBuy(s.id, s.name)}>Buy</MGButton>}
            </div>
          );
        })}
      </div>
    </MGPanel>
  );
}
