'use client';

import { useMaple } from '@/store/maplegrove';
import { groceryById, groceryIcon } from '@/lib/maplegrove/collectibles';
import { effectSummary, isReadable } from '@/lib/maplegrove/nutrition';
import { MG, MGButton, MGPanel, bevel } from './ui';
import { sounds } from '@/lib/sounds';

export function Pantry({ onClose }: { onClose: () => void }) {
  const pantry = useMaple((s) => s.pantry);
  const eatGrocery = useMaple((s) => s.eatGrocery);
  const ids = Object.keys(pantry).filter((id) => (pantry[id] ?? 0) > 0 && groceryById(id));

  const eat = (id: string) => { if (eatGrocery(id)) sounds.chime(); };

  return (
    <div onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,25,70,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 12 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 430, maxHeight: '100%', display: 'flex', flexDirection: 'column' }}>
        <MGPanel pad={0} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: `linear-gradient(${MG.blueLt}, ${MG.blue})`, color: '#fff', boxShadow: bevel('rgba(255,255,255,0.3)', 'rgba(0,0,0,0.35)') }}>
            <span style={{ fontWeight: 900, fontSize: 13, flex: 1, textShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}>My Pantry</span>
            <MGButton color="gold" style={{ fontSize: 11, padding: '2px 10px' }} onClick={onClose}>Close</MGButton>
          </div>

          <div style={{ padding: 8, overflowY: 'auto', minHeight: 0 }}>
            {ids.length === 0 ? (
              <div style={{ fontSize: 12, color: MG.sub, padding: '14px 6px', textAlign: 'center', lineHeight: 1.5 }}>
                Your pantry is empty.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 7 }}>
                {ids.map((id) => {
                  const g = groceryById(id);
                  if (!g) return null;
                  const art = groceryIcon(id);
                  const read = isReadable(id);
                  return (
                    <MGPanel key={id} pad={6} style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                        {art
                          ? <img src={art} alt="" width={26} height={26} style={{ objectFit: 'contain', flex: '0 0 26px' }} />
                          : <span style={{ width: 22, height: 22, borderRadius: 4, background: g.color, flex: '0 0 22px', border: '2px solid rgba(0,0,0,0.25)' }} />}
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</div>
                          <div style={{ fontSize: 9, color: MG.sub }}>x{pantry[id]}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 9, color: '#2f6a34', fontWeight: 700 }}>{effectSummary(id)}</div>
                      <MGButton color="green" style={{ fontSize: 10, padding: '2px 0', width: '100%' }} onClick={() => eat(id)}>
                        {read ? 'Read' : 'Eat'}
                      </MGButton>
                    </MGPanel>
                  );
                })}
              </div>
            )}
          </div>

        </MGPanel>
      </div>
    </div>
  );
}
