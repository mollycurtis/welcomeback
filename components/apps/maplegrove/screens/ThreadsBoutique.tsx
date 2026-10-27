'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { MG, MGButton, MGPanel, Coin } from '../ui';
import { Hud } from '../Hud';
import { Avatar } from '../Avatar';
import { Backdrop, Hotspot, Caption, ShopPanel } from '../Backdrop';
import { useMaple, AVATAR_COUNT, AVATAR_PRICE } from '@/store/maplegrove';
import { ResidentSprites, PlayerSprite, useTalk } from '../Residents';

export function ThreadsBoutique() {
  const avatar = useMaple((s) => s.avatar);
  const bucks = useMaple((s) => s.bucks);
  const owned = useMaple((s) => s.ownedAvatars);
  const buyAvatar = useMaple((s) => s.buyAvatar);
  const setPreset = useMaple((s) => s.setPreset);
  const { talk, panel } = useTalk();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');
  const flash = (m: string) => { setToast(m); window.setTimeout(() => setToast(''), 1600); };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Hud title="Threads" />
      <div style={{ position: 'relative', flex: 1 }}>
        <Backdrop bg="threads" people={<ResidentSprites loc="threads" bottom="10%" size={70} onTalk={talk} />}
          overlay={
            <>
              <Caption>Threads sells whole new looks. Buy one and it&apos;s yours to switch to any time.</Caption>
              {open && (
                <ShopPanel title="The Rack, pick your look" onClose={() => setOpen(false)} width="72%">
                  <div style={{ display: 'flex', gap: 10, height: '100%', minHeight: 0 }}>
                    <div style={{ flex: '0 0 110px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ fontSize: 9, fontWeight: 900, color: MG.sub, textTransform: 'uppercase' }}>Wearing</div>
                      <div style={{ width: 100, height: 170, borderRadius: 50, background: 'linear-gradient(#dff0f7,#bfe0ee)', border: `4px solid ${MG.panelEdge}`, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
                        <div style={{ height: 156, display: 'flex', alignItems: 'flex-end' }}><Avatar a={avatar} size={78} /></div>
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))', gap: 8 }}>
                        {Array.from({ length: AVATAR_COUNT }).map((_, i) => {
                          const own = owned.includes(i); const wearing = avatar.preset === i;
                          return (
                            <MGPanel key={i} pad={5} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0, background: wearing ? '#fff9dc' : MG.paper, borderColor: wearing ? MG.gold : MG.blueDk }}>
                              <div style={{ width: '100%', height: 104, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}><Avatar a={{ preset: i }} size={52} /></div>
                              {own ? (
                                <MGButton color={wearing ? 'plain' : 'purple'} disabled={wearing} style={{ width: '100%', fontSize: 10, padding: '2px 0', marginTop: 3 }} onClick={() => setPreset(i)}>{wearing ? 'Wearing' : 'Wear'}</MGButton>
                              ) : (
                                <>
                                  <div style={{ fontSize: 10, fontWeight: 900, color: MG.blueDk, margin: '2px 0' }}><Coin size={11} /> {AVATAR_PRICE}</div>
                                  <MGButton color={bucks >= AVATAR_PRICE ? 'green' : 'plain'} disabled={bucks < AVATAR_PRICE} style={{ width: '100%', fontSize: 10, padding: '2px 0' }}
                                    onClick={() => { if (buyAvatar(i)) flash('New look, it suits you.'); }}>Buy</MGButton>
                                </>
                              )}
                            </MGPanel>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </ShopPanel>
              )}
              {toast && <div style={{ position: 'absolute', left: '50%', bottom: 30, transform: 'translateX(-50%)', background: 'rgba(15,47,122,0.94)', color: '#fff', padding: '6px 14px', borderRadius: 6, border: `2px solid ${MG.gold}`, fontWeight: 700, fontSize: 12, zIndex: 31 }}>{toast}</div>}
            </>
          }>
          <Hotspot x={17} y={49} w={8} h={13} label="The Rack" sub="new looks" onClick={() => setOpen(true)} labelAt="bottom" />
          <Hotspot x={0} y={22} w={16} h={50} label="Try on a look" onClick={() => setOpen(true)} labelAt="center" />
          <PlayerSprite loc="threads" />
          {panel}
        </Backdrop>
      </div>
    </div>
  );
}
