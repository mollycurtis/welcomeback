'use client';

import { useEffect, useState } from 'react';
import { todaysGoals } from '@/lib/maplegrove/daily';
import { Coin } from '../ui';
import { MG, FONT_TITLE, bevel } from '../ui';
import { Backdrop, Caption, Plaque } from '../Backdrop';
import { Avatar } from '../Avatar';
import { useMaple } from '@/store/maplegrove';
import { DISTRICTS, type District } from '@/lib/maplegrove/districts';
import { currentSeason } from '@/lib/maplegrove/season';

export function MapScreen() {
  const goTo = useMaple((s) => s.goTo);
  const setPhase = useMaple((s) => s.setPhase);
  const name = useMaple((s) => s.name);
  const avatar = useMaple((s) => s.avatar);
  const [hover, setHover] = useState<District | null>(null);
  const [help, setHelp] = useState(false);
  const [navOpen, setNavOpen] = useState(true);
  const [goals, setGoals] = useState(false);
  const checkIn = useMaple((s) => s.checkIn); const streak = useMaple((s) => s.streak); const goalsDone = useMaple((s) => s.goalsDone);
  const claimGoal = useMaple((s) => s.claimGoal); const addBucks = useMaple((s) => s.addBucks); const setNotice = useMaple((s) => s.setNotice);
  const activity = useMaple((s) => s.activity); const stickers = useMaple((s) => s.stickers);
  const state = useMaple();
  useEffect(() => { const r = checkIn(); if (r.newDay) setNotice(r.streak > 1 ? `Welcome back - day ${r.streak} in a row! +25 Maple Bucks allowance.` : 'Good morning! Town Hall left your 25 Maple Bucks allowance.'); if (r.streak >= 3) useMaple.getState().earnSticker('st_streak'); }, [checkIn, setNotice]);
  const today = todaysGoals();
  const claim = (g: typeof today[number]) => { claimGoal(g.id); addBucks(g.reward); setNotice(`Goal complete: ${g.text} · +${g.reward} Maple Bucks`); if (today.every((x) => goalsDone.includes(x.id) || x.id === g.id)) useMaple.getState().earnSticker('st_goals'); };
  void activity; void stickers;
  const season = currentSeason();

  const NAV: { label: string; icon: string; onClick: () => void; hint: string }[] = [
    { label: 'My Stuff', icon: '🎒', onClick: () => goTo('townhall'), hint: 'Stickers, cards, memories' },
    { label: 'My Place', icon: '🏠', onClick: () => goTo('house'), hint: 'Go home' },
    { label: 'Map', icon: '🗺️', onClick: () => goTo('map'), hint: 'You are here' },
    { label: 'Games', icon: '🎮', onClick: () => goTo('arcade'), hint: 'The Arcade' },
    { label: 'Help', icon: '❓', onClick: () => setHelp((h) => !h), hint: 'How to play' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
      {navOpen ? (
        <div style={{ position: 'relative', flex: '0 0 118px', display: 'flex', flexDirection: 'column', padding: '8px 6px', gap: 4, zIndex: 5,
          background: `linear-gradient(90deg, ${MG.blue}, ${MG.blueLt} 70%, ${MG.blue})`, borderRight: `3px solid ${MG.blueDk}`, boxShadow: bevel('rgba(255,255,255,0.3)', 'rgba(0,0,0,0.4)') }}>
          <button onClick={() => setNavOpen(false)} aria-label="Hide menu" style={{ position: 'absolute', top: 4, right: 4, zIndex: 3, width: 18, height: 18, border: `2px solid ${MG.blueDk}`, borderRadius: 3, background: `linear-gradient(#ffe98a, ${MG.gold})`, color: MG.blueDk, fontWeight: 900, fontSize: 11, lineHeight: 1, cursor: 'pointer', padding: 0 }}>◂</button>
        <div style={{ textAlign: 'center', lineHeight: 0.9, marginBottom: 6, paddingRight: 20 }}>
          <div style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 21, color: MG.gold, letterSpacing: -1, textTransform: 'uppercase', textShadow: `2px 2px 0 ${MG.blueDk}, -1px -1px 0 ${MG.blueDk}, 1px -1px 0 ${MG.blueDk}, -1px 1px 0 ${MG.blueDk}, 3px 4px 0 rgba(0,0,0,0.35)` }}>Maple<br />Grove</div>
        </div>
        <div onClick={() => setPhase('create')} role="button" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.18)', borderRadius: 4, padding: '3px 4px', border: `1px solid ${MG.blueDk}`, cursor: 'pointer' }}>
          <div style={{ borderRadius: '50%', border: `2px solid ${MG.gold}`, lineHeight: 0, flex: '0 0 auto' }}><Avatar a={avatar} size={34} bust /></div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name || 'Resident'}</div>
            
          </div>
        </div>
        {NAV.map((n) => (
          <button key={n.label} onClick={n.onClick} title={n.hint}
            style={{ display: 'flex', alignItems: 'center', gap: 7, background: n.label === 'Map' ? 'rgba(255,255,255,0.18)' : 'transparent', border: 'none', borderRadius: 4, padding: '4px 4px', cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ width: 26, height: 26, borderRadius: 13, background: '#fff', border: `2px solid ${MG.blueDk}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flex: '0 0 26px' }}>{n.icon}</span>
            <span style={{ color: '#fff', fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 11, textTransform: 'uppercase', letterSpacing: -0.2, textShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}>{n.label}</span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => { if (window.confirm('Sign out and start a new resident? Your town resets.')) useMaple.getState().resetAll(); }} style={{ background: 'transparent', border: `2px solid ${MG.blueDk}`, borderRadius: 4, color: '#fff', fontWeight: 900, fontSize: 10, padding: '4px 0', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase' }}>◂ Sign out</button>
      </div>
      ) : (
        <div style={{ flex: '0 0 26px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 0', gap: 6, zIndex: 5, background: `linear-gradient(90deg, ${MG.blue}, ${MG.blueLt})`, borderRight: `3px solid ${MG.blueDk}` }}>
          <button onClick={() => setNavOpen(true)} aria-label="Show menu" style={{ width: 18, height: 18, border: `2px solid ${MG.blueDk}`, borderRadius: 3, background: `linear-gradient(#ffe98a, ${MG.gold})`, color: MG.blueDk, fontWeight: 900, fontSize: 11, lineHeight: 1, cursor: 'pointer', padding: 0 }}>▸</button>
          <div style={{ borderRadius: '50%', border: `2px solid ${MG.gold}`, lineHeight: 0 }}><Avatar a={avatar} size={22} bust /></div>
        </div>
      )}

      <div style={{ flex: 1, position: 'relative', minWidth: 0, background: '#2f4a1e' }}>
        <Backdrop bg="map"
          overlay={
            <>
              <div style={{ position: 'absolute', bottom: 8, right: 8, pointerEvents: 'none', zIndex: 30 }}>
                <span style={{ display: 'inline-block', background: 'rgba(15,47,122,0.9)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 9px', borderRadius: 4, borderLeft: `4px solid ${season.accent}`, border: `2px solid ${MG.gold}` }}>
                  {season.name} is on in Grove Park
                </span>
              </div>
              <Caption>{hover ? `Click to visit ${hover.name}` : 'Click a district to visit it.'}</Caption>
              <div style={{ position: 'absolute', left: 8, bottom: 8, zIndex: 30, width: goals ? 210 : 'auto' }}>
                {goals ? (
                  <div style={{ background: 'rgba(255,246,220,0.96)', border: `3px solid ${MG.blueDk}`, borderRadius: 6, boxShadow: bevel(), padding: 8, fontSize: 11, color: MG.ink }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontFamily: FONT_TITLE, fontWeight: 900, color: MG.blue, fontSize: 12, textTransform: 'uppercase', flex: 1 }}>Today</span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: MG.leaf }}>{streak > 1 ? `🔥 ${streak}-day streak` : 'Day 1'}</span>
                      <button onClick={() => setGoals(false)} aria-label="Close goals" style={{ width: 20, height: 20, border: `2px solid ${MG.blueDk}`, borderRadius: 3, background: `linear-gradient(#ffe98a, ${MG.gold})`, cursor: 'pointer', fontWeight: 900, color: MG.blueDk, lineHeight: 1, padding: 0 }}>×</button>
                    </div>
                    {today.map((g) => {
                      const claimed = goalsDone.includes(g.id); const ready = !claimed && g.done(state);
                      return (
                        <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                          <span style={{ width: 14, height: 14, borderRadius: 3, border: `2px solid ${MG.blueDk}`, background: claimed ? MG.green : '#fff', color: '#fff', fontSize: 10, lineHeight: '11px', textAlign: 'center', fontWeight: 900, flex: '0 0 14px' }}>{claimed ? '✓' : ''}</span>
                          <span style={{ flex: 1, textDecoration: claimed ? 'line-through' : 'none', color: claimed ? MG.sub : MG.ink }}>{g.text}</span>
                          {ready ? <button onClick={() => claim(g)} style={{ border: `2px solid ${MG.blueDk}`, borderRadius: 4, background: `linear-gradient(#ffe98a, ${MG.gold})`, fontWeight: 900, fontSize: 10, padding: '1px 6px', cursor: 'pointer', color: MG.blueDk, fontFamily: 'inherit' }}>Claim <Coin size={9} />{g.reward}</button>
                            : <span style={{ fontSize: 10, color: MG.sub, fontWeight: 800 }}><Coin size={9} /> {g.reward}</span>}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <button onClick={() => setGoals(true)} style={{ border: `2px solid ${MG.blueDk}`, borderRadius: 4, background: `linear-gradient(#ffe98a, ${MG.gold})`, fontWeight: 900, fontSize: 11, padding: '3px 10px', cursor: 'pointer', color: MG.blueDk, fontFamily: 'inherit', boxShadow: bevel() }}>Today&apos;s goals</button>
                )}
              </div>
              {help && (
                <div onClick={() => setHelp(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 40, cursor: 'pointer' }}>
                  <div style={{ background: MG.panel, border: `3px solid ${MG.blueDk}`, borderRadius: 6, padding: 12, width: 300, boxShadow: bevel(), fontSize: 12, lineHeight: 1.4, color: MG.ink }}>
                    <div style={{ fontFamily: FONT_TITLE, fontWeight: 900, color: MG.blue, fontSize: 14, textTransform: 'uppercase', marginBottom: 6 }}>How to play</div>
                    Click anywhere on the map to visit a district. Downtown has the shops; the Arcade earns Maple Bucks and Tickets; your house is in Rosemount. Talk to residents to make friends, gifts from Maple Mart help. Everything resets when the computer turns off.
                    <div style={{ marginTop: 8, fontSize: 10, color: MG.sub }}>Click anywhere to close.</div>
                  </div>
                </div>
              )}
            </>
          }>
          {DISTRICTS.map((d) => (
            <button key={d.loc}
              onMouseEnter={() => setHover(d)} onMouseLeave={() => setHover((h) => (h?.loc === d.loc ? null : h))}
              onClick={() => goTo(d.loc)} title={d.name}
              style={{ position: 'absolute', left: `${d.cx - d.w / 2}%`, top: `${d.cy - d.h / 2}%`, width: `${d.w}%`, height: `${d.h}%`,
                cursor: 'pointer', borderRadius: 8, padding: 0, background: hover?.loc === d.loc ? 'rgba(255,240,140,0.14)' : 'transparent',
                border: hover?.loc === d.loc ? `2px dashed ${MG.gold}` : '2px dashed transparent', outline: 'none' }}>
            </button>
          ))}
          {DISTRICTS.filter((d) => d.plaque).map((d) => (
            <div key={`pl-${d.loc}`} style={{ position: 'absolute', left: `${d.lx ?? d.cx}%`, top: `${d.ly ?? d.cy}%`, transform: 'translate(-50%,-50%)', zIndex: 4, pointerEvents: 'none' }}>
              <Plaque>{d.short}</Plaque>
            </div>
          ))}
          {hover && (
            <div style={{ position: 'absolute', left: `${Math.min(80, Math.max(20, hover.lx ?? hover.cx))}%`, top: `${Math.max(16, hover.ly ?? hover.cy)}%`, transform: (hover.ly ?? hover.cy) < 34 ? 'translate(-50%,40%)' : 'translate(-50%,-150%)', maxWidth: 170, whiteSpace: 'normal', zIndex: 6,
              background: 'rgba(15,47,122,0.94)', color: '#fff', fontSize: 11, padding: '4px 10px', borderRadius: 4, border: `2px solid ${MG.gold}`, pointerEvents: 'none', textAlign: 'center' }}>
              <div style={{ fontWeight: 900, fontSize: 12, color: MG.gold }}>{hover.name}</div>
              <div style={{ opacity: 0.9 }}>{hover.purpose}</div>
            </div>
          )}
        </Backdrop>
      </div>
    </div>
  );
}
