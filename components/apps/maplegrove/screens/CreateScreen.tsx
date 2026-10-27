'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { useMaple, AVATAR_COUNT } from '@/store/maplegrove';
import { Avatar } from '../Avatar';
import { SiteFrame } from '../Frame';
import { MG, FONT_TITLE, bevel } from '../ui';

const WOMEN = Array.from({ length: AVATAR_COUNT / 2 }, (_, i) => i);
const MEN = Array.from({ length: AVATAR_COUNT / 2 }, (_, i) => i + AVATAR_COUNT / 2);

export function CreateScreen() {
  const finishCreate = useMaple((s) => s.finishCreate);
  const setPhase = useMaple((s) => s.setPhase);
  const setPreset = useMaple((s) => s.setPreset);
  const current = useMaple((s) => s.avatar.preset ?? 0);
  const hasResident = useMaple((s) => !!s.joinedAt);
  const owned = useMaple((s) => s.ownedAvatars);
  const canWear = (i: number) => !hasResident || owned.includes(i);
  const [name, setName] = useState(useMaple.getState().name || '');
  const [sel, setSel] = useState(current);
  const [group, setGroup] = useState<'girl' | 'boy'>(current >= AVATAR_COUNT / 2 ? 'boy' : 'girl');
  const [nudge, setNudge] = useState(false);

  const choose = (i: number) => { if (!canWear(i)) return; setSel(i); if (hasResident) setPreset(i); };
  const save = () => { if (!name.trim()) { setNudge(true); return; } finishCreate(name, sel); };
  const roster = group === 'girl' ? WOMEN : MEN;
  const toggleBtn = (g: 'girl' | 'boy', label: string) => (
    <button onClick={() => { setGroup(g); const first = (g === 'girl' ? WOMEN : MEN).find(canWear); if (first !== undefined && (g === 'girl') !== (sel < AVATAR_COUNT / 2)) choose(first); }} style={{ flex: 1, padding: '4px 0', fontFamily: 'inherit', fontWeight: 900, fontSize: 11, cursor: 'pointer', border: `2px solid ${MG.blueDk}`, borderRadius: g === 'girl' ? '6px 0 0 6px' : '0 6px 6px 0', background: group === g ? MG.gold : '#e9e2cc', color: MG.blueDk }}>{label}</button>
  );

  return (
    <SiteFrame active="town" minimal noColumn noHeader>
      <div style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-block', background: '#fff6d0', border: `3px solid ${MG.blueDk}`, borderRadius: 8, padding: '4px 14px', fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 14, color: MG.blue, boxShadow: bevel(), whiteSpace: 'nowrap' }}>
            {hasResident ? 'Change Your Look' : 'Pick Your Character'}
          </span>
          <input value={name} maxLength={16} onChange={(e) => { setName(e.target.value); setNudge(false); }} placeholder="name your resident (required)" aria-label="Resident name" required
            style={{ flex: '1 1 140px', minWidth: 120, padding: '6px 8px', fontSize: 13, fontFamily: 'inherit', color: MG.ink, background: '#fff', border: `2px solid ${nudge ? '#d8322a' : MG.blueDk}`, borderRadius: 6, outline: 'none' }} />
          {hasResident && <button onClick={() => setPhase('play')} style={{ background: '#e9e2cc', border: `2px solid ${MG.blueDk}`, borderRadius: 6, padding: '6px 14px', fontWeight: 900, fontSize: 12, cursor: 'pointer', color: MG.blueDk, fontFamily: 'inherit' }}>Cancel</button>}
          <button onClick={save} style={{ background: `linear-gradient(#6cc262, ${MG.green})`, border: `2px solid ${MG.blueDk}`, borderRadius: 6, padding: '6px 18px', fontWeight: 900, fontSize: 12, cursor: 'pointer', color: '#fff', fontFamily: 'inherit', textShadow: '1px 1px 0 rgba(0,0,0,0.4)', whiteSpace: 'nowrap' }}>✓ Save &amp; Continue</button>
        </div>
        {nudge && <div style={{ color: '#d8322a', fontWeight: 800, fontSize: 11, marginTop: -6, marginBottom: 8 }}>Give your resident a name first.</div>}

        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'nowrap', marginTop: 14 }}>
          <div style={{ flex: '0 0 clamp(150px, 30%, 200px)' }}>
            <div style={{ background: group === 'boy' ? 'linear-gradient(#1e3a6a, #2f6fb0 60%, #3a7a3a)' : 'linear-gradient(#f7b6d6, #c98ae0 60%, #9a6fd0)', border: `3px solid ${MG.blueDk}`, borderRadius: '8px 8px 0 0', height: 290, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
              <div style={{ height: 280 }}><Avatar a={{ preset: sel }} size={145} /></div>
            </div>
            <div style={{ display: 'flex', border: `3px solid ${MG.blueDk}`, borderTop: 'none', borderRadius: '0 0 8px 8px', background: MG.blueDk, padding: 3, gap: 3 }}>
              {toggleBtn('girl', 'Girl')}{toggleBtn('boy', 'Boy')}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
              {roster.map((i) => (
                <button key={i} onClick={() => choose(i)} title={canWear(i) ? `Character ${i + 1}` : 'Sold at Threads Boutique'}
                  style={{ aspectRatio: '1 / 1.4', padding: 4, cursor: canWear(i) ? 'pointer' : 'not-allowed', borderRadius: 8, overflow: 'hidden', position: 'relative', opacity: canWear(i) ? 1 : 0.45,
                    background: sel === i ? '#fff' : 'rgba(255,255,255,0.55)',
                    border: sel === i ? `3px solid ${MG.gold}` : `2px solid ${MG.blueDk}`,
                    boxShadow: sel === i ? `0 0 0 2px ${MG.blue}` : bevel('rgba(255,255,255,0.6)', 'rgba(0,0,0,0.2)'),
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <div style={{ height: '96%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}><Avatar a={{ preset: i }} size={60} /></div>
                  {!canWear(i) && <span style={{ position: 'absolute', left: 0, right: 0, bottom: 4, textAlign: 'center', fontSize: 9, fontWeight: 900, color: MG.blueDk, background: 'rgba(255,255,255,0.85)' }}>at Threads</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SiteFrame>
  );
}
