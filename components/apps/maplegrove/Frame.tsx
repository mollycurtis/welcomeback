'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, type ReactNode } from 'react';
import { MG, FONT_TITLE, bevel } from './ui';
import { Avatar } from './Avatar';
import { useMaple, type BuddyStats } from '@/store/maplegrove';
import { RESIDENTS } from '@/lib/maplegrove/npcs';
import { Pantry } from './Pantry';

const STAT_META: { k: keyof BuddyStats; icon: string; color: string; label: string }[] = [
  { k: 'happy', icon: '🙂', color: '#3f6fb0', label: 'Happiness' }, { k: 'health', icon: '🌱', color: '#3f9a3a', label: 'Health' },
  { k: 'love', icon: '❤️', color: '#d8322a', label: 'Friendship' }, { k: 'smarts', icon: '💡', color: '#e8c64a', label: 'Smarts' }, { k: 'creative', icon: '🎨', color: '#e08a1e', label: 'Creativity' },
];

export function BuddyStatsBars({ compact, full }: { compact?: boolean; full?: boolean }) {
  const live = useMaple((s) => s.stats);
  const stats = full ? (Object.fromEntries(Object.keys(live).map((k) => [k, 100])) as unknown as typeof live) : live;
  return (
    <div>
      {STAT_META.map((m) => (
        <div key={m.k} title={`${m.label}: ${stats[m.k]}`} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: compact ? 3 : 5 }}>
          <span style={{ fontSize: compact ? 12 : 15, width: 18, textAlign: 'center' }}>{m.icon}</span>
          <div style={{ flex: 1, height: compact ? 8 : 11, background: '#0f2f7a', border: '2px solid #0a1f55', borderRadius: 3 }}>
            <div style={{ width: `${stats[m.k]}%`, height: '100%', background: m.color, transition: 'width 400ms' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SiteFrame({ children, title, active, minimal, noColumn, noHeader }: { children: ReactNode; title?: string; active?: 'town' | 'downtown' | 'arcade'; minimal?: boolean; noColumn?: boolean; noHeader?: boolean }) {
  const goTo = useMaple((s) => s.goTo); const setPhase = useMaple((s) => s.setPhase);
  const name = useMaple((s) => s.name); const avatar = useMaple((s) => s.avatar); const tickets = useMaple((s) => s.tickets);
  const mailRead = useMaple((s) => s.mailRead); const hearts = useMaple((s) => s.hearts); const streak = useMaple((s) => s.streak);
  const letters = 2 + (streak >= 3 ? 1 : 0) + RESIDENTS.reduce((n, r) => n + ((hearts[r.id] ?? 0) >= 3 ? 1 : 0) + ((hearts[r.id] ?? 0) >= 6 ? 1 : 0), 0);
  const unread = Math.max(0, letters - mailRead.length);
  const [colOpen, setColOpen] = useState(true);
  const [pantryOpen, setPantryOpen] = useState(false);
  const pantry = useMaple((s) => s.pantry);
  const pantryCount = Object.values(pantry).reduce((n, v) => n + v, 0);
  const navBtn = (label: string, icon: string, on: boolean, click: () => void) => (
    <button onClick={click} style={{ display: 'flex', alignItems: 'center', gap: 8, background: on ? MG.blueDk : 'linear-gradient(#1e4db7, #0f2f7a)', color: MG.gold, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 13, textTransform: 'uppercase', padding: '5px 16px', border: `2px solid ${MG.blueDk}`, borderRadius: 6, cursor: 'pointer', boxShadow: bevel('rgba(255,255,255,0.35)', 'rgba(0,0,0,0.4)'), textShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}>
      <span style={{ fontSize: 15 }}>{icon}</span>{label}
    </button>
  );
  const link = (label: string, click: () => void) => (
    <button onClick={click} style={{ display: 'block', width: '100%', textAlign: 'left', background: 'linear-gradient(#2a56b8, #1e4db7)', color: '#fff', fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 11, textTransform: 'uppercase', padding: '6px 10px', border: `2px solid ${MG.blueDk}`, borderRadius: 4, cursor: 'pointer', marginBottom: 4, textShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}>{label}</button>
  );
  return (
    <div style={{ minHeight: '100%', background: `linear-gradient(#5a8fe0, #2a56b8)`, fontFamily: 'Verdana, Tahoma, Arial, sans-serif', color: MG.ink, padding: 8, boxSizing: 'border-box' }}>
      {!noHeader && (<>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '6px 10px', background: `linear-gradient(#4d7be0, ${MG.blue})`, border: `3px solid ${MG.blueDk}`, borderRadius: 8, boxShadow: bevel('rgba(255,255,255,0.35)', 'rgba(0,0,0,0.4)') }}>
        <div onClick={() => goTo('map')} style={{ cursor: 'pointer', fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 26, color: MG.gold, letterSpacing: -1, lineHeight: 0.9, textTransform: 'uppercase', textShadow: `2px 2px 0 ${MG.blueDk}, -1px -1px 0 ${MG.blueDk}, 1px -1px 0 ${MG.blueDk}, -1px 1px 0 ${MG.blueDk}, 3px 4px 0 rgba(0,0,0,0.35)`, position: 'relative', paddingLeft: 26 }}>
          <span style={{ position: 'absolute', left: 0, top: -6, color: MG.leaf, fontSize: 30, textShadow: 'none' }}>🍁</span>Maple Grove<span style={{ fontSize: 10, color: '#fff', display: 'block', textAlign: 'right', letterSpacing: 0, textShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}>.com</span>
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 10, justifyContent: 'center' }}>
          {navBtn('The Town', '🏠', active === 'town', () => goTo('map'))}{navBtn('Downtown', '🏢', active === 'downtown', () => goTo('town'))}{navBtn('Arcade', '🎮', active === 'arcade', () => goTo('arcade'))}
        </div>
      </div>
      </>)}
      <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'flex-start' }}>
        {!noColumn && !colOpen && (
          <div style={{ flex: '0 0 26px', background: `linear-gradient(90deg, ${MG.blue}, #2a56b8)`, border: `3px solid ${MG.blueDk}`, borderRadius: 8, padding: '6px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <button onClick={() => setColOpen(true)} aria-label="Show member menu" style={{ width: 18, height: 18, border: `2px solid ${MG.blueDk}`, borderRadius: 3, background: `linear-gradient(#ffe98a, ${MG.gold})`, color: MG.blueDk, fontWeight: 900, fontSize: 11, lineHeight: 1, cursor: 'pointer', padding: 0 }}>▸</button>
            <div style={{ borderRadius: '50%', border: `2px solid ${MG.gold}`, lineHeight: 0 }}><Avatar a={avatar} size={22} bust /></div>
          </div>
        )}
        <div style={{ flex: '0 0 148px', display: colOpen && !noColumn ? 'block' : 'none', position: 'relative', background: `linear-gradient(90deg, ${MG.blue}, #2a56b8)`, border: `3px solid ${MG.blueDk}`, borderRadius: 8, padding: 8, boxShadow: bevel('rgba(255,255,255,0.3)', 'rgba(0,0,0,0.4)') }}>
          <button onClick={() => setColOpen(false)} aria-label="Hide member menu" style={{ position: 'absolute', top: 4, right: 4, width: 18, height: 18, border: `2px solid ${MG.blueDk}`, borderRadius: 3, background: `linear-gradient(#ffe98a, ${MG.gold})`, color: MG.blueDk, fontWeight: 900, fontSize: 11, lineHeight: 1, cursor: 'pointer', padding: 0, zIndex: 2 }}>◂</button>
          <button onClick={() => setPhase('title')} style={{ width: '100%', background: MG.blueDk, color: MG.gold, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 12, textTransform: 'uppercase', padding: '5px 0', border: `2px solid #0a1f55`, borderRadius: 6, cursor: 'pointer', marginBottom: 6 }}>◄ Sign Out</button>
          <div style={{ background: MG.blueDk, color: '#fff', fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 12, textTransform: 'uppercase', textAlign: 'center', padding: '3px 0', borderRadius: '6px 6px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name || 'Resident'}</div>
          <div onClick={minimal ? undefined : () => setPhase('create')} title={minimal ? undefined : 'Customize Buddy'} style={{ background: 'linear-gradient(#2a56b8, #1e4db7)', border: `2px solid ${MG.blueDk}`, borderTop: 'none', display: 'flex', justifyContent: 'center', padding: '6px 0 2px', cursor: minimal ? 'default' : 'pointer', marginBottom: minimal ? 6 : 0 }}><Avatar a={avatar} size={64} /></div>
          {!minimal && <>{link('Customize Buddy', () => setPhase('create'))}{link('My Stuff', () => goTo('townhall'))}{link('My Place', () => goTo('house'))}{link('My Links', () => goTo('gazette'))}</>}
          <div style={{ color: MG.gold, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 12, textTransform: 'uppercase', margin: '8px 0 4px', textShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}>Buddy Stats</div>
          <BuddyStatsBars full={minimal} />
          {!minimal && (
            <button onClick={() => setPantryOpen(true)}
              style={{ width: '100%', marginTop: 6, background: 'linear-gradient(#63c05a, #3f8f3a)', color: '#fff', fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 11, textTransform: 'uppercase', padding: '6px 0', border: `2px solid ${MG.blueDk}`, borderRadius: 6, cursor: 'pointer', textShadow: '1px 1px 0 rgba(0,0,0,0.4)' }}>
              🍎 My Pantry{pantryCount > 0 ? ` (${pantryCount})` : ''}
            </button>
          )}
          {!minimal && <>
            <div style={{ color: '#fff', fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 11, textTransform: 'uppercase', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => goTo('arcade')}>🎟️ {tickets} tickets</div>
            <div style={{ color: '#fff', fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 11, textTransform: 'uppercase', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => goTo('postoffice')}>✉️ {unread} unread</div>
            <button onClick={() => goTo('park')} style={{ width: '100%', marginTop: 10, background: MG.blueDk, color: '#fff', fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 11, textTransform: 'uppercase', padding: '8px 0', border: `2px solid #0a1f55`, borderRadius: 8, cursor: 'pointer' }}>🔍 Find a Buddy</button>
          </>}
        </div>
        <div style={{ flex: 1, minWidth: 0, background: '#dbe7fb', border: `3px solid ${MG.blueDk}`, borderRadius: 8, overflow: 'hidden', boxShadow: bevel('rgba(255,255,255,0.6)', 'rgba(0,0,0,0.25)') }}>
          {title && <div style={{ background: `linear-gradient(#4d7be0, ${MG.blue})`, color: '#fff', fontWeight: 900, fontSize: 14, padding: '6px 12px', borderBottom: `2px solid ${MG.blueDk}` }}>{title}</div>}
          {children}
        </div>
      </div>
      {pantryOpen && <Pantry onClose={() => setPantryOpen(false)} />}
    </div>
  );
}
